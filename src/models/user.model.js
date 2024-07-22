import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const addUser = async (username, password) => {
  //암호화 비밀번호 생성
  const userUUID = uuidv4();
  const hashedPassword = await bcrypt(password, 10);

  //prisma에 유저 정보 저장
  const newUser = await prisma.user.create({
    uuid: userUUID,
    username: username,
    password: hashedPassword,
    score: 0,
  });

  return newUser;
};

export const removeUser = async (socketId) => {
  const deletedUser = await prisma.user.delete({
    where: { socketId: socketId },
  });
  return deletedUser;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUser = async (username) => {
  prisma.user.findFirst({
    username: username,
  });
};
