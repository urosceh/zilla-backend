import {DataTypes, Model} from "sequelize";
import sequelize from "../sequelize";

export type IssueStatusAttributes = {
  id: number;
  statusName: string;
};

export type IssueStatusCreationAttributes = Pick<IssueStatusAttributes, "statusName">;

class IssueStatusModel extends Model<IssueStatusAttributes, IssueStatusCreationAttributes> {
  declare id: number;
  declare statusName: string;
}

IssueStatusModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      field: "id",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    statusName: {
      type: DataTypes.STRING,
      field: "status_name",
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "issue_status",
    timestamps: false,
    sequelize: sequelize,
  }
);

export default IssueStatusModel;
