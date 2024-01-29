import {genSaltSync, hashSync} from "bcrypt";
import {DataTypes, Model} from "sequelize";
import {IUser} from "../../domain/interfaces/IUser";
import sequelize from "../sequelize";

type UserAttributes = {
  userId: string;
  email: string;
  password: string;
  firstName: string | undefined;
  lastName: string | undefined;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | undefined;
};

type UserCreationAttributes = Pick<UserAttributes, "email" | "password">;

class UserModel extends Model<UserAttributes, UserCreationAttributes> implements IUser {
  declare userId: string | undefined;
  declare email: string;
  declare password: string | undefined;
  declare firstName: string | undefined;
  declare lastName: string | undefined;
  declare createdAt: Date | undefined;
  declare updatedAt: Date | undefined;
  declare deletedAt: Date | undefined;
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
