import {genSaltSync, hashSync} from "bcrypt";
import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import AdminUserModel from "./admin.user.model";

export type UserAttributes = {
  userId: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type UserCreationAttributes = Pick<UserAttributes, "email" | "password">;

export type UserUpdateAttributes = Partial<Pick<UserAttributes, "firstName" | "lastName">>;

class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  declare userId: string;
  declare email: string;
  declare password: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  declare admin?: AdminUserModel;
}

UserModel.init(
  {
    userId: {
      type: DataTypes.UUIDV4,
      field: "user_id",
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.TIME,
      field: "email",
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      field: "password",
      allowNull: false,
      set(value: string) {
        this.setDataValue("password", hashSync(value, genSaltSync(10)));
      },
    },
    firstName: {
      type: DataTypes.TEXT,
      field: "first_name",
      allowNull: true,
    },
    lastName: {
      type: DataTypes.TEXT,
      field: "last_name",
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at",
      allowNull: true,
    },
  },
  {
    sequelize: sequelize,
    tableName: "zilla_user",
    timestamps: true,
    paranoid: true,
  }
);

export default UserModel;
