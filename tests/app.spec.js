const { test, expect } = require('@playwright/test');


    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('shows the header', async ({ page }) => {
        await expect(page.locator('.header-container')).toBeVisible();
        await expect(page.locator('h1')).toContainText('Imagine that smth cool');
    });

    test('shows login button when not logged in', async ({ page }) => {
        await expect(page.locator('.header-btn.login')).toContainText('Login / Sign up');
    });

    test('opens auth modal when login button is clicked', async ({ page }) => {
        await page.locator('.header-btn.login').click();
        await expect(page.locator('.auth-modal')).toBeVisible();
        await expect(page.locator('h4')).toContainText('Welcome!');
    });

    test('shows error with wrong credentials', async ({ page }) => {
        await page.locator('.header-btn.login').click();
        await page.locator('input[type="email"]').fill('wrong@email.com');
        await page.locator('input[type="password"]').fill('wrongpassword');
        await page.locator('.auth-submit').click();
        await expect(page.locator('.auth-error')).toBeVisible();
    });

    test('can register a new user', async ({ page }) => {
        const uniqueEmail = `test${Date.now()}@test.com`;
        await page.locator('.header-btn.login').click();
        await page.locator('.auth-tab:has-text("Register")').click();
        await page.locator('input[placeholder="Username"]').fill('testuser');
        await page.locator('input[placeholder="Email"]').fill(uniqueEmail);
        await page.locator('input[placeholder="Password"]').fill('password123');
        await page.locator('input[placeholder="Confirm Password"]').fill('password123');
        await page.locator('.auth-submit').click();
        await expect(page.locator('.header-username')).toContainText('testuser');
    });

    test('can navigate to flowers section', async ({ page }) => {
        await page.locator('button:has-text("Flowers")').click();
        await expect(page.locator('.flowers-container')).toBeVisible();
    });

    test('can browse flowers with arrow buttons', async ({ page }) => {
    await page.locator('button:has-text("Flowers")').click();
    await expect(page.locator('.flower-choosing-box img'))
        .toHaveAttribute('src', '/flowersPngs/flower1.png');
    await page.locator('#forward-button').scrollIntoViewIfNeeded();
    await page.locator('#forward-button').dispatchEvent('click');
    await expect(page.locator('.flower-choosing-box img'))
        .toHaveAttribute('src', '/flowersPngs/flower2.png');
});

    test('opens flower modal on click', async ({ page }) => {
        await page.locator('button:has-text("Flowers")').click();
        await page.locator('.flower-choosing-box').click();
        await expect(page.locator('.modal-content')).toBeVisible();
        await expect(page.locator('text=Decorate your flower!')).toBeVisible();
    });

    test('closes flower modal when cancel is clicked', async ({ page }) => {
        await page.locator('button:has-text("Flowers")').click();
        await page.locator('.flower-choosing-box').click();
        await page.locator('.close-btn').click();
        await expect(page.locator('.modal-content')).not.toBeVisible();
    });

    test('shows auth modal when saving without login', async ({ page }) => {
        await page.locator('button:has-text("Flowers")').click();
        await page.locator('.flower-choosing-box').click();
        await page.locator('.save-btn').click();
        await expect(page.locator('.auth-modal')).toBeVisible();
    });

    test('can log out', async ({ page }) => {
        await page.locator('.header-btn.login').click();
        await page.locator('input[type="email"]').fill('test@test.com');
        await page.locator('input[type="password"]').fill('password123');
        await page.locator('.auth-submit').click();
        await page.locator('.header-btn.logout').click();
        await expect(page.locator('.header-btn.login')).toBeVisible();
    });
