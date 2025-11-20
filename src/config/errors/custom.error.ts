export class CustomError extends Error {
  public errors: Record<string, string[]>;
  public statusCode?: number;

  constructor(
    message: string,
    errors: Record<string, string[]> = {},
    statusCode = 400
  ) {
    super(message);
    this.name = message;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}
