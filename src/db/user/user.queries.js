export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM user WHERE username = ?',
  CREATE_USER: 'INSERT INTO user (username, password) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  GET_USERS: 'SELECT * FROM user',
};
