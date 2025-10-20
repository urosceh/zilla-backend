import AdminUserModel from "../database/models/admin.user.model";
import UserModel from "../database/models/user.model";

// Get command line arguments
const args = process.argv.slice(2);
const adminEmail = args[0];
const adminPassword = args[1];

if (!adminEmail || !adminPassword) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD not found in ARGS");
  process.exit(1);
}

(async () => {
  try {
    const adminUser = await UserModel.create(
      {
        email: adminEmail,
        password: adminPassword,
        firstName: "Admin",
        lastName: "Admin",
      },
      {
        returning: true,
      }
    );

    await AdminUserModel.create({userId: adminUser.userId});

    console.log(`Admin user created successfully! Email: ${adminEmail}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }

  process.exit(0);
})();
