import SprintModel from "../../database/models/sprint.model";
import {IReturnable} from "../interfaces/IReturnable";

export class Sprint implements IReturnable {
  private _sprintId: number;
  private _sprintName: string;
  private _projectId: string;
  private _startOfSprint: Date;
  private _endOfSprint: Date;

  constructor(sprint: SprintModel) {
    this._sprintId = sprint.sprintId;
    this._sprintName = sprint.sprintName;
    this._projectId = sprint.projectId;
    this._startOfSprint = sprint.startOfSprint;
    this._endOfSprint = sprint.endOfSprint;
  }

  public createDto() {
    return {
      sprintId: this._sprintId,
      sprintName: this._sprintName,
      projectId: this._projectId,
      startOfSprint: this._startOfSprint,
      endOfSprint: this._endOfSprint,
    };
  }

  get sprintId(): number {
    return this._sprintId;
  }

  get sprintName(): string {
    return this._sprintName;
  }
}
