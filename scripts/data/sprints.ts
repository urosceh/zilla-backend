import {SprintCreationAttributes} from "../../src/database/models/sprint.model";
import {Project} from "../../src/domain/entities/Project";

export const seedSprints: (projects: Project[]) => SprintCreationAttributes[] = (projects: Project[]) => {
  if (projects.length < 5) {
    throw new Error("Project IDs length must be at least 10");
  }

  return [
    {
      projectId: projects[0].projectId,
      sprintName: `${projects[0].projectKey} S1`,
      startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      projectId: projects[1].projectId,
      sprintName: `${projects[1].projectKey} S1`,
      startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      projectId: projects[2].projectId,
      sprintName: `${projects[2].projectKey} S1`,
      startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      projectId: projects[3].projectId,
      sprintName: `${projects[3].projectKey} S1`,
      startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      projectId: projects[4].projectId,
      sprintName: `${projects[4].projectKey} S1`,
      startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  ];
};
