import Joi from "joi";
import {IssueStatus} from "../../domain/enums/IssueStatus";

export const projectKeySchema = Joi.string()
  .regex(/^[A-Z0-9-_]+$/)
  .max(20);

const issueStatusValues: string[] = Object.values(IssueStatus);

export const issueStatusSchema = Joi.string().allow(...issueStatusValues);
