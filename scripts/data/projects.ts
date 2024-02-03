import {ProjectCreationAttributes} from "../../src/database/models/project.model";

export const seedProjects: (userIds: string[]) => ProjectCreationAttributes[] = (userIds: string[]) => {
  if (userIds.length < 5) {
    throw new Error("User IDs length must be at least 5");
  }

  return [
    {
      projectName: "Facebook",
      projectKey: "FBK",
      managerId: userIds[0],
    },
    {
      projectName: "Google",
      projectKey: "GGL",
      managerId: userIds[1],
    },
    {
      projectName: "Twitter",
      projectKey: "TWT",
      managerId: userIds[2],
    },
    {
      projectName: "Microsoft",
      projectKey: "MSFT",
      managerId: userIds[3],
    },
    {
      projectName: "LinkedIn",
      projectKey: "LNKD",
      managerId: userIds[4],
    },
  ];
};
