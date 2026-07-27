"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, X, Loader, Upload,
  ChevronDown, ChevronUp, Scissors
} from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";
const UPLOAD_URL = "https://luluartistry-backend.onrender.com/uploads/products";

const CATEGORIES = ["lashes", "brows", "signature"];
const ARTIST_TYPES = ["lulu", "senior", "artist"];
const ARTIST_LABELS: Record<string, string> = {
  lulu:   "Lulu (Lead Artist)",
  senior: "Senior Artist",
  artist: "Artist",
};

interface ServicePricing {
  artistType: string;
  price: number;
}

interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  pricing: ServicePricing[];
  benefits: string[];
  requirements: string[];
  aftercare: string[];
  image?: { url?: string; publicId?: string };
  isActive: boolean;
}

// ── Duration helpers ──────────────────────────────────────────────────────────
const parseDuration = (input: string): number => {
  const str = input.toLowerCase().trim();
  let minutes = 0;
  const hourMatch = str.match(/(\d+)\s*h/);
  const minMatch  = str.match(/(\d+)\s*m/);
  const pureNum   = str.match(/^(\d+)$/);
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch)  minutes += parseInt(minMatch[1]);
  if (pureNum && !hourMatch && !minMatch) minutes = parseInt(pureNum[1]);
  return minutes;
};

