import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";
import IssueModel from "./issue.model";
import ProjectModel from "./project.model";

export type SprintAttributes = {
  sprintId: number;
  sprintName: string;
  projectId: string;
  startOfSprint: Date;
  endOfSprint: Date;
};

export type SprintCreationAttributes = Pick<SprintAttributes, "sprintName" | "projectId" | "startOfSprint" | "endOfSprint">;

class SprintModel extends Model<SprintAttributes, SprintCreationAttributes> {
  declare sprintId: number;
  declare sprintName: string;
  declare projectId: string;
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
    projectId: {
      type: DataTypes.UUIDV4,
      field: "project_id",
      allowNull: false,
      references: {
        model: "project",
        key: "project_id",
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
  targetKey: "projectId",
  foreignKey: "project_id",
  as: "project",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});

ProjectModel.hasMany(SprintModel, {
  sourceKey: "projectId",
  foreignKey: "project_id",
  as: "sprints",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default SprintModel;
