import { ObjectId } from "mongodb";
import { connectToDatabase, closeConnection, getDatabase } from "./client.ts";
import { groupRepository } from "./repositories/group.ts";
import { genreRepository } from "./repositories/genre.ts";
import { gameRepository } from "./repositories/game.ts";
import { favoriteRepository } from "./repositories/favorites.ts";

import catalogData from "./data/games_catalog.json";
import detailsData from "./data/games_details.json";

console.log("Начинаем миграцию данных в MongoDB...");

try {
  await connectToDatabase();
  const db = await getDatabase();

  await db.collection("games").deleteMany({});
  await db.collection("groups").deleteMany({});
  await db.collection("genres").deleteMany({});
  await db.collection("users").deleteMany({});
  await db.collection("favorites").deleteMany({});

  await gameRepository.initIndexes();
  await favoriteRepository.initIndexes();

  const GENRES = ["Town and City", "RPG", "Adventure", "FPS", "Horror", "Strategy"];
  await genreRepository.seedGenres(GENRES);

  const defaultUserId = new ObjectId();
  await db.collection("users").insertOne({
    _id: defaultUserId,
    username: "Player",
    email: "player@meteor.local",
    role: "player",
    createdAt: new Date(),
  });

  const detailsMap = new Map(detailsData.map((d) => [d.universeId, d]));

  for (const cat of catalogData) {
    const det = detailsMap.get(cat.universeId);
    if (!det) continue;

    const groupId = await groupRepository.findOrCreate(cat.creator.name);

    await db.collection("games").insertOne({
      _id: new ObjectId(),
      name: cat.name,
      description: det.description,
      locale: cat.locale,
      genre: det.genre,
      creator: {
        id: groupId,
        name: cat.creator.name,
        type: cat.creator.type,
      },
      metrics: {
        playing: cat.playing,
        visits: cat.visits,
        favoritedCount: det.favoritedCount,
      },
      maxPlayers: det.maxPlayers,
      price: det.price,
      images: {
        icon: cat.images.icon,
        banner: cat.images.banner,
        carousel: det.images.carousel ?? [],
      },
      createdAt: new Date(det.created),
      updatedAt: new Date(det.updated),
    });
  }

  console.log(`Успешно импортировано ${catalogData.length} игры, группы и жанры.`);
} catch (error) {
  console.error("Ошибка при заполнении бд:", error);
} finally {
  await closeConnection();
}
