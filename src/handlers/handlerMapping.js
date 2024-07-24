import { gameEnd, gameStart } from './game/game.handler.js';
import { monsterCreateHandler, monsterKillHandler } from './game/monster.handler.js';
import { saveTowerInfoHandler, upgradeTower } from './game/tower.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: monsterCreateHandler,
  12: monsterKillHandler,
  // 15: createTower,
  16: upgradeTower,
  21: saveTowerInfoHandler,
};

export default handlerMappings;
