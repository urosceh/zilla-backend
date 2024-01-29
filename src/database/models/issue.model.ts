import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import IssueStatusModel from "./issue.status.model";
import ProjectModel from "./project.model";
import SprintModel from "./sprint.model";
import UserModel from "./user.model";

type IssueAttributes = {
  issueId: string;
  projectId: string;
  reporterId: string;
  assigneeId: string | null;
  issueStatusId: number;
  sprintId: number | null;
  summary: string;
  details: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

type IssueCreationAttributes = Pick<IssueAttributes, "projectId" | "reporterId" | "summary" | "issueStatusId">;

class IssueModel extends Model<IssueAttributes, IssueCreationAttributes> {
  declare issueId: string;
  declare projectId: string;
  declare reporterId: string;
  declare assigneeId: string | null;
  declare statusId: number;
  declare sprintId: number | null;
  declare summary: string;
  declare details: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare reporter?: UserModel;
  declare assignee?: UserModel | null;
  declare project?: ProjectModel;
  declare issueStatus?: IssueStatusModel;
  declare sprint?: SprintModel | null;
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
    issueStatusId: {
      type: DataTypes.INTEGER,
      field: "status_id",
      allowNull: false,
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

IssueModel.belongsTo(UserModel, {
  targetKey: "userId",
  foreignKey: {
    name: "reporterId",
  },
  as: "reporter",
});
IssueModel.belongsTo(UserModel, {
  targetKey: "userId",
  foreignKey: {
    name: "assigneeId",
  },
  as: "assignee",
});
IssueModel.belongsTo(ProjectModel, {
  targetKey: "projectId",
  foreignKey: {
    name: "projectId",
  },
  as: "project",
});
IssueModel.belongsTo(IssueStatusModel, {
  targetKey: "id",
  foreignKey: {
    name: "issueStatusId",
  },
  as: "issueStatus",
});
IssueModel.belongsTo(SprintModel, {
  targetKey: "sprintId",
  foreignKey: {
    name: "sprintId",
  },
  as: "sprint",
});

export default IssueModel;
