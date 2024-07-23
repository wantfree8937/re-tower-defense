import jwt from 'jsonwebtoken';
import { getUser } from '../db/user/user.db.js';

export const authMiddleware = async (cookie) => {
  try {
    if (!cookie) throw new Error('토큰이 존재하지 않습니다.');

    const [tokenType, token] = cookie.split(' ');

    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');

    const decodedToken = jwt.verify(token, 'customized_secret_key');
    const username = decodedToken.username;

    const user = await getUser(username);

    if (!user) {
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    console.log('userData 정보', user);
    return user;
  } catch (err) {
    console.log(err);
  }
};
