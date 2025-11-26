export interface ErrorResponse {
  message: string;
  errors: Record<string, string[]>;
  statusCode?: number;
}
