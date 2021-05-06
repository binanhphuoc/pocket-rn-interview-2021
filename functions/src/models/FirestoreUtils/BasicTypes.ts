export type ID = string;

export type InputData<T> = Omit<T, "id">;
export type WhereInput = { id: ID; };
