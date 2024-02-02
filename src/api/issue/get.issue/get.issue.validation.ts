import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const getIssueQuerySchema = Joi.object({
  projectId: Joi.string().uuid().required(), // don't send this
  projectKey: projectKeySchema.required(),
});

export const getIssueParamsSchema = Joi.object({
  issueId: Joi.string().uuid().required(),
});
