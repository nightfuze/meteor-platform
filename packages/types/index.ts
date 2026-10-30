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
