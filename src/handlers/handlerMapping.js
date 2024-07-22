import { gameEnd, gameStart } from './game.handler.js';
import { monsterCreateHandler, monsterKillHandler } from './monster.handler.js'
import { createTower, upgradeTower } from './tower.handler.js'

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: monsterCreateHandler,
  12: monsterKillHandler,
  15: createTower,
  16: upgradeTower,
};

export default handlerMappings;
