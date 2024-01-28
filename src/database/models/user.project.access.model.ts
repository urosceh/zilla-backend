import {DataTypes, Model} from "sequelize";
import {IProject} from "../../domain/interfaces/IProject";
import sequelize from "../sequelize";

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
  declare project: IProject;
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
