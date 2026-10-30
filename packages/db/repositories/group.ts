import { ObjectId, type Collection } from "mongodb";
import { getDatabase } from "../client.ts";
import { handleMongoError } from "../errors.ts";
import type { Group } from "@meteor/types";

interface GroupDoc extends Omit<Group, "id" | "createdAt" | "updatedAt" | "ownerId"> {
  _id: ObjectId;
  ownerId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export class GroupRepository {
  private async getCol(): Promise<Collection<GroupDoc>> {
    const db = await getDatabase();
    return db.collection<GroupDoc>("groups");
  }

  async findOrCreate(name: string): Promise<ObjectId> {
    try {
      const col = await this.getCol();
      const now = new Date();

      const result = await col.findOneAndUpdate(
        { name },
        {
          $setOnInsert: {
            _id: new ObjectId(),
            name,
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true, returnDocument: "after" }
      );

      if (!result) {
        throw new Error("Не удалось создать или получить группу.");
      }

      return result._id;
    } catch (e) {
      handleMongoError(e);
    }
  }
}

export const groupRepository = new GroupRepository();
