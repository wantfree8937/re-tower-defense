const monsters = [];

export const addMonster = (monster) => {
  monsters.push(monster);
};

export const removeMonster = (index) => {
  monsters.splice(index, 1);
};

export const clearMonsters = () => {
  monsters.splice(0, monsters.length);
};

export const getMonsters = () => {
  return monsters;
};

export const getMonster = (index) => {
  return monsters[index];
};
