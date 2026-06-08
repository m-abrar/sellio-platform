export function isCartMenuItem(item: { title: string; url: string }): boolean {
  return item.url === '/cart' || item.title.toLowerCase() === 'cart';
}
