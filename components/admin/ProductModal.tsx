"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

// ─── Types ──────────────────────────────────────────────────────────────────
// `Variant` matches the flat shape your backend already stores and your
// ProductDetail page already reads: { type, value, stock, priceAdjustment }

export interface Variant {
  _id?: string;
  type: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

export interface Category {
  _id: string;
  name: string;
}

export interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  category: string;
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  variants: Variant[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the finished form data. Throw inside this to keep the modal open and show an error toast. */
  onSave: (data: ProductFormData) => Promise<void> | void;
  /** Pass an existing product to edit it; omit/null to create a new one. */
  initialData?: ProductFormData | null;
  categories: Category[];
}

// ─── Internal UI-only shapes ────────────────────────────────────────────────
// The backend stores variants as a flat list. In the UI it's easier for an
// admin to manage them grouped by type ("Curl" → Classic, Volume, Hybrid),
// so we group on load and flatten again right before saving.

interface VariantValueRow {
  uid: string;
  _id?: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

interface VariantGroup {
  uid: string;
  type: string;
  isCustomType: boolean;
  values: VariantValueRow[];
}

const PRESET_VARIANT_TYPES = ["Curl", "Length", "Color", "Size", "Material"];

const makeUid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  comparePrice: null,
  category: "",
  stock: 0,
  lowStockThreshold: 5,
  isFeatured: false,
  isActive: true,
  tags: [],
  variants: [],
};

const groupVariants = (variants: Variant[]): VariantGroup[] => {
  const map = new Map<string, VariantGroup>();
  variants.forEach((v) => {
    if (!map.has(v.type)) {
      map.set(v.type, {
        uid: makeUid(),
        type: v.type,
        isCustomType: !PRESET_VARIANT_TYPES.includes(v.type),
        values: [],
      });
    }
    map.get(v.type)!.values.push({
      uid: makeUid(),
      _id: v._id,
      value: v.value,
      stock: v.stock,
      priceAdjustment: v.priceAdjustment,
    });
  });
  return Array.from(map.values());
};

const flattenVariants = (groups: VariantGroup[]): Variant[] =>
  groups.flatMap((g) =>
    g.values.map((v) => ({
      ...(v._id ? { _id: v._id } : {}),
      type: g.type.trim(),
      value: v.value.trim(),
      stock: v.stock,
      priceAdjustment: v.priceAdjustment,
    }))
  );

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(initialData?._id);

