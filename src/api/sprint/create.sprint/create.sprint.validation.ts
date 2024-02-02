import Joi from "joi";

export const createSprintBodySchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  sprintName: Joi.string().required(),
  startOfSprint: Joi.date().required(),
  endOfSprint: Joi.date().required(),
});
