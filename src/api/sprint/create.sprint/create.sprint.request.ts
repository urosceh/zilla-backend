import {Request} from "express";
import {SprintCreationAttributes} from "../../../database/models/sprint.model";
import {AbstractRequest} from "../../abstract/abstract.request";

export class CreateSprintRequest extends AbstractRequest {
  private _projectKey: string;
  private _sprintName: string;
  private _startOfSprint: Date;
  private _endOfSprint: Date;

  constructor(request: Request) {
    super(request);
    this._projectKey = request.body.projectKey;
    this._sprintName = request.body.sprintName;
    this._startOfSprint = request.body.startOfSprint;
    this._endOfSprint = request.body.endOfSprint;
  }

  get sprint(): SprintCreationAttributes {
    return {
      projectKey: this._projectKey,
      sprintName: this._sprintName,
      startOfSprint: this._startOfSprint,
      endOfSprint: this._endOfSprint,
    };
  }
}
