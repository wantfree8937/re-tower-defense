export const SQL_QUERIES = {
  FIND_USER_BY_USERNAME: 'SELECT * FROM user WHERE username = ?',
  CREATE_USER: 'INSERT INTO user (username, password) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  GET_USERS: 'SELECT * FROM user',

  GET_HIGHSCORE: 'SELECT * FROM scores',
  UPDATE_USER_SCORE:
    'UPDATE scores SET user_id = CASE WHEN high_score < ? THEN ? ELSE user_id END, high_score = GREATEST(high_score, ?) WHERE rank_id = 1',
};
