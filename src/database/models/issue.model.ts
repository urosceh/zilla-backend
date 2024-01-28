import {DataTypes, Model} from "sequelize";
import {IIssue} from "../../domain/interfaces/IIssue";
import {IProject} from "../../domain/interfaces/IProject";
import {ISprint} from "../../domain/interfaces/ISprint";
import {IStatus} from "../../domain/interfaces/IStatus";
import {IUser} from "../../domain/interfaces/IUser";
import sequelize from "../sequelize";

type IssueAttributes = {
  issueId: string;
  projectId: string;
  reporterId: string;
  assigneeId: string;
  statusId: number;
  sprintId: number | null;
  summary: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

type IssueCreationAttributes = Pick<IssueAttributes, "projectId" | "reporterId" | "summary">;

class IssueModel extends Model<IssueAttributes, IssueCreationAttributes> implements IIssue {
  declare issueId: string | undefined;
  declare projectId: string;
  declare reporterId: string;
  declare assigneeId: string;
  declare statusId: number;
  declare sprintId: number | null;
  declare summary: string;
  declare details: string;
  declare createdAt: Date | undefined;
  declare updatedAt: Date | undefined;
  declare deletedAt: Date | undefined;
  declare reporter: IUser;
  declare assignee: IUser;
  declare project: IProject;
  declare status: IStatus;
  declare sprint: ISprint;
}

IssueModel.init(
  {
    issueId: {
      type: DataTypes.UUIDV4,
      field: "issue_id",
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    projectId: {
      type: DataTypes.UUIDV4,
      field: "project_id",
      allowNull: false,
      references: {
        model: "project",
        key: "project_id",
      },
    },
    reporterId: {
      type: DataTypes.UUIDV4,
      field: "reporter_id",
      allowNull: false,
      references: {
        model: "user",
        key: "user_id",
      },
    },
    assigneeId: {
      type: DataTypes.UUIDV4,
      field: "assignee_id",
      allowNull: true,
      references: {
        model: "user",
        key: "user_id",
      },
    },
    statusId: {
      type: DataTypes.INTEGER,
      field: "status_id",
      allowNull: true,
      references: {
        model: "status",
        key: "status_id",
      },
    },
    sprintId: {
      type: DataTypes.INTEGER,
      field: "sprint_id",
      allowNull: true,
      references: {
        model: "sprint",
        key: "sprint_id",
      },
    },
    summary: {
      type: DataTypes.STRING,
      field: "summary",
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      field: "details",
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: "deleted_at",
      allowNull: true,
    },
  },
  {
    tableName: "issue",
    timestamps: true,
    paranoid: true,
    sequelize: sequelize,
  }
);

export default IssueModel;
