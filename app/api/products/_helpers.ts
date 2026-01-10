export function normalizeProduct(p: any) {
  const stock = typeof p.stock === 'number' ? p.stock : (p?.variants ? p.variants.reduce((s: number, v: any) => s + (v.stock || 0), 0) : 0);
  const inStock = (p.inStock !== undefined) ? p.inStock : stock > 0;
  const isLowStock = (p.isLowStock !== undefined) ? p.isLowStock : (stock > 0 && stock <= 5);
  return { ...p, stock, inStock, isLowStock };
}
