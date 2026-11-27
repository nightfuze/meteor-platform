const DEFAULT_SESSION_MINUTES = 0;

module.exports = {
  async up(db) {
    await db.collection("games").updateMany(
      { sessionMinutes: { $exists: false } },
      { $set: { sessionMinutes: DEFAULT_SESSION_MINUTES } }
    );
  },

  async down(db) {
    await db.collection("games").updateMany({}, { $unset: { sessionMinutes: "" } });
  },
};
