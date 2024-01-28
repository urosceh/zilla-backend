import {ISprint} from "../interfaces/ISprint";

export class Sprint {
  private _sprintId: number | null;
  private _sprintName: string;
  private _projectId: string;
  private _startOfSprint: Date;
  private _endOfSprint: Date;

  constructor(sprint: ISprint) {
    this._sprintId = sprint.sprintId || null;
    this._sprintName = sprint.sprintName;
    this._projectId = sprint.projectId;
    this._startOfSprint = sprint.startOfSprint;
    this._endOfSprint = sprint.endOfSprint;
  }
}
