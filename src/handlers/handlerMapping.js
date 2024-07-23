import { gameEnd, gameStart } from './game.handler.js';
import { monsterCreateHandler, monsterKillHandler } from './monster.handler.js'
import { createTower, upgradeTower, attackTower } from './tower.handler.js'

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: monsterCreateHandler,
  12: monsterKillHandler,
  15: createTower,
  16: upgradeTower,
  17: attackTower,
};

export default handlerMappings;
