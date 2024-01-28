import {DataTypes, Model} from "sequelize";
import {IStatus} from "../../domain/interfaces/IStatus";
import sequelize from "../sequelize";

type StatusAttributes = {
  id: number;
  statusName: string;
};

type StatusCreationAttributes = Pick<StatusAttributes, "statusName">;

class StatusModel extends Model<StatusAttributes, StatusCreationAttributes> implements IStatus {
  declare id: number | undefined;
  declare statusName: string;
}

StatusModel.init(
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
    tableName: "status",
    timestamps: false,
    sequelize: sequelize,
  }
);
