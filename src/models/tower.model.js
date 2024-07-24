const towers = [];
export const towerCost = 500;
export const upgradeCost = 500;

export const addTower = (tower) => {
  towers.push(tower);
};

export const removeTower = (towerIndex) => {
  const index = towerIndex;
  if (index == -1) {
    return -1;
  } else {
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