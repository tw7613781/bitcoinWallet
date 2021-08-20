export class ApiError extends Error {
  public readonly type: number;
  constructor(type: number, message: string) {
    super(message);
    this.type = type;
  }
}
