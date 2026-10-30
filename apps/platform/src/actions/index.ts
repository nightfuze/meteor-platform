import { defineAction, ActionError } from "astro:actions";
import { z } from "zod";
import { favoriteRepository, OBJECT_ID_REGEX } from "@meteor/db";
import { gameFormSchema, games } from "@/api/games";
import { getCurrentUserId } from "@/api/auth";

export const server = {
  createGame: defineAction({
    accept: "form",
    input: gameFormSchema,
    handler: async (payload) => {
      try {
        return await games.createGame(payload);
      } catch (err: any) {
        if (err?.code === "DUPLICATE_KEY" || err?.message?.includes("name")) {
          throw new ActionError({
            code: "CONFLICT",
            message: "Игра с таким названием уже существует в каталоге.",
          });
        }
        throw err;
      }
    },
  }),

  validateGame: defineAction({
    accept: "form",
    input: gameFormSchema,
    handler: async () => ({ valid: true }),
  }),

  toggleFavorite: defineAction({
    accept: "json",
    input: z.object({
      gameId: z.string().regex(OBJECT_ID_REGEX, "Некорректный ID игры"),
    }),
    handler: async ({ gameId }) => {
      const userId = await getCurrentUserId();
      const isFavorite = await favoriteRepository.toggle(userId, gameId);
      return { success: true, isFavorite };
    },
  }),
};
