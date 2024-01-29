import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class SprintWrapper extends AbstractWrapper {
  protected tableName = "sprint";
  protected associatedTableNames = ["project", "zilla_user"];
}
