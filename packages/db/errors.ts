import { MongoServerError } from "mongodb";

export class DatabaseError extends Error {
  public code: string;
  public isRetryable: boolean;

  constructor(message: string, code = "DATABASE_ERROR", isRetryable = false) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
    this.isRetryable = isRetryable;
  }
}

export function handleMongoError(error: unknown): never {
  if (error instanceof DatabaseError) {
    throw error;
  }

  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : "поле";
      throw new DatabaseError(`Запись с таким значением поля '${field}' уже существует`, "DUPLICATE_KEY");
    }
  }

  if (error instanceof Error) {
    throw new DatabaseError(error.message, "UNKNOWN_DB_ERROR");
  }

  throw new DatabaseError("Непредвиденная ошибка базы данных", "INTERNAL_ERROR");
}
