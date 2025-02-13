import exp from "constants";
import { test, expect } from "playwright-test-coverage";

test("admin login", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "Mr. Admin",
        email: "a@jwt.com",
        roles: [{ role: "admin" }],
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
  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
});

test("admin creates franchise", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "Mr. Admin",
        email: "a@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseReq = {
      name: "Shrek's Pizza",
      admins: [
        {
          email: "a@jwt.com",
        },
      ],
    };
    const franchiseRes = {
      name: "Shrek's Pizza",
      admins: [
        {
          email: "a@jwt.com",
          id: 1,
          name: "pizza franchise",
        },
      ],
      id: 1,
    };
    if (route.request().method() === "GET") {
      const listRes = [
        {
          id: 1,
          name: "pizzaPocket",
          admins: [{ id: 4, name: "pizza franchisee", email: "f@jwt.com" }],
          stores: [{ id: 1, name: "SLC", totalRevenue: 0 }],
        },
        {
          name: "Shrek's Pizza",
          admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
          stores: [{ id: 1, name: "Dulop", totalRevenue: 0 }],
        },
      ];

      await route.fulfill({ json: listRes });
    }
    if (route.request().method() === "POST") {
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    }
  });

  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button").filter({ hasText: /^$/ }).click();
  await page.getByRole("button").filter({ hasText: /^$/ }).click();
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Shrek's Pizza");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("a@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name: "Shrek's Pizza" })).toBeVisible();
});

test("admin deletes franchise", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "Mr. Admin",
        email: "a@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
  await page.route("*/**/api/franchise", async (route) => {
    const listRes = [
      {
        id: 1,
        name: "pizzaPocket",
        admins: [{ id: 4, name: "pizza franchisee", email: "f@jwt.com" }],
        stores: [{ id: 1, name: "SLC", totalRevenue: 0 }],
      },
      {
        name: "Shrek's Pizza",
        admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
        stores: [{ id: 1, name: "Dulop", totalRevenue: 0 }],
      },
    ];
    await expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: listRes });
  });
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page
    .getByRole("row", { name: "Shrek's Pizza pizza franchisee" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(
    page.getByRole("cell", { name: "Shrek's Pizza" })
  ).not.toBeVisible();
});

test("create store", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "Mr. Admin",
        email: "a@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseReq = {
      name: "Shrek's Pizza",
      admins: [
        {
          email: "a@jwt.com",
        },
      ],
    };
    const franchiseRes = {
      name: "Shrek's Pizza",
      admins: [
        {
          email: "a@jwt.com",
          id: 1,
          name: "pizza franchise",
        },
      ],
      id: 1,
    };
    if (route.request().method() === "GET") {
      const listRes = [
        {
          id: 1,
          name: "pizzaPocket",
          admins: [{ id: 4, name: "pizza franchisee", email: "a@jwt.com" }],
          stores: [{ id: 1, name: "SLC", totalRevenue: 0 }],
        },
        {
          id: 1,
          name: "Shrek's Pizza",
          admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
          stores: [{ id: 1, name: "Dulop", totalRevenue: 0 }],
        },
      ];

      await route.fulfill({ json: listRes });
    }
    if (route.request().method() === "POST") {
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    }
  });
  await page.route("*/**/api/franchise/1/store", async (route) => {
    const storeReq = {
      name: "Dulop",
      id: "",
    };
    const storeRes = {
      name: "Dulop",
      id: 1,
      totalRevenue: 0,
    };

    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });
  });
  await page.route("*/**/api/franchise/1", async (route) => {
    const listRes = [
      {
        id: 1,
        name: "Shrek's Pizza",
        admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
        stores: [{ id: 1, name: "Dulop", totalRevenue: 0 }],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: listRes });
  });
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Shrek's Pizza");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("a@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("link", { name: "Franchise", exact: true }).click();
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("Dulop");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name: "Dulop" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "₿" })).toBeVisible();
});

test("delete store", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  let interval = 0;
  let interval2 = 0;
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 1,
        name: "Mr. Admin",
        email: "a@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseReq = {
      name: "Shrek's Pizza",
      admins: [
        {
          email: "a@jwt.com",
        },
      ],
    };
    const franchiseRes = {
      name: "Shrek's Pizza",
      admins: [
        {
          email: "a@jwt.com",
          id: 1,
          name: "pizza franchise",
        },
      ],
      id: 1,
    };
    if (route.request().method() === "GET") {
      const listRes1 = [
        {
          id: 1,
          name: "pizzaPocket",
          admins: [{ id: 4, name: "pizza franchisee", email: "a@jwt.com" }],
          stores: [{ id: 1, name: "SLC", totalRevenue: 0 }],
        },
        {
          id: 1,
          name: "Shrek's Pizza",
          admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
          stores: [{ id: 1, name: "Dulop", totalRevenue: 0 }],
        },
      ];
      const listRes2 = [
        {
          id: 1,
          name: "pizzaPocket",
          admins: [{ id: 4, name: "pizza franchisee", email: "a@jwt.com" }],
          stores: [{ id: 1, name: "SLC", totalRevenue: 0 }],
        },
      ];

      if (interval2 === 0) {
        await route.fulfill({ json: listRes1 });
      } else {
        await route.fulfill({ json: listRes2 });
      }
      interval2 += 1;
    }
    if (route.request().method() === "POST") {
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    }
  });
  await page.route("*/**/api/franchise/1/store", async (route) => {
    const storeReq = {
      name: "Dulop",
      id: "",
    };
    const storeRes = {
      name: "Dulop",
      id: 1,
      totalRevenue: 0,
    };

    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });
  });
  await page.route("*/**/api/franchise/1", async (route) => {
    const listRes1 = [
      {
        id: 1,
        name: "Shrek's Pizza",
        admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
        stores: [{ id: 1, name: "Dulop", totalRevenue: 0 }],
      },
    ];
    const listRes2 = [
      {
        id: 1,
        name: "Shrek's Pizza",
        admins: [{ id: 1, name: "pizza franchisee", email: "a@jwt.com" }],
        stores: [],
      },
    ];
    expect(route.request().method()).toBe("GET");
    if (interval === 0) {
      await route.fulfill({ json: listRes1 });
    } else {
      await route.fulfill({ json: listRes2 });
    }
    interval += 1;
  });
  await page.route("*/**/api/franchise/1/store/1", async (route) => {
    const deleteRes = { message: "store deleted", status: 200 };
    await route.fulfill({ json: deleteRes });
  });
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page
    .getByRole("row", { name: "Dulop 0 ₿ Close" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("cell", { name: "Dulop" })).not.toBeVisible();
});
