import {DataTypes, Model} from "sequelize";
import {IAdminUser} from "../../domain/interfaces/IAdminUser";
import {IUser} from "../../domain/interfaces/IUser";
import sequelize from "../sequelize";
import UserModel from "./user.model";

export type AdminUserAttributes = {
  id: number;
  userId: string;
  createdAt: Date;
  user?: UserModel;
};

type AdminUserCreationAttributes = Pick<AdminUserAttributes, "userId">;

class AdminUserModel extends Model<AdminUserAttributes, AdminUserCreationAttributes> implements IAdminUser {
  declare id: number | undefined;
  declare userId: string;
  declare createdAt: Date | undefined;
  declare user: IUser;
}

AdminUserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUIDV4,
      field: "user_id",
      primaryKey: true,
      allowNull: false,
      references: {
        model: "user",
        key: "user_id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "admin_user",
    timestamps: true,
    updatedAt: false,
    sequelize: sequelize,
  }
);

AdminUserModel.belongsTo(UserModel, {
  targetKey: "userId",
  foreignKey: {
    name: "user_id",
  },
  as: "user",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default AdminUserModel;
