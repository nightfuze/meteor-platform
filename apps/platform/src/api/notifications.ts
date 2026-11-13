import { gameRepository, notificationRepository } from "@meteor/db";
import type { Notification, NotificationStatus } from "@meteor/types";

export type NotificationFilter = "all" | "unread";
export type NotificationSort = "newest" | "oldest";
export type NotificationView = Notification & { gameCover: string | null };

function toView(doc: Awaited<ReturnType<typeof notificationRepository.list>>[number], gameCover: string | null): NotificationView {
  return {
    id: doc._id.toHexString(),
    type: doc.type,
    title: doc.title,
    message: doc.message,
    entity: { type: doc.entity.type, id: doc.entity.id.toHexString() },
    actor: { ...doc.actor, id: doc.actor.id?.toHexString() ?? null },
    recipientId: doc.recipientId?.toHexString() ?? null,
    status: doc.status as NotificationStatus,
    createdAt: doc.createdAt.toISOString(),
    readAt: doc.readAt?.toISOString() ?? null,
    metadata: doc.metadata,
    schemaVersion: doc.schemaVersion,
    gameCover,
  };
}

export const notifications = {
  async getList(filter: NotificationFilter = "all", sort: NotificationSort = "newest") {
    const [docs, unreadCount] = await Promise.all([
      notificationRepository.list(),
      notificationRepository.countUnread(),
    ]);
    const filtered = filter === "unread" ? docs.filter((doc) => doc.status === "new") : docs;
    filtered.sort((a, b) => sort === "newest"
      ? b.createdAt.getTime() - a.createdAt.getTime()
      : a.createdAt.getTime() - b.createdAt.getTime());

    const games = await Promise.all(filtered.map((doc) =>
      gameRepository.findById(doc.entity.id.toHexString()).catch(() => null),
    ));
    const list = filtered.map((doc, index) => {
      const game = games[index];
      const cover = game?.images.banner !== "/images/default/banner.svg"
        ? game?.images.banner ?? null
        : game?.images.icon !== "/images/default/icon.svg" ? game?.images.icon ?? null : null;
      return toView(doc, cover);
    });
    return { notifications: list, unreadCount, totalCount: docs.length };
  },

  async getPopoverData() {
    const { notifications: list, unreadCount } = await this.getList("unread", "newest");
    return { unreadCount, notifications: list.slice(0, 5) };
  },

  getUnreadCount() {
    return notificationRepository.countUnread();
  },

  markRead(id: string) {
    return notificationRepository.markRead(id);
  },

  markAllRead() {
    return notificationRepository.markAllRead();
  },
};
