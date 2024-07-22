import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { addUser, getUser } from '../models/user.model.js';

dotenv.config();
const router = express.Router();

//회원가입 API

router.post('/sign-up'),
  async (req, res, next) => {
    const { username, password } = req.body;
    const existUser = Json.parse(await getUser(username));

    if (existUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    const validId = /^[a-z0-9]+$/;

    if (!validId.test(username)) {
      return res
        .status(400)
        .json({ message: '아이디는 아이디는 소문자와 숫자만 사용할 수 있습니다.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    const newUser = addUser(username, password);

    const userUUID = newUser.uuid;

    return res.status(200).json({ message: '회원가입이 완료되었습니다람쥐!' });
  };
