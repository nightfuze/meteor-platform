import { userRepository } from "@meteor/db";

export async function getCurrentUserId(): Promise<string> {
  const user = await userRepository.findOrCreateDefault();
  if (!user) {
    throw new Error("В базе данных нет пользователей.");
  }
  return user.id;
}