const formatDuration = (minutes: number): string => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minute${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${h} hour${h !== 1 ? "s" : ""}`;
  return `${h} hour${h !== 1 ? "s" : ""} ${m} minute${m !== 1 ? "s" : ""}`;
};
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  category: "lashes",
  description: "",
  duration: 60,
  durationText: "1 hour",
  pricing: ARTIST_TYPES.map(t => ({ artistType: t, price: "" as string | number })),
  benefits: [""],
  requirements: [""],
  aftercare: [""],
  imageUrl: "",
  isActive: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = getToken();
const res = await fetch(`${BASE_URL}/services?admin=true`, {
  headers: { Authorization: `Bearer ${token}` }
});
      const json = await res.json();
      setServices(json?.data || []);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData(EMPTY_FORM);
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      duration: service.duration,
      durationText: formatDuration(service.duration),
      pricing: ARTIST_TYPES.map(t => {
        const existing = service.pricing.find(p => p.artistType === t);
        return { artistType: t, price: existing?.price ?? "" };
      }),
      benefits: service.benefits?.length ? service.benefits : [""],
      requirements: service.requirements?.length ? service.requirements : [""],
      aftercare: service.aftercare?.length ? service.aftercare : [""],
      imageUrl: service.image?.url || "",
      isActive: service.isActive,
    });
    setImagePreview(service.image?.url || "");
    setShowModal(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("images", file);
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      const url = json?.images?.[0]?.url || json?.data?.url || json?.url;
      if (url) {
        setImagePreview(url);
        setFormData(prev => ({ ...prev, imageUrl: url }));
        toast.success("Image uploaded!");
      } else throw new Error("No URL returned");
    } catch {
      toast.error("Image upload failed. Paste a URL instead.");
    } finally {
      setUploadingImage(false);
    }
  };

  const updateListField = (
    field: "benefits" | "requirements" | "aftercare",
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addListItem = (field: "benefits" | "requirements" | "aftercare") => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field: "benefits" | "requirements" | "aftercare", index: number) => {
    setFormData(prev => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  };

  const updatePrice = (index: number, value: string) => {
    const pricing = [...formData.pricing];
    pricing[index] = { ...pricing[index], price: value === "" ? "" : Number(value) };
    setFormData(prev => ({ ...prev, pricing }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.duration) {
      toast.error("Please fill in name, description and duration");
      return;
    }
    const validPricing = formData.pricing.filter(p => Number(p.price) > 0);
    if (validPricing.length === 0) {
      toast.error("Please set at least one price");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        duration: Number(formData.duration),
        pricing: validPricing.map(p => ({ artistType: p.artistType, price: Number(p.price) })),
        benefits: formData.benefits.filter(b => b.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        aftercare: formData.aftercare.filter(a => a.trim()),
        isActive: formData.isActive,
        ...(formData.imageUrl ? { image: { url: formData.imageUrl } } : {}),
      };

      const url = editingService
        ? `${BASE_URL}/services/${editingService._id}`
        : `${BASE_URL}/services`;
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed to save");

      toast.success(editingService ? "Service updated!" : "Service created!");
      setShowModal(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Service deleted");
      setDeleteConfirm(null);
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const formatPrice = (p: number) => `₦${p.toLocaleString("en-NG")}`;

  const getPriceRange = (pricing: ServicePricing[]) => {
    if (!pricing?.length) return "—";
    const prices = pricing.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage booking services — {services.length} total
          </p>
        </div>
        <button onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="animate-spin text-yellow-500" size={32} />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-gray-400">
          <Scissors size={48} className="mb-3 opacity-30" />
          <p className="font-medium">No services yet</p>
          <p className="text-sm mt-1">Click "Add Service" to create your first service</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 p-5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-yellow-50 flex-shrink-0">
                  {service.image?.url ? (
                    <img src={service.image.url} alt={service.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Scissors size={24} className="text-yellow-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium capitalize">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{service.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                    <span>⏱ {formatDuration(service.duration)}</span>
                    <span>💰 {getPriceRange(service.pricing)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedId(expandedId === service._id ? null : service._id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    {expandedId === service._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <button onClick={() => openEditModal(service)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => setDeleteConfirm(service._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {expandedId === service._id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Pricing by Artist</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {service.pricing.map(p => (
                      <div key={p.artistType} className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500">{ARTIST_LABELS[p.artistType]}</p>
                        <p className="font-bold text-gray-800">{formatPrice(p.price)}</p>
                      </div>
                    ))}
                  </div>
                  {service.benefits?.filter(b => b).length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {service.benefits.filter(b => b).map((b, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {deleteConfirm === service._id && (
                <div className="border-t border-red-100 bg-red-50 px-5 py-4 flex items-center justify-between">
                  <p className="text-sm text-red-700 font-medium">
                    Delete "{service.name}"? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => handleDelete(service._id)}
                      className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <button onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Service Name *</label>
                    <input type="text" value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Classic Lash Extensions"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <select value={formData.category}
                      onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
                      {CATEGORIES.map(c => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea value={formData.description} rows={3}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the service..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" />
                </div>

                {/* ── Fix 3: Human-readable duration ──────────────────────── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    value={formData.durationText}
                    onChange={e => {
                      const text = e.target.value;
                      const mins = parseDuration(text);
                      setFormData(p => ({
                        ...p,
                        durationText: text,
                        duration: mins || p.duration,
                      }));
                    }}
                    onBlur={e => {
                      const mins = parseDuration(e.target.value);
                      if (mins > 0) {
                        setFormData(p => ({
                          ...p,
                          durationText: formatDuration(mins),
                          duration: mins,
                        }));
                      }
                    }}
                    placeholder="e.g. 1 hour, 1 hour 30 minutes, 90 minutes"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  {formData.duration > 0 && (
                    <p className="text-xs text-gray-400 mt-1">= {formData.duration} minutes</p>
                  )}
                </div>

                {/* ── Fix 2: Pricing with empty start ─────────────────────── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Pricing by Artist *</label>
                  <div className="space-y-3">
                    {formData.pricing.map((p, i) => (
                      <div key={p.artistType} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-40 flex-shrink-0">
                          {ARTIST_LABELS[p.artistType]}
                        </span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                          <input
                            type="number"
                            value={p.price === "" ? "" : p.price}
                            min={0}
                            onChange={e => updatePrice(i, e.target.value)}
                            onFocus={e => e.target.select()}
                            placeholder="Enter price"
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Image</label>
                  {imagePreview && (
                    <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden bg-gray-100">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => { setImagePreview(""); setFormData(p => ({ ...p, imageUrl: "" })); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                      <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-60">
                        {uploadingImage ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">— or paste an image URL —</p>
                    <input type="text" value={formData.imageUrl}
                      onChange={e => { setFormData(p => ({ ...p, imageUrl: e.target.value })); setImagePreview(e.target.value); }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits</label>
                  {formData.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={b}
                        onChange={e => updateListField("benefits", i, e.target.value)}
                        placeholder="e.g. Lasts 4-6 weeks"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                      <button onClick={() => removeListItem("benefits", i)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addListItem("benefits")}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
                    <Plus size={14} /> Add benefit
                  </button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                  {formData.requirements.map((r, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={r}
                        onChange={e => updateListField("requirements", i, e.target.value)}
                        placeholder="e.g. Come with clean, makeup-free eyes"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                      <button onClick={() => removeListItem("requirements", i)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addListItem("requirements")}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
                    <Plus size={14} /> Add requirement
                  </button>
                </div>

                {/* Aftercare */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aftercare Instructions</label>
                  {formData.aftercare.map((a, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="text" value={a}
                        onChange={e => updateListField("aftercare", i, e.target.value)}
                        placeholder="e.g. Avoid water for 24 hours"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                      <button onClick={() => removeListItem("aftercare", i)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addListItem("aftercare")}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
                    <Plus size={14} /> Add aftercare instruction
                  </button>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-gray-700">Active</label>
                  <button onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? "bg-yellow-500" : "bg-gray-300"
                    }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                  <span className="text-sm text-gray-500">
                    {formData.isActive ? "Visible to customers" : "Hidden from customers"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader size={16} className="animate-spin" />}
                  {saving ? "Saving..." : editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}