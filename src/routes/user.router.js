import express from 'express';
import dotenv from 'dotenv';
import { createUser, getUser, getUsers } from '../db/user/user.db.js';

dotenv.config();

const router = express.Router();

// 회원가입 API
router.post('/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 기존 유저 확인
    const existUser = await getUser(username);

    if (existUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 아이디 유효성 검사
    const validId = /^[a-z0-9]+$/;

    if (!validId.test(username)) {
      return res.status(400).json({ message: '아이디는 소문자와 숫자만 사용할 수 있습니다.' });
    }

    // 비밀번호 길이 검사
    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // 유저 생성
    const newUser = await createUser(username, password);

    return res.status(200).json({ message: '회원가입이 완료되었습니다!', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/sign-in', async (req, res, next) => {
  const { username, password } = req.body;
  const user = getUser(username);
  if (!user) {
    return res.status(401).json({ message: '입력하신 아이디를 찾을 수 없습니다.' });
  }
  if (!bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
  }
import { prisma } from '../util/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const IDRULES = /^[a-z|A-Z|0-9]+$/;
const router = express.Router();
const saltRounds = await bcrypt.genSalt(10);

router.post('/sign-up', async (req, res, next) => {
  const { id, password } = req.body;
  const isExistUser = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 아이디 입니다' });
  } else if (!IDRULES.test(id)) {
    return res
      .status(400)
      .json({ message: '아이디는 영어 소문자와 숫자 조합으로 구성되어야 합니다' });
  } else if (password.length < 6) {
    return res.status(400).json({ message: `비밀번호는 최소 6자 이상이여야 합니다` });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // Create new user
  const registeredUser = await prisma.user.create({
    data: { id, password: hashedPassword },
  });

  await prisma.rank.create({
    data : {user_Id : registeredUser.user_Id, highscore : 0},
  })
  

  return res.status(201).json({ message: '회원가입이 완료되었습니다' });
});

router.post('/sign-in', async (req, res, next) => {
  const { id, password } = req.body;
  const user = await prisma.user.findFirst({ where: { id } });
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 아이디입니다' });
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
  const token = jwt.sign(
    {
      userId: user.user_Id,
    },
    process.env.CUSTOM_SECRET_KEY,
  );

  res.setHeader('Authorization', `Bearer ${token}`);

  return res.status(200).json({ message: '로그인 성공', data: `Bearer ${token}` });
});

export default router;
