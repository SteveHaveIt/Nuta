// Cart session management
export function getCartSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `cart_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export function formatPrice(priceInCents: number): string {
  return `KES ${(priceInCents / 100).toFixed(2)}`;
}

export function addToCart(productId: number, quantity: number = 1): void {
  const sessionId = getCartSessionId();
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  
  if (!cart[sessionId]) {
    cart[sessionId] = [];
  }
  
  const existingItem = cart[sessionId].find((item: any) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart[sessionId].push({ productId, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  // Dispatch custom event to update cart counter
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}
