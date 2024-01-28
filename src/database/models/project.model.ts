import {DataTypes, Model} from "sequelize";
import {IProject} from "../../domain/interfaces/IProject";
import {IUser} from "../../domain/interfaces/IUser";
import sequelize from "../sequelize";
import UserModel from "./user.model";

type ProjectAttributes = {
  projectId: string;
  projectName: string;
  projectKey: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectCreationAttributes = Pick<ProjectAttributes, "projectName" | "projectKey" | "managerId">;

class ProjectModel extends Model<ProjectAttributes, ProjectCreationAttributes> implements IProject {
  declare projectId: string | undefined;
  declare projectName: string;
  declare projectKey: string;
  declare managerId: string;
  declare createdAt: Date | undefined;
  declare updatedAt: Date | undefined;
  declare deletedAt: Date | undefined;
  declare manager: IUser;
}

ProjectModel.init(
  {
    projectId: {
      type: DataTypes.UUIDV4,
      field: "project_id",
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    projectName: {
      type: DataTypes.STRING,
      field: "project_name",
      allowNull: false,
      unique: true,
    },
    projectKey: {
      type: DataTypes.STRING,
      field: "project_key",
      allowNull: false,
      unique: true,
    },
    managerId: {
      type: DataTypes.UUIDV4,
      field: "manager_id",
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
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "project",
    timestamps: true,
    sequelize: sequelize,
  }
);

ProjectModel.belongsTo(UserModel, {
  targetKey: "userId",
  foreignKey: {
    name: "manager_id",
  },
  as: "manager",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default ProjectModel;