  // Reset/load form data every time the modal opens
  useEffect(() => {
    if (isOpen) {
      const data = initialData || emptyForm;
      setForm(data);
      setVariantGroups(groupVariants(data.variants || []));
      setActiveTab("basic");
      setTagInput("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // ── Basic field handlers ────────────────────────────────────────────────
  const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || form.tags.includes(trimmed)) {
      setTagInput("");
      return;
    }
    updateField("tags", [...form.tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField("tags", form.tags.filter((t) => t !== tag));
  };

  // ── Variant group handlers ──────────────────────────────────────────────
  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      {
        uid: makeUid(),
        type: "",
        isCustomType: false,
        values: [{ uid: makeUid(), value: "", stock: 0, priceAdjustment: 0 }],
      },
    ]);
  };

  const removeVariantGroup = (groupUid: string) => {
    setVariantGroups((prev) => prev.filter((g) => g.uid !== groupUid));
  };

  const updateGroupType = (groupUid: string, type: string) => {
    setVariantGroups((prev) => prev.map((g) => (g.uid === groupUid ? { ...g, type } : g)));
  };

  const toggleCustomType = (groupUid: string, isCustom: boolean) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.uid === groupUid ? { ...g, isCustomType: isCustom, type: isCustom ? "" : g.type } : g
      )
    );
  };

  const addVariantValue = (groupUid: string) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.uid === groupUid
          ? { ...g, values: [...g.values, { uid: makeUid(), value: "", stock: 0, priceAdjustment: 0 }] }
          : g
      )
    );
  };

  const removeVariantValue = (groupUid: string, valueUid: string) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.uid === groupUid ? { ...g, values: g.values.filter((v) => v.uid !== valueUid) } : g
      )
    );
  };

  const updateVariantValue = (
    groupUid: string,
    valueUid: string,
    field: "value" | "stock" | "priceAdjustment",
    newValue: string
  ) => {
    setVariantGroups((prev) =>
      prev.map((g) => {
        if (g.uid !== groupUid) return g;
        return {
          ...g,
          values: g.values.map((v) => {
            if (v.uid !== valueUid) return v;
            if (field === "value") return { ...v, value: newValue };
            const num = field === "stock" ? parseInt(newValue, 10) : parseFloat(newValue);
            return { ...v, [field]: isNaN(num) ? 0 : num };
          }),
        };
      })
    );
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validateVariants = (): string | null => {
    const seenTypes = new Set<string>();
    for (const g of variantGroups) {
      const trimmedType = g.type.trim();
      if (!trimmedType) return "Every variant needs a type name (e.g. Curl, Length, Color).";
      if (seenTypes.has(trimmedType.toLowerCase())) {
        return `"${trimmedType}" is used more than once. Combine its values into one group.`;
      }
      seenTypes.add(trimmedType.toLowerCase());
      if (g.values.length === 0) return `Add at least one value under "${trimmedType}".`;

      const seenValues = new Set<string>();
      for (const v of g.values) {
        const trimmedValue = v.value.trim();
        if (!trimmedValue) return `Every value under "${trimmedType}" needs a name.`;
        if (seenValues.has(trimmedValue.toLowerCase())) {
          return `"${trimmedValue}" is repeated under "${trimmedType}".`;
        }
        seenValues.add(trimmedValue.toLowerCase());
        if (v.stock < 0) return `Stock for "${trimmedValue}" can't be negative.`;
        if (v.priceAdjustment < 0) return `Price adjustment for "${trimmedValue}" can't be negative.`;
      }
    }
    return null;
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required.");
      setActiveTab("basic");
      return;
    }
    if (!form.category) {
      toast.error("Please choose a category.");
      setActiveTab("basic");
      return;
    }
    if (form.price <= 0) {
      toast.error("Price must be greater than zero.");
      setActiveTab("basic");
      return;
    }

    const variantError = validateVariants();
    if (variantError) {
      toast.error(variantError);
      setActiveTab("variants");
      return;
    }

    const payload: ProductFormData = {
      ...form,
      variants: flattenVariants(variantGroups),
    };

    try {
      setSaving(true);
      await onSave(payload);
      toast.success(isEditMode ? "Product updated!" : "Product created!");
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const totalVariantCombinations = variantGroups.reduce(
    (acc, g) => (g.values.length > 0 ? acc * g.values.length : acc),
    1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "basic"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("variants")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "variants"
                ? "border-[#C9A84C] text-[#C9A84C]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Variants
            {variantGroups.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {variantGroups.length}
              </span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "basic" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Lash Bed"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  placeholder="Describe the product..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Price (₦) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Compare Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.comparePrice ?? ""}
                    onChange={(e) =>
                      updateField("comparePrice", e.target.value ? parseFloat(e.target.value) : null)
                    }
                    placeholder="Optional"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none appearance-none bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => updateField("stock", parseInt(e.target.value, 10) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                  />
                  {variantGroups.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      With variants added, stock is tracked per variant instead.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  min={0}
                  value={form.lowStockThreshold}
                  onChange={(e) => updateField("lowStockThreshold", parseInt(e.target.value, 10) || 0)}
                  className="w-32 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                  />
                  <button
                    onClick={addTag}
                    type="button"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 bg-yellow-50 text-[#C9A84C] text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => updateField("isFeatured", e.target.checked)}
                    className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                  />
                  Featured product
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateField("isActive", e.target.checked)}
                    className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                  />
                  Active (visible in store)
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {variantGroups.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500 text-sm mb-3 px-6">
                    No variants yet. Add one to offer options like curl type, length, or color —
                    each with its own stock and price.
                  </p>
                  <button
                    onClick={addVariantGroup}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-yellow-600 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    <Plus size={16} /> Add Variant Type
                  </button>
                </div>
              ) : (
                <>
                  {variantGroups.map((group) => (
                    <div key={group.uid} className="border border-gray-200 rounded-xl p-4">
                      {/* Group header: type selector */}
                      <div className="flex items-center gap-2 mb-3">
                        {group.isCustomType ? (
                          <input
                            type="text"
                            value={group.type}
                            onChange={(e) => updateGroupType(group.uid, e.target.value)}
                            placeholder="Custom type name, e.g. Scent"
                            autoFocus
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                          />
                        ) : (
                          <div className="relative flex-1">
                            <select
                              value={group.type}
                              onChange={(e) => {
                                if (e.target.value === "__custom__") {
                                  toggleCustomType(group.uid, true);
                                } else {
                                  updateGroupType(group.uid, e.target.value);
                                }
                              }}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none appearance-none bg-white"
                            >
                              <option value="">Choose variant type</option>
                              {PRESET_VARIANT_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                              <option value="__custom__">Custom...</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                          </div>
                        )}
                        {group.isCustomType && (
                          <button
                            onClick={() => toggleCustomType(group.uid, false)}
                            type="button"
                            className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
                          >
                            Use preset instead
                          </button>
                        )}
                        <button
                          onClick={() => removeVariantGroup(group.uid)}
                          type="button"
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove variant type"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Column labels */}
                      {group.values.length > 0 && (
                        <div className="grid grid-cols-[1fr_90px_110px_32px] gap-2 px-1 mb-1.5">
                          <span className="text-xs font-medium text-gray-400">Value</span>
                          <span className="text-xs font-medium text-gray-400">Stock</span>
                          <span className="text-xs font-medium text-gray-400">+/- Price (₦)</span>
                          <span></span>
                        </div>
                      )}

                      {/* Value rows */}
                      <div className="space-y-2">
                        {group.values.map((v) => (
                          <div key={v.uid} className="grid grid-cols-[1fr_90px_110px_32px] gap-2 items-center">
                            <input
                              type="text"
                              value={v.value}
                              onChange={(e) => updateVariantValue(group.uid, v.uid, "value", e.target.value)}
                              placeholder="e.g. Classic"
                              className="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                            />
                            <input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={(e) => updateVariantValue(group.uid, v.uid, "stock", e.target.value)}
                              className="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                            />
                            <input
                              type="number"
                              min={0}
                              value={v.priceAdjustment}
                              onChange={(e) => updateVariantValue(group.uid, v.uid, "priceAdjustment", e.target.value)}
                              className="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                            />
                            <button
                              onClick={() => removeVariantValue(group.uid, v.uid)}
                              type="button"
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove value"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => addVariantValue(group.uid)}
                        type="button"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A84C] hover:text-yellow-700 transition-colors"
                      >
                        <Plus size={14} /> Add value
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addVariantGroup}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 hover:border-[#C9A84C] text-gray-600 hover:text-[#C9A84C] rounded-lg text-sm font-semibold transition-colors w-full justify-center"
                  >
                    <Plus size={16} /> Add Another Variant Type
                  </button>

                  {totalVariantCombinations > 1 && (
                    <p className="text-xs text-gray-400 text-center">
                      Customers will see {totalVariantCombinations} possible combination
                      {totalVariantCombinations !== 1 ? "s" : ""} across {variantGroups.length} option
                      {variantGroups.length !== 1 ? "s" : ""}.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="button"
            disabled={saving}
            className="px-6 py-2.5 bg-[#C9A84C] hover:bg-yellow-600 disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}