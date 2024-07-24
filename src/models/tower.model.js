const towers = [];

/*
towers = [
    {
    userid : xxx,
    tower.x : xxx,
    tower.y : xxx,
    tower.level : xxx
    }
]
*/

export const addTower = (tower) => {
  towers.push(tower);
};

export const removeTower = (socketId) => {
  const index = towers.findIndex((tower) => tower.socketId === socketId);
  if (index !== -1) {
    return towers.splice(index, 1)[0];
  }
};

export const getTowers = () => {
  return towers;
};

export const updateTower = (socketId) => {
  const index = towers.findIndex((tower) => tower.socketId === socketId);
  if (index !== -1) {
    
    return towers.splice(index, 1)[0];
  }
};