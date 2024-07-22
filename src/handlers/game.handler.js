export const gameStart = (uuid, payload) => {
  return { status: 'success', message: 'game start!' };
};

export const gameEnd = (uuid, payload) => {
  return { status: 'success', message: 'game end!' };
};