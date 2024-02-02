export interface IDtoable {
  createDto(): any;
}

export interface IBearerData {
  bearerToken: string;
}

export type IReturnable = IDtoable | IDtoable[] | IBearerData;
