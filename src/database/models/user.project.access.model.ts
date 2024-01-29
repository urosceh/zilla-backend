import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import ProjectModel from "./project.model";
import UserModel from "./user.model";

type UserProjectAccessAttributes = {
  id: number;
  userId: string;
  projectKey: string;
};

type UserProjectAccessCreationAttributes = Pick<UserProjectAccessAttributes, "userId" | "projectKey">;

class UserProjectAccessModel extends Model<UserProjectAccessAttributes, UserProjectAccessCreationAttributes> {
  declare id: number | undefined;
  declare userId: string;
  declare projectKey: string;
  declare project?: ProjectModel;
  declare user?: UserModel;
}

UserProjectAccessModel.init(
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
      allowNull: false,
      references: {
        model: "user",
        key: "user_id",
      },
    },
    projectKey: {
      type: DataTypes.STRING,
      field: "project_key",
      allowNull: false,
      references: {
        model: "project",
        key: "project_key",
      },
    },
  },
  {
    tableName: "user_project_access",
    timestamps: false,
    sequelize: sequelize,
  }
);

UserProjectAccessModel.belongsTo(ProjectModel, {
  targetKey: "projectKey",
  foreignKey: {
    name: "project_key",
  },
  as: "project",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
UserProjectAccessModel.belongsTo(UserModel, {
  targetKey: "userId",
  foreignKey: {
    name: "user_id",
  },
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

export default UserProjectAccessModel;
