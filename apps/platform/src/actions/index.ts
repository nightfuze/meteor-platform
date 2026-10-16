import { defineAction } from 'astro:actions';
import { gameFormSchema, games } from '@/api/games';

export const server = {
  createGame: defineAction({
    accept: 'form',
    input: gameFormSchema,
    handler: async (payload) => games.createGame(payload),
  }),

  validateGame: defineAction({
    accept: 'form',
    input: gameFormSchema,
    handler: async () => ({ valid: true }),
  }),
};
