let score = 0;

export const getScore = () => {
  return score;
};

export const addScore = (num) => {
  return score += num;
};

export const clearScore = () => {
  score = 0;
};
