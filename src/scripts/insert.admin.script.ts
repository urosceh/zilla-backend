import AdminUserModel from "../database/models/admin.user.model";
import UserModel from "../database/models/user.model";
import {TransactionManager} from "../database/transaction.manager";

// Get command line arguments - slice(2) to skip node and script path
const args = process.argv.slice(2);
const tenant = args[0];
const adminEmail = args[1];
const adminPassword = args[2];

if (!tenant || !adminEmail || !adminPassword) {
  console.error("TENANT, ADMIN_EMAIL and ADMIN_PASSWORD not found in ARGS");
  console.error("Usage: node insert.admin.script.ts <tenant> <adminEmail> <adminPassword>");
  process.exit(1);
}

(async () => {
  try {
    const transaction = await TransactionManager.createTenantTransaction(tenant);

    const adminUser = await UserModel.create(
      {
        email: adminEmail,
        password: adminPassword,
        firstName: "Admin",
        lastName: "Admin",
      },
      {
        returning: true,
        transaction,
      }
    );

    console.log("Admin user created", adminUser);

    await AdminUserModel.create({userId: adminUser.userId}, {transaction});
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }

  process.exit(0);
})();
