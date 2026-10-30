import { MongoClient, type Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoClient: MongoClient | undefined;
}

export interface DatabaseConfig {
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  databaseName?: string;
  authSource?: string;
  uri?: string;
}

let explicitConfig: DatabaseConfig | null = null;

export function initDatabaseConfig(config: DatabaseConfig) {
  explicitConfig = config;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `[Database Config Error] Отсутствует переменная окружения: "${key}". ` +
      `Проверьте наличие файла .env и корректность конфигурации.`
    );
  }
  return value.trim();
}

function buildConnectionConfig(): { uri: string; databaseName: string } {
  if (explicitConfig) {
    if (explicitConfig.uri) {
      return { uri: explicitConfig.uri, databaseName: explicitConfig.databaseName! };
    }
    const host = explicitConfig.host || "localhost";
    const port = explicitConfig.port || "27017";
    const user = explicitConfig.user!;
    const password = explicitConfig.password!;
    const databaseName = explicitConfig.databaseName!;
    const authSource = explicitConfig.authSource || "admin";

    const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}@`;
    return {
      uri: `mongodb://${auth}${host}:${port}/${databaseName}?authSource=${authSource}`,
      databaseName,
    };
  }

  const host = process.env.MONGO_HOST?.trim() || "localhost";
  const port = process.env.MONGO_PORT?.trim() || "27017";
  const user = getRequiredEnv("MONGO_ROOT_USER");
  const password = getRequiredEnv("MONGO_ROOT_PASSWORD");
  const databaseName = getRequiredEnv("DATABASE_NAME");
  const authSource = process.env.MONGO_AUTH_SOURCE?.trim() || "admin";

  const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}@`;
  const uri = `mongodb://${auth}${host}:${port}/${databaseName}?authSource=${authSource}`;

  return { uri, databaseName };
}

export let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;
let dbInstance: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (dbInstance) return dbInstance;
  const { uri, databaseName } = buildConnectionConfig();

  if (import.meta.env.DEV) {
    if (!globalThis._mongoClientPromise) {
      client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        connectTimeoutMS: 10000,
      });
      globalThis._mongoClient = client;

      globalThis._mongoClientPromise = client.connect().catch((error) => {
        globalThis._mongoClientPromise = undefined;
        globalThis._mongoClient = undefined;
        dbInstance = null;
        console.error("[Database Connection Error]:", error);
        throw error;
      });
    }

    const connectedClient = await globalThis._mongoClientPromise;
    dbInstance = connectedClient.db(databaseName);
    return dbInstance;
  }

  if (!clientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 10000,
    });

    clientPromise = client.connect().catch((error) => {
      clientPromise = null;
      client = null;
      dbInstance = null;
      console.error("[Database Connection Error]:", error);
      throw error;
    });
  }

  const connectedClient = await clientPromise;
  dbInstance = connectedClient.db(databaseName);
  return dbInstance;
}

export async function getDatabase(): Promise<Db> {
  return connectToDatabase();
}

export async function closeConnection(): Promise<void> {
  if (import.meta.env.DEV) {
    if (globalThis._mongoClient) {
      await globalThis._mongoClient.close();
      globalThis._mongoClient = undefined;
      globalThis._mongoClientPromise = undefined;
      dbInstance = null;
    }
    return;
  }

  if (client) {
    await client.close();
    client = null;
    clientPromise = null;
    dbInstance = null;
  }
}

export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export function isObjectId(value: unknown): boolean {
  return typeof value === "string" && OBJECT_ID_REGEX.test(value);
}
