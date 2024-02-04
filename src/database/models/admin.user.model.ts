import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import UserModel from "./user.model";

export type AdminUserAttributes = {
  id: number;
  userId: string;
  createdAt: Date;
};

type AdminUserCreationAttributes = Pick<AdminUserAttributes, "userId">;

class AdminUserModel extends Model<AdminUserAttributes, AdminUserCreationAttributes> {
  declare id: number;
  declare userId: string;
  declare createdAt: Date;
  declare user?: UserModel;
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
  foreignKey: "user_id",
  as: "user",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default AdminUserModel;
