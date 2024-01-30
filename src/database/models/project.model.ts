import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import UserModel from "./user.model";

export type ProjectAttributes = {
  projectId: string;
  projectName: string;
  projectKey: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ProjectCreationAttributes = Pick<ProjectAttributes, "projectName" | "projectKey" | "managerId">;

class ProjectModel extends Model<ProjectAttributes, ProjectCreationAttributes> {
  declare projectId: string;
  declare projectName: string;
  declare projectKey: string;
  declare managerId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare manager: UserModel;
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
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at",
      allowNull: true,
    },
  },
  {
    tableName: "project",
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
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
