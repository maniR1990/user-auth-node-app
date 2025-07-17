import { prisma } from './../lib/db/prisma';
import { CreateUserInput, UserWithProfile } from '../domain/user.schema';
import bcrypt from 'bcrypt';

export async function createUserWithProfile(data: CreateUserInput) {
  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashed,
      profile: {
        create: {
          fullName: data.fullName,
          bio: data.bio,
          profilePictureUrl: data.profilePictureUrl,
          preferredLanguage: data.preferredLanguage,
        },
      },
    },
    include: {
      profile: true,
    },
  });
}

export async function verifyUserCredentials(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getAllRegisteredUsers(): Promise<UserWithProfile[]> {
  const users = await prisma.user.findMany({
    include: { profile: true },
  });
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    profile: user.profile
      ? {
          fullName: user.profile.fullName ?? '',
          preferredLanguage: user.profile.preferredLanguage ?? '',
          updatedAt: user.profile.updatedAt.toISOString(),
          bio: user.profile.bio ?? undefined,
          profilePictureUrl: user.profile.profilePictureUrl ?? undefined,
        }
      : undefined,
  }));
}
