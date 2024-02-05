import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import IssueModel from "./issue.model";
import ProjectModel from "./project.model";

export type SprintAttributes = {
  sprintId: number;
  sprintName: string;
  projectKey: string;
  startOfSprint: Date;
  endOfSprint: Date;
};

export type SprintCreationAttributes = Pick<SprintAttributes, "sprintName" | "projectKey" | "startOfSprint" | "endOfSprint">;

class SprintModel extends Model<SprintAttributes, SprintCreationAttributes> {
  declare sprintId: number;
  declare sprintName: string;
  declare projectKey: string;
  declare startOfSprint: Date;
  declare endOfSprint: Date;
  declare project?: ProjectModel;
  declare issues?: IssueModel[];
}

SprintModel.init(
  {
    sprintId: {
      type: DataTypes.INTEGER,
      field: "sprint_id",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sprintName: {
      type: DataTypes.STRING,
      field: "sprint_name",
      allowNull: false,
    },
    projectKey: {
      type: DataTypes.UUIDV4,
      field: "project_key",
      allowNull: false,
      references: {
        model: "project",
        key: "project_key",
      },
    },
    startOfSprint: {
      type: DataTypes.DATE,
      field: "start_of_sprint",
      allowNull: false,
    },
    endOfSprint: {
      type: DataTypes.DATE,
      field: "end_of_sprint",
      allowNull: false,
    },
  },
  {
    tableName: "sprint",
    timestamps: false,
    sequelize: sequelize,
  }
);

SprintModel.belongsTo(ProjectModel, {
  targetKey: "projectKey",
  foreignKey: "project_key",
  as: "project",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

ProjectModel.hasMany(SprintModel, {
  sourceKey: "projectKey",
  foreignKey: "project_key",
  as: "sprints",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default SprintModel;
