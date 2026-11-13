import { ObjectId, type Collection } from "mongodb";
import { getDatabase } from "../client.ts";
import type { NotificationStatus, NotificationType } from "@meteor/types";

export type { NotificationStatus } from "@meteor/types";
export interface NotificationDoc {
  _id: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  entity: { type: "game"; id: ObjectId };
  actor: { type: "user"; id: ObjectId | null; name: string };
  recipientId: ObjectId | null;
  status: NotificationStatus;
  createdAt: Date;
  readAt: Date | null;
  metadata: { gameName: string };
  schemaVersion: 1;
}

export class NotificationRepository {
  private indexesInitialized = false;
  private async getCol(): Promise<Collection<NotificationDoc>> {
    const col = (await getDatabase()).collection<NotificationDoc>("notifications");
    if (!this.indexesInitialized) {
      this.indexesInitialized = true;
      await Promise.all([
        col.createIndex({ createdAt: -1 }),
        col.createIndex({ status: 1, createdAt: -1 }),
      ]);
    }
    return col;
  }

  async createGamePublished(gameId: string, gameName: string, actorName: string): Promise<void> {
    const col = await this.getCol();
    await col.insertOne({
      _id: new ObjectId(), type: "game_published", title: "Игра опубликована",
      message: `Игра «${gameName}» успешно опубликована`,
      entity: { type: "game", id: new ObjectId(gameId) },
      actor: { type: "user", id: null, name: actorName }, recipientId: null,
      status: "new", createdAt: new Date(), readAt: null,
      metadata: { gameName }, schemaVersion: 1,
    });
  }

  async list(): Promise<NotificationDoc[]> {
    return (await this.getCol()).find({}).sort({ createdAt: -1 }).toArray();
  }
  async countUnread(): Promise<number> {
    return (await this.getCol()).countDocuments({ status: "new" });
  }
  async markAllRead(): Promise<number> {
    const result = await (await this.getCol()).updateMany(
      { status: "new" },
      { $set: { status: "read", readAt: new Date() } },
    );
    return result.modifiedCount;
  }

  async markRead(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await (await this.getCol()).updateOne(
      { _id: new ObjectId(id), status: "new" },
      { $set: { status: "read", readAt: new Date() } },
    );
    return result.modifiedCount > 0;
  }
}
export const notificationRepository = new NotificationRepository();
