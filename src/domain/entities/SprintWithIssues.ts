import SprintModel from "../../database/models/sprint.model";
import {Issue} from "./Issue";
import {Sprint} from "./Sprint";

export class SprintWithIssues extends Sprint {
  private _issues: Issue[];

  constructor(sprintWithIssues: SprintModel) {
    super(sprintWithIssues);
    this._issues = sprintWithIssues.issues ? sprintWithIssues.issues.map((issue) => new Issue(issue)) : [];
  }
}
