import { test, expect } from '@playwright/test';

test.describe('Cart Management Flow', () => {
  test('should add a product from the home page and verify cart count', async ({ page }) => {
    await page.goto('/');

    // 1. Find the first product card's Add to Cart button and click it
    const firstProductCard = page.locator('.product-card').first();
    const addToCartButton = firstProductCard.getByRole('button', { name: 'Add to Cart' });
    
    // Ensure the button is visible and click it
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // 2. Verify the cart item count in the header updates to 1
    const cartBadge = page.locator('header a[href="/cart"] span');
    await expect(cartBadge).toHaveText('1');

    // 3. Navigate to the cart page
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL('/cart');

    // 4. Verify the product is listed in the cart
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.locator('.cart-item')).toHaveCount(1);
    
    // 5. Verify the total amount is displayed
    await expect(page.getByText(/Order Total:/i)).toBeVisible();
  });

  test('should update quantity and remove item from cart', async ({ page }) => {
    await page.goto('/');

    // Add two different items to the cart
    const productCards = page.locator('.product-card');
    await productCards.nth(0).getByRole('button', { name: 'Add to Cart' }).click();
    await productCards.nth(1).getByRole('button', { name: 'Add to Cart' }).click();
    
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page.locator('.cart-item')).toHaveCount(2);

    // 1. Update quantity of the first item
    const firstItem = page.locator('.cart-item').first();
    const quantityInput = firstItem.getByRole('spinbutton');
    
    // Get initial total
    const initialTotalText = await page.locator('.order-total-amount').innerText();
    
    // Change quantity from 1 to 3
    await quantityInput.fill('3');
    
    // 2. Verify total amount changes (this is a simplified check)
    const newTotalText = await page.locator('.order-total-amount').innerText();
    await expect(newTotalText).not.toEqual(initialTotalText);

    // 3. Remove the second item
    const secondItem = page.locator('.cart-item').nth(1);
    await secondItem.getByRole('button', { name: 'Remove' }).click();

    // 4. Verify only one item remains
    await expect(page.locator('.cart-item')).toHaveCount(1);
    
    // 5. Verify cart badge updates
    const cartBadge = page.locator('header a[href="/cart"] span');
    await expect(cartBadge).toHaveText('3'); // 3 items from the first product
  });
});
