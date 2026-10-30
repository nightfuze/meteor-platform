import { ObjectId, type Collection, type Filter } from "mongodb";
import { getDatabase } from "../client.ts";
import { handleMongoError } from "../errors.ts";
import type { Game, CatalogFilter, CreateGamePayload } from "@meteor/types";

interface GameDoc extends Omit<Game, "id" | "createdAt" | "updatedAt" | "creator"> {
  _id: ObjectId;
  creator: {
    id: ObjectId;
    name: string;
    type: "User" | "Group";
  };
  createdAt: Date;
  updatedAt: Date;
}

export class GameRepository {
  private indexesInitialized = false;

  private async getCol(): Promise<Collection<GameDoc>> {
    const db = await getDatabase();
    const col = db.collection<GameDoc>("games");

    if (!this.indexesInitialized) {
      this.indexesInitialized = true;
      this.initIndexes().catch((err) => {
        console.error("Не удалось инициализировать индексы для games:", err);
      });
    }

    return col;
  }

  async initIndexes(): Promise<void> {
    const db = await getDatabase();
    const col = db.collection<GameDoc>("games");
    await col.createIndex({ name: 1 }, { unique: true });
    await col.createIndex({ "metrics.playing": -1 });
    await col.createIndex({ "metrics.visits": -1 });
    await col.createIndex({ genre: 1, "metrics.playing": -1 });
    await col.createIndex({ "creator.name": 1 });
  }

  private map(doc: GameDoc): Game {
    return {
      ...doc,
      id: doc._id.toHexString(),
      creator: {
        ...doc.creator,
        id: doc.creator.id.toHexString(),
      },
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  async findById(id: string): Promise<Game | null> {
    try {
      if (!ObjectId.isValid(id)) return null;
      const col = await this.getCol();
      const doc = await col.findOne({ _id: new ObjectId(id) });
      return doc ? this.map(doc) : null;
    } catch (e) {
      handleMongoError(e);
    }
  }

  async getCatalog(filter: CatalogFilter = {}): Promise<Game[]> {
    try {
      const col = await this.getCol();
      const query: Filter<GameDoc> = {};

      if (filter.search) {
        const safeSearch = RegExp.escape
          ? RegExp.escape(filter.search)
          : filter.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        query.$or = [
          { name: { $regex: safeSearch, $options: "i" } },
          { "creator.name": { $regex: safeSearch, $options: "i" } },
        ];
      }

      if (filter.genre && filter.genre !== "all") {
        query.genre = filter.genre;
      }

      let sortOption: Record<string, 1 | -1> = { "metrics.playing": -1 };
      if (filter.sort === "visits") sortOption = { "metrics.visits": -1 };
      if (filter.sort === "newest") sortOption = { createdAt: -1 };

      let cursor = col.find(query).sort(sortOption);

      if (filter.skip && filter.skip > 0) {
        cursor = cursor.skip(filter.skip);
      }
      if (filter.limit && filter.limit > 0) {
        cursor = cursor.limit(filter.limit);
      }

      const docs = await cursor.toArray();
      return docs.map((doc) => this.map(doc));
    } catch (e) {
      handleMongoError(e);
    }
  }

  async create(data: CreateGamePayload, creatorId: ObjectId, creatorType: "User" | "Group"): Promise<Game> {
    try {
      const col = await this.getCol();
      const now = new Date();
      const doc: GameDoc = {
        _id: new ObjectId(),
        name: data.name,
        description: data.description,
        genre: data.genre,
        locale: "ru_ru",
        creator: {
          id: creatorId,
          name: data.creatorName,
          type: creatorType,
        },
        metrics: {
          playing: 1,
          visits: 1,
          favoritedCount: 1,
        },
        maxPlayers: data.maxPlayers,
        price: null,
        images: {
          icon: "/images/default/icon.svg",
          banner: "/images/default/banner.svg",
          carousel: [],
        },
        createdAt: now,
        updatedAt: now,
      };

      await col.insertOne(doc);
      return this.map(doc);
    } catch (e) {
      handleMongoError(e);
    }
  }
}

export const gameRepository = new GameRepository();
