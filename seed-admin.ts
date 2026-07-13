import { auth } from "./src/lib/auth";

async function seedAdmin() {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "admin@admin.com",
        password: "admin123",
        name: "Admin Sabu",
      },
    });
    console.log("Admin created successfully:", res);
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
}

seedAdmin();
