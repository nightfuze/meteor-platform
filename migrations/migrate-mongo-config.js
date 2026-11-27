const user = process.env.MONGO_ROOT_USER || "root";
const password = process.env.MONGO_ROOT_PASSWORD || "example";
const host = process.env.MONGO_HOST || "localhost";
const port = process.env.MONGO_PORT || "27017";
const databaseName = process.env.DATABASE_NAME || "meteor-platform";
const authSource = process.env.MONGO_AUTH_SOURCE || "admin";

const auth = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;

const config = {
  mongodb: {
    url:
      process.env.MONGODB_URI ||
      `mongodb://${auth}@${host}:${port}/${databaseName}?authSource=${authSource}`,
    databaseName,
    options: {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    },
  },

  migrationsDir: "files",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 60,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

export default config;
