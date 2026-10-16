import type {
  CatalogFilter,
  CatalogGame,
  CreateGameResult,
  Creator,
  GameDetails,
} from "@meteor/types";
import { z } from "zod";
import { ru } from "zod/locales";
import catalogJson from "./games_catalog.json";
import detailsJson from "./games_details.json";

z.config(ru());

export const GENRES = [
  "Town and City",
  "RPG",
  "Adventure",
  "FPS",
  "Horror",
  "Strategy",
] as const;

export type Genre = (typeof GENRES)[number];

export const DEFAULT_ICON = "/images/default/icon.svg";
export const DEFAULT_BANNER = "/images/default/banner.svg";

export interface CatalogEntry extends CatalogGame {
  genre: string;
  created: string;
}

export type GameEntry = GameDetails;

const catalogJsonData = catalogJson as CatalogGame[];
const detailsJsonData = detailsJson as GameDetails[];

const detailsMetaByUniverse = new Map<number, { genre: string; created: string }>(
  detailsJsonData.map((item) => [item.universeId, { genre: item.genre, created: item.created }]),
);

const catalogList: CatalogEntry[] = catalogJsonData.map((game) => {
  const meta = detailsMetaByUniverse.get(game.universeId);
  return {
    ...game,
    genre: meta?.genre ?? "All",
    created: meta?.created ?? "",
  };
});

const detailsList: GameEntry[] = detailsJsonData.map((item) => ({
  ...item,
}));

const normalize = (value: string): string => value.trim().toLowerCase();

export const asset = (path: string): string => (path.startsWith("/") ? path : `/${path}`);

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value);

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const getRating = (universeId: number): number => 88 + (universeId % 12);

export const gameFormSchema = z
  .object({
    name: z
      .string({ error: "Укажите название игры." })
      .trim()
      .min(3, "Название должно содержать не менее 3 символов.")
      .max(50, "Название не может быть длиннее 50 символов."),
    description: z
      .string({ error: "Добавьте описание игры." })
      .trim()
      .min(30, "Описание должно содержать не менее 30 символов.")
      .max(1200, "Описание не может быть длиннее 1200 символов."),
    genre: z.enum(GENRES, {
      error: "Выберите жанр из зарегистрированного списка.",
    }),
    maxPlayers: z
      .string({ error: "Укажите количество игроков в сессии." })
      .trim()
      .min(1, "Укажите количество игроков в сессии.")
      .refine((value) => /^-?\d+$/.test(value), "Количество игроков должно быть целым числом.")
      .refine(
        (value) => {
          const parsed = Number(value);
          return parsed >= 2 && parsed <= 50;
        },
        { message: "Допустимый диапазон - от 2 до 50 игроков в сессии." },
      )
      .transform(Number),
    creatorName: z
      .string({ error: "Укажите имя разработчика или название студии." })
      .trim()
      .min(2, "Укажите имя разработчика или название студии.")
      .max(40, "Имя разработчика не может быть длиннее 40 символов."),
  })
  .superRefine((payload, ctx) => {
    const taken = catalogList.some((game) => normalize(game.name) === normalize(payload.name));
    if (taken) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Игра с таким названием уже опубликована в каталоге.",
      });
    }
  });

export type GamePayload = z.output<typeof gameFormSchema>;

export interface GameFormInput {
  name: string;
  description: string;
  genre: string;
  maxPlayers: string;
  creatorName: string;
}

export const EMPTY_PAYLOAD: GameFormInput = {
  name: "",
  description: "",
  genre: "",
  maxPlayers: "",
  creatorName: "",
};

export const readForm = (form: FormData): GameFormInput => ({
  name: String(form.get("name") ?? ""),
  description: String(form.get("description") ?? ""),
  genre: String(form.get("genre") ?? ""),
  maxPlayers: String(form.get("maxPlayers") ?? ""),
  creatorName: String(form.get("creatorName") ?? ""),
});

export const FIELD_KEYS = ["name", "description", "genre", "maxPlayers", "creatorName"] as const;

export const FIELD_LABELS: Record<(typeof FIELD_KEYS)[number], string> = {
  name: "Название игры",
  description: "Описание",
  genre: "Жанр",
  maxPlayers: "Игроков в сессии",
  creatorName: "Разработчик или студия",
};

const createCatalogEntry = (
  universeId: number,
  payload: GamePayload,
  now: string,
): CatalogEntry => ({
  universeId,
  rootPlaceId: universeId + 100000,
  name: payload.name,
  locale: "ru_ru",
  creator: {
    id: 1000000 + (universeId % 9000000),
    name: payload.creatorName,
    type: "User",
  } satisfies Creator,
  playing: 1,
  visits: 1,
  genre: payload.genre,
  created: now,
  images: { icon: DEFAULT_ICON, banner: DEFAULT_BANNER },
});

const createDetailsEntry = (
  universeId: number,
  payload: GamePayload,
  now: string,
): GameEntry => ({
  universeId,
  name: payload.name,
  description: payload.description,
  locale: "ru_ru",
  genre: payload.genre,
  created: now,
  updated: now,
  maxPlayers: payload.maxPlayers,
  favoritedCount: 1,
  price: null,
  images: { icon: DEFAULT_ICON, banner: DEFAULT_BANNER, carousel: [] },
});

export const games = {
  getCatalog(filter: CatalogFilter = {}): CatalogEntry[] {
    const search = filter.search ? normalize(filter.search) : "";
    const genre = filter.genre ?? "";
    const sort = filter.sort ?? "playing";

    const result = catalogList.filter((game) => {
      if (
        search &&
        !normalize(game.name).includes(search) &&
        !normalize(game.creator.name).includes(search)
      ) {
        return false;
      }
      if (genre && genre !== "all" && game.genre !== genre) {
        return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sort === "visits") return b.visits - a.visits;
      if (sort === "newest") return b.created.localeCompare(a.created);
      return b.playing - a.playing;
    });

    return result;
  },

  getDetails(universeId: number): GameEntry | undefined {
    if (!Number.isInteger(universeId) || universeId <= 0) return undefined;
    return detailsList.find((item) => item.universeId === universeId);
  },

  getCatalogItem(universeId: number): CatalogEntry | undefined {
    if (!Number.isInteger(universeId) || universeId <= 0) return undefined;
    return catalogList.find((item) => item.universeId === universeId);
  },

  getGenres(): string[] {
    const present = new Set(catalogList.map((game) => game.genre));
    return ["all", ...GENRES.filter((genre) => present.has(genre))];
  },

  createGame(payload: GamePayload): CreateGameResult {
    const usedIds = new Set(catalogList.map((game) => game.universeId));
    let universeId = Date.now() % 1_000_000_000;
    while (usedIds.has(universeId)) universeId += 1;

    const now = new Date().toISOString();

    catalogList.unshift(createCatalogEntry(universeId, payload, now));
    detailsList.unshift(createDetailsEntry(universeId, payload, now));

    return { success: true, universeId };
  },
};