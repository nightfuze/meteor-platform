import { ObjectId, type Collection } from "mongodb";
import { getDatabase } from "../client.ts";
import { handleMongoError } from "../errors.ts";
import type { Genre } from "@meteor/types";

export class GenreRepository {
  private async getCol(): Promise<Collection<{ _id: ObjectId; name: string; slug: string }>> {
    const db = await getDatabase();
    return db.collection("genres");
  }

  async getAll(): Promise<Genre[]> {
    try {
      const col = await this.getCol();
      const docs = await col.find().toArray();
      return docs.map((d) => ({ id: d._id.toHexString(), name: d.name, slug: d.slug }));
    } catch (e) {
      handleMongoError(e);
    }
  }

  async seedGenres(genres: string[]): Promise<void> {
    const col = await this.getCol();
    for (const name of genres) {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      await col.updateOne(
        { slug },
        { $setOnInsert: { _id: new ObjectId(), name, slug } },
        { upsert: true }
      );
    }
  }
}

export const genreRepository = new GenreRepository();
