export interface SystemInfo {
  name: string;
  description: string;
  version: string;
  status: string;
}

export interface Creator {
  id: string;
  name: string;
  type: "User" | "Group";
}

export interface GameImages {
  icon: string;
  banner: string;
  carousel: string[];
}

export interface GameMetrics {
  playing: number;
  visits: number;
  favoritedCount: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  genre: string;
  locale: string;
  creator: Creator;
  metrics: GameMetrics;
  maxPlayers: number;
  price: number | null;
  images: GameImages;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "player" | "developer" | "admin";
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  gameId: string;
  createdAt: string;
}

export type NotificationType =
  | "game_published"
  | "game_updated"
  | "game_deleted"
  | "game_added_to_favorites"
  | "user_registered";

export type NotificationStatus = "new" | "read" | "archived";

export interface NotificationEntity {
  type: "game" | "user";
  id: string;
}

export interface NotificationActor {
  type: "user";
  id: string | null;
  name: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entity: NotificationEntity;
  actor: NotificationActor;
  recipientId: string | null;
  status: NotificationStatus;
  createdAt: string;
  readAt: string | null;
  metadata: { gameName: string };
  schemaVersion: 1;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogFilter {
  search?: string;
  genre?: string;
  sort?: "playing" | "visits" | "newest";
  limit?: number;
  skip?: number;
}

export interface CreateGamePayload {
  name: string;
  description: string;
  genre: string;
  maxPlayers: number;
  creatorName: string;
}

export interface CreateGameResult {
  success: boolean;
  gameId?: string;
  error?: string;
}

export type CreateGameErrors = Partial<Record<keyof CreateGamePayload | "form", string>>;
