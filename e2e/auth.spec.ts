import { test, expect } from "@playwright/test";
import { randomUUID } from "crypto";

test.describe("authentication", () => {
  const email = `e2e-${randomUUID()}@example.com`;
  const password = "E2E-Password-123";

  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("a user can register, log in, view the dashboard, and log out", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(page.locator("h2")).toContainText("Create your account");

    await page.fill('input[name="name"]', "E2E User");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL("/login?registered=true");
    await expect(page.locator("text=Account created successfully")).toBeVisible();

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForURL("/dashboard");
    await expect(page.locator("h2")).toContainText("Hello, E2E User");

    await page.click("text=Log out");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login shows an error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "noone@example.com");
    await page.fill('input[name="password"]', "wrong-password");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });
});
