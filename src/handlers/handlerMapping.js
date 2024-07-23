import { gameEnd, gameStart } from './game/game.handler.js';
import { monsterCreateHandler, monsterKillHandler } from './game/monster.handler.js'
import { createTower, upgradeTower } from './game/tower.handler.js'

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
