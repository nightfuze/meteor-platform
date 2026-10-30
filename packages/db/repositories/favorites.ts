import { ObjectId, type Collection, MongoServerError } from "mongodb";
import { getDatabase } from "../client.ts";
import { handleMongoError, DatabaseError } from "../errors.ts";
import type { Game } from "@meteor/types";

interface FavoriteDoc {
  _id: ObjectId;
  userId: ObjectId;
  gameId: ObjectId;
  createdAt: Date;
}

export class FavoriteRepository {
  private indexesInitialized = false;

  private async getCol(): Promise<Collection<FavoriteDoc>> {
    const db = await getDatabase();
    const col = db.collection<FavoriteDoc>("favorites");

    if (!this.indexesInitialized) {
      this.indexesInitialized = true;
      this.initIndexes().catch((err) => {
        console.error("Не удалось инициализировать индексы для favorites:", err);
      });
    }

    return col;
  }

  async initIndexes(): Promise<void> {
    const db = await getDatabase();
    const col = db.collection<FavoriteDoc>("favorites");
    await col.createIndex({ userId: 1, gameId: 1 }, { unique: true });
    await col.createIndex({ userId: 1, createdAt: -1 });
  }

  async toggle(userIdStr: string, gameIdStr: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(userIdStr) || !ObjectId.isValid(gameIdStr)) {
        throw new DatabaseError("Некорректный идентификатор пользователя или игры", "INVALID_ID");
      }

      const db = await getDatabase();
      const col = await this.getCol();
      const userId = new ObjectId(userIdStr);
      const gameId = new ObjectId(gameIdStr);

      const deleteResult = await col.deleteOne({ userId, gameId });

      if (deleteResult.deletedCount > 0) {
        await db.collection("games").updateOne(
          { _id: gameId, "metrics.favoritedCount": { $gt: 0 } },
          { $inc: { "metrics.favoritedCount": -1 } }
        );
        return false;
      }

      try {
        await col.insertOne({
          _id: new ObjectId(),
          userId,
          gameId,
          createdAt: new Date(),
        });

        await db.collection("games").updateOne(
          { _id: gameId },
          { $inc: { "metrics.favoritedCount": 1 } }
        );
        return true;
      } catch (insertErr) {
        if (insertErr instanceof MongoServerError && insertErr.code === 11000) {
          return true;
        }
        throw insertErr;
      }
    } catch (e) {
      handleMongoError(e);
    }
  }

  async isFavorite(userIdStr: string, gameIdStr: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(userIdStr) || !ObjectId.isValid(gameIdStr)) return false;
      const col = await this.getCol();
      const count = await col.countDocuments({
        userId: new ObjectId(userIdStr),
        gameId: new ObjectId(gameIdStr),
      });
      return count > 0;
    } catch (e) {
      handleMongoError(e);
    }
  }

  async getUserFavoriteGames(userIdStr: string): Promise<Game[]> {
    try {
      if (!ObjectId.isValid(userIdStr)) return [];
      const col = await this.getCol();

      const pipeline = [
        { $match: { userId: new ObjectId(userIdStr) } },
        { $sort: { createdAt: -1 as const } },
        {
          $lookup: {
            from: "games",
            localField: "gameId",
            foreignField: "_id",
            as: "game",
          },
        },
        { $unwind: "$game" },
        { $replaceRoot: { newRoot: "$game" } },
      ];

      const docs = await col.aggregate(pipeline).toArray();

      return docs.map((doc: any) => ({
        ...doc,
        id: doc._id.toHexString(),
        creator: {
          ...doc.creator,
          id: doc.creator.id.toHexString(),
        },
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
        updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt,
      }));
    } catch (e) {
      handleMongoError(e);
    }
  }
}

export const favoriteRepository = new FavoriteRepository();
