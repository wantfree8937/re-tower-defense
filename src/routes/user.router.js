import express from 'express';
import dotenv from 'dotenv';
import { addUser, getUser } from '../models/user.model.js';

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
    const newUser = await addUser(username, password);

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
});

export default router;
