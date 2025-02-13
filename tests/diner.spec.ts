import { test, expect } from "playwright-test-coverage";

test("diner dashboard", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 3,
        name: "Mr. Tester",
        email: "d@jwt.com",
        roles: [{ role: "diner" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "MT" }).click();
  await expect(page.getByText("Your pizza kitchen")).toBeVisible();
  await expect(page.getByText("Mr. Tester")).toBeVisible();
  await expect(page.getByText("d@jwt.com")).toBeVisible();
  await expect(page.getByText("diner", { exact: true })).toBeVisible();
});

test("diner dashboard not logged in", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("link", { name: "Order" }).click();
  await page.goto("http://localhost:5173/menu");
});
