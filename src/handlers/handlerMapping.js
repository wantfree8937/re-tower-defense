import { gameEnd, gameStart } from './game.handler.js';
import { monsterCreateHandler, monsterKillHandler } from './monster.handler.js'

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: monsterCreateHandler,
  12: monsterKillHandler,
};

export default handlerMappings;
