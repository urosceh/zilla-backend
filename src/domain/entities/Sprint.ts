import SprintModel from "../../database/models/sprint.model";
import {IDtoable} from "../interfaces/IReturnable";

export class Sprint implements IDtoable {
  private _sprintId: number;
  private _sprintName: string;
  private _projectKey: string;
  private _startOfSprint: Date;
  private _endOfSprint: Date;

  constructor(sprint: SprintModel) {
    this._sprintId = sprint.sprintId;
    this._sprintName = sprint.sprintName;
    this._projectKey = sprint.projectKey;
    this._startOfSprint = sprint.startOfSprint;
    this._endOfSprint = sprint.endOfSprint;
  }

  public toDto() {
    return {
      sprintId: this._sprintId,
      sprintName: this._sprintName,
      projectKey: this._projectKey,
      startOfSprint: this._startOfSprint,
      endOfSprint: this._endOfSprint,
    };
  }

  public get sprintId(): number {
    return this._sprintId;
  }

  public get projectKey(): string {
    return this._projectKey;
  }
}
