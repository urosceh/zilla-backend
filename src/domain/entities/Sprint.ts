import SprintModel from "../../database/models/sprint.model";

export class Sprint {
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
}
