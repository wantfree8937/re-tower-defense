const users = [];
let gold = 0;

export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUsers = () => {
  return users;
};

export const getGold = () => {
  return gold;
};

export const setGold = (num) => {
  gold = num;
};

export const clearGold = () => {
  gold = 0;
};
