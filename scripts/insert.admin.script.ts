import dotenv from "dotenv";
import {TenantService} from "../src/config/tenant.config";
import AdminUserModel from "../src/database/models/admin.user.model";
import UserModel from "../src/database/models/user.model";
import {TransactionManager} from "../src/database/transaction.manager";

dotenv.config();

const adminEmail: string = process.env.ADMIN_EMAL || "";
const adminPassword: string = process.env.ADMIN_PASSWORD || "";
const tenant: string = process.env.TENANT || "";

if (!adminEmail || !adminPassword) {
  console.error("ADMIN_EMAL and ADMIN_PASSWORD not found in .env");
  process.exit(1);
}

if (!tenant) {
  console.error("TENANT not found in .env");
  process.exit(1);
}

(async () => {
  const schemaName = TenantService.getTenantById(tenant).schemaName;

  const transaction = await TransactionManager.createTenantTransaction(schemaName);

  try {
    const user = await UserModel.findOne({where: {email: adminEmail}, transaction});

    if (!user) {
      const user = await UserModel.create(
        {email: adminEmail, password: adminPassword, firstName: "Admin", lastName: "User"},
        {transaction}
      );
      await AdminUserModel.create({userId: user.userId}, {transaction});
      console.log("Admin user created");
    }

    await transaction.commit();

    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
})();
