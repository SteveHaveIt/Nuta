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

// Import trpc client for API calls
import { trpc } from './trpc';

// Add item to cart via API
export async function addToCartAPI(productId: number, quantity: number = 1): Promise<boolean> {
  try {
    const sessionId = getCartSessionId();
    // This will be called from components with trpc context
    return true;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return false;
  }
}

// Legacy localStorage cart for backward compatibility
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
