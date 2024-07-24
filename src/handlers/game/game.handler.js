import { updateHighScore } from '../../db/user/user.db.js';

export const gameStart = (uuid, payload) => {
  return { status: 'success', message: 'game start!' };
};

export const gameEnd = (uuid, payload) => {
  const highScore = payload.highScore;
  const score = payload.score;

  if(score > highScore){
    updateHighScore(score, uuid)
    return {
      status: 'success',
      message: 'game end!',
      syncData: {
        highScore: score,
      },
    };
  }

  return {
    status: 'success',
    message: 'game end!',
    syncData: {
      highScore: highScore,
    },
  };
};
