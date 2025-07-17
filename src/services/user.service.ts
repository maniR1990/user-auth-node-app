import { CreateUserInput } from '../domain/user.schema';
import { createUserWithProfile, getAllRegisteredUsers } from '../data-access/user.repo';

export async function registerUser(input: CreateUserInput) {
  return createUserWithProfile(input);
}

export async function getAllregisteredUser() {
  return getAllRegisteredUsers();
}
