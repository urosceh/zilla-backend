export class Status {
  id?: number;
  statusName: string;

  constructor(status: Status) {
    this.id = status.id;
    this.statusName = status.statusName;
  }
}
