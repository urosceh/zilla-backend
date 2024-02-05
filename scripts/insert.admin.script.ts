import dotenv from "dotenv";
import AdminUserModel from "../src/database/models/admin.user.model";
import UserModel from "../src/database/models/user.model";

dotenv.config();

const adminEmail: string = process.env.ADMIN_EMAL || "";
const adminPassword: string = process.env.ADMIN_PASSWORD || "";

if (!adminEmail || !adminPassword) {
  console.error("ADMIN_EMAL and ADMIN_PASSWORD not found in .env");
  process.exit(1);
}

(async () => {
  const user = await UserModel.findOne({where: {email: adminEmail}});

  if (!user) {
    const user = await UserModel.create({email: adminEmail, password: adminPassword});
    await AdminUserModel.create({userId: user.userId});
    console.log("Admin user created");
  }

  process.exit(0);
})();
