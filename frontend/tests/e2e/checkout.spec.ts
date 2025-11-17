import { test, expect } from '@playwright/test';

test.describe('Successful Checkout Flow (Guest)', () => {
  test('should complete a guest checkout successfully', async ({ page }) => {
    // 1. Start by adding a product to the cart
    await page.goto('/');
    const firstProductCard = page.locator('.product-card').first();
    await firstProductCard.getByRole('button', { name: 'Add to Cart' }).click();
    
    // 2. Navigate to the cart and then to checkout
    await page.getByRole('link', { name: /cart/i }).click();
    await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL('/checkout');

    // 3. Fill in guest information
    await page.getByLabel('Email (for order updates)').fill('test.guest@example.com');
    await page.getByLabel('Phone Number (for order tracking)').fill('0712345678');
    
    // 4. Fill in delivery address
    await page.getByLabel('Delivery Address').fill('123 Test Street, Nairobi, Kenya');
    
    // 5. Select payment method (M-Pesa is default, but we'll ensure it's selected)
    await page.getByLabel('M-Pesa').check();

    // 6. Click Place Order
    await page.getByRole('button', { name: 'Place Order' }).click();

    // 7. Verify navigation to the success page
    await expect(page).toHaveURL(/order-success/);
    
    // 8. Verify success message and order details
    await expect(page.getByRole('heading', { name: 'Order Placed Successfully!' })).toBeVisible();
    
    // 9. Verify the cart is empty after checkout
    await page.getByRole('link', { name: 'Continue Shopping' }).click();
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page.getByRole('heading', { name: 'Your Cart is Empty' })).toBeVisible();
  });
});
