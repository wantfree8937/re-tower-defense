import { toCamelCase } from '../../utils/transformCase.js';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';

export const getUser = async (username) => {
  const [users] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_USERNAME, [username]);
  return toCamelCase(users[0]);
};

export const getUsers = async () => {
  const [users] = await pools.USER_DB.query(SQL_QUERIES.GET_USERS);
  return users;
};

export const createUser = async (username, password) => {
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [username, password]);
  return { username, password };
};

export const updateUserLogin = async (username) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [username]);
};

// 하이스코어 테이블
export const getHighScore = async () => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.GET_HIGHSCORE);
  return rows;
};

export const updateHighScore = async (highScore, userId) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_SCORE, [highScore, userId, highScore]);
};
