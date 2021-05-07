export type ID = string;

export type InputData<T> = Omit<T, "id">;
export type WhereInput = { id: ID; };
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
