export function generateSKU(productId: string): string {
  const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  return `${productId}-${uniqueSuffix}`;
}
