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
  await db.collection("notifications").deleteMany({});

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
  const seededGames: { id: ObjectId; name: string; creatorName: string; createdAt: Date }[] = [];

  for (const cat of catalogData) {
    const det = detailsMap.get(cat.universeId);
    if (!det) continue;

    const groupId = await groupRepository.findOrCreate(cat.creator.name);

    const gameId = new ObjectId();
    const gameCreatedAt = new Date(det.created);
    await db.collection("games").insertOne({
      _id: gameId,
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
      createdAt: gameCreatedAt,
      updatedAt: new Date(det.updated),
    });
    seededGames.push({ id: gameId, name: cat.name, creatorName: cat.creator.name, createdAt: gameCreatedAt });
  }

  const notificationGames = seededGames.slice(0, 3);
  const notifications = notificationGames.map((game, index) => {
    const isRead = index === 1;
    const createdAt = new Date(Date.now() - index * 60 * 60 * 1000);
    return {
      _id: new ObjectId(),
      type: "game_published" as const,
      title: "Игра опубликована",
      message: `Игра «${game.name}» успешно опубликована`,
      entity: { type: "game" as const, id: game.id },
      actor: { type: "user" as const, id: null, name: game.creatorName },
      recipientId: null,
      status: isRead ? "read" as const : "new" as const,
      createdAt,
      readAt: isRead ? new Date(createdAt.getTime() + 5 * 60 * 1000) : null,
      metadata: { gameName: game.name },
      schemaVersion: 1 as const,
    };
  });
  if (notifications.length) {
    await db.collection("notifications").insertMany(notifications);
    await db.collection("notifications").createIndex({ createdAt: -1 });
    await db.collection("notifications").createIndex({ status: 1, createdAt: -1 });
  }

  console.log(`Успешно импортировано ${catalogData.length} игры, группы и жанры, а также ${notifications.length} тестовых уведомлений.`);
} catch (error) {
  console.error("Ошибка при заполнении бд:", error);
} finally {
  await closeConnection();
}
