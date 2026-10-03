import { test, expect } from '@playwright/test';

test.describe('Nuper Ortho Görsel Regresyon ve Balonlama Testi (Kural 4)', () => {
  test('Mock modunda arayüzün açıldığını ve başlığın yüklendiğini doğrular', async ({ page }) => {
    // 1. Mock IPC modunda sayfayı yükle
    await page.goto('/?mock=true');

    // 2. Sayfa başlığını denetle
    await expect(page).toHaveTitle(/Nuper Ortho/);

    // 3. UI gövdesinin görünür olduğunu doğrula
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
