export interface SystemInfo {
  name: string;
  description: string;
  version: string;
  status: string;
}

export interface Creator {
  id: number;
  name: string;
  type: "User" | "Group";
}

export interface CatalogGame {
  universeId: number;
  rootPlaceId: number;
  name: string;
  locale: string;
  creator: Creator;
  playing: number;
  visits: number;
  images: {
    icon: string;
    banner: string;
  };
}

export interface GameDetails {
  universeId: number;
  name: string;
  description: string;
  locale: string;
  genre: string;
  created: string;
  updated: string;
  maxPlayers: number;
  favoritedCount: number;
  price: number | null;
  images: {
    icon: string;
    banner: string;
    carousel: string[];
  };
}

export interface CreateGameErrors {
  name?: string;
  description?: string;
  genre?: string;
  maxPlayers?: string;
  creatorName?: string;
}

export interface CreateGameResult {
  success: boolean;
  universeId?: number;
  errors?: CreateGameErrors;
}

export interface CatalogFilter {
  search?: string;
  genre?: string;
  sort?: "playing" | "visits" | "newest";
}