import { ObjectId, type Collection } from "mongodb";
import { getDatabase } from "../client.ts";
import { handleMongoError } from "../errors.ts";
import type { User } from "@meteor/types";

interface UserDoc extends Omit<User, "id" | "createdAt"> {
  _id: ObjectId;
  createdAt: Date;
}

export class UserRepository {
  private async getCol(): Promise<Collection<UserDoc>> {
    const db = await getDatabase();
    return db.collection<UserDoc>("users");
  }

  private map(doc: UserDoc): User {
    return {
      ...doc,
      id: doc._id.toHexString(),
      createdAt: doc.createdAt.toISOString(),
    };
  }

  async findFirst(): Promise<User | null> {
    try {
      const col = await this.getCol();
      const doc = await col.findOne({});
      return doc ? this.map(doc) : null;
    } catch (e) {
      handleMongoError(e);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      if (!ObjectId.isValid(id)) return null;
      const col = await this.getCol();
      const doc = await col.findOne({ _id: new ObjectId(id) });
      return doc ? this.map(doc) : null;
    } catch (e) {
      handleMongoError(e);
    }
  }

  async findOrCreateDefault() {
    try {
      const col = await this.getCol();
      let user = await this.findFirst();

      if (!user) {
        const defaultUser: UserDoc = {
          _id: new ObjectId(),
          username: "PlayerOne",
          email: "player@meteor.local",
          role: "player",
          createdAt: new Date(),
        };

        await col.insertOne(defaultUser);
        user = this.map(defaultUser);
      }

      return user;
    } catch (e) {
      handleMongoError(e);
    }
  }
}

export const userRepository = new UserRepository();
