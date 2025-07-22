import prisma from 'config/db';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const login = async (email: string, password: string) => {};
