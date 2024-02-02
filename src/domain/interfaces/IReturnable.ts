export interface IDtoable {
  createDto(): any;
}

export type IReturnable = IDtoable | IDtoable[] | {bearer: string};
