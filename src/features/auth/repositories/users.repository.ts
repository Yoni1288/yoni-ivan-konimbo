import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/shared/db/prisma"

const userCredentialsSelect = {
  id: true,
  userName: true,
  email: true,
  passwordHash: true,
} satisfies Prisma.UserSelect

export type UserCredentials = Prisma.UserGetPayload<{ select: typeof userCredentialsSelect }>

export const findUserCredentials = async (userName: string): Promise<UserCredentials | null> => {
  return prisma.user.findUnique({ where: { userName }, select: userCredentialsSelect })
}

const publicUserSelect = {
  id: true,
  userName: true,
  email: true,
} satisfies Prisma.UserSelect

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>

export const isUserNameTaken = async (userName: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { userName }, select: { id: true } })
  return Boolean(user)
}

export const createUser = async (userName: string, passwordHash: string): Promise<PublicUser> => {
  return prisma.user.create({ data: { userName, passwordHash }, select: publicUserSelect })
}
