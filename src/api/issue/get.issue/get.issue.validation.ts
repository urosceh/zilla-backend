import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const getIssueQuerySchema = Joi.object({
  projectKey: projectKeySchema.required(),
});

export const getIssueParamsSchema = Joi.object({
  issueId: Joi.string().uuid().required(),
});
