import { gameRepository, genreRepository, groupRepository } from "@meteor/db";
import type { CatalogFilter, Game, CreateGameResult } from "@meteor/types";
import { z } from "zod";
import { ru } from "zod/locales";

z.config(ru());

export type CatalogEntry = Game;

export type GameFormInput = {
  name: string;
  description: string;
  genre: string;
  maxPlayers: string;
  creatorName: string;
};

export const EMPTY_PAYLOAD: GameFormInput = {
  name: '',
  description: '',
  genre: '',
  maxPlayers: '30',
  creatorName: '',
};

export const FIELD_KEYS = ['name', 'description', 'genre', 'maxPlayers', 'creatorName'] as const;

export const FIELD_LABELS: Record<(typeof FIELD_KEYS)[number], string> = {
  name: 'Название игры',
  description: 'Описание',
  genre: 'Жанр',
  maxPlayers: 'Игроков в сессии',
  creatorName: 'Разработчик или студия',
};

export function readForm(formData: FormData): GameFormInput {
  return {
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? ''),
    genre: String(formData.get('genre') ?? ''),
    maxPlayers: String(formData.get('maxPlayers') ?? ''),
    creatorName: String(formData.get('creatorName') ?? ''),
  };
}

export const GENRES = [
  "Town and City",
  "RPG",
  "Adventure",
  "FPS",
  "Horror",
  "Strategy",
] as const;

export const asset = (path: string): string => (path.startsWith("/") ? path : `/${path}`);
export const formatNumber = (value: number): string => new Intl.NumberFormat("ru-RU").format(value);
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
export const getRating = (id: string): number => 88 + (id.charCodeAt(id.length - 1) % 12);

const cleanString = (val: unknown): string =>
  val === null || val === undefined ? '' : typeof val === 'string' ? val.trim() : String(val).trim();

export const gameFormSchema = z.object({
  name: z.preprocess(
    cleanString,
    z
      .string()
      .min(1, 'Введите название игры.')
      .min(3, 'Название должно содержать от 3 до 50 символов.')
      .max(50, 'Название не должно превышать 50 символов.')
  ),
  description: z.preprocess(
    cleanString,
    z
      .string()
      .min(1, 'Введите описание игры.')
      .min(30, 'Описание должно содержать не менее 30 символов.')
      .max(1200, 'Описание не должно превышать 1200 символов.')
  ),
  genre: z.preprocess(
    cleanString,
    z.enum(GENRES, { error: 'Выберите жанр из выпадающего списка.' })
  ),
  maxPlayers: z.preprocess(
    cleanString,
    z
      .string()
      .min(1, 'Укажите количество игроков в сессии.')
      .transform(Number)
      .refine(
        (n) => !Number.isNaN(n) && Number.isInteger(n) && n >= 2 && n <= 50,
        'Укажите целое число от 2 до 50 игроков.'
      )
  ),
  creatorName: z.preprocess(
    cleanString,
    z
      .string()
      .min(1, 'Укажите разработчика или название студии.')
      .min(2, 'Имя разработчика должно содержать от 2 до 40 символов.')
      .max(40, 'Имя разработчика не должно превышать 40 символов.')
  ),
});

export type GamePayload = z.output<typeof gameFormSchema>;

export const games = {
  async getCatalog(filter: CatalogFilter = {}): Promise<Game[]> {
    return gameRepository.getCatalog(filter);
  },

  async getDetails(id: string): Promise<Game | null> {
    return gameRepository.findById(id);
  },

  async getGenres(): Promise<string[]> {
    const list = await genreRepository.getAll();
    return ["all", ...list.map((g) => g.name)];
  },

  async createGame(payload: GamePayload): Promise<CreateGameResult> {
    const groupId = await groupRepository.findOrCreate(payload.creatorName);
    const created = await gameRepository.create(payload, groupId, "Group");
    return { success: true, gameId: created.id };
  },
};
