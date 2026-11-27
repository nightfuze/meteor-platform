const COLLECTIONS = [
  "games",
  "groups",
  "genres",
  "users",
  "favorites",
  "notifications",
];

async function ensureCollection(db, name) {
  const exists = await db.listCollections({ name }, { nameOnly: true }).hasNext();
  if (!exists) {
    await db.createCollection(name);
  }
}

export async function up(db) {
    for (const name of COLLECTIONS) {
        await ensureCollection(db, name);
    }

    await db.collection("games").createIndex({ name: 1 }, { unique: true });
    await db.collection("games").createIndex({ "metrics.playing": -1 });
    await db.collection("games").createIndex({ "metrics.visits": -1 });
    await db.collection("games").createIndex({ genre: 1, "metrics.playing": -1 });
    await db.collection("games").createIndex({ "creator.name": 1 });

    await db.collection("favorites").createIndex({ userId: 1, gameId: 1 }, { unique: true });
    await db.collection("favorites").createIndex({ userId: 1, createdAt: -1 });

    await db.collection("notifications").createIndex({ createdAt: -1 });
    await db.collection("notifications").createIndex({ status: 1, createdAt: -1 });
}
export async function down() {
}
