import { getUsers } from '../../models/user.model.js';
import { addMonster, getMonsters, removeMonster } from '../../models/monster.model.js';
import { addScore, getScore } from '../../models/score.model.js';


export const monsterCreateHandler = (uuid, payload) => {
  const monster = payload.monsters[payload.monsters.length - 1];
  addMonster(monster);

  const monsters = getMonsters();

  const userId = getUsers();

  if (userId[0].uuid !== uuid) {
    return { status: 'fail', message: '유저 정보가 다릅니다.' };
  }

  if (monsters.length !== payload.monsters.length) {
    return { status: 'fail', message: '서버와 몬스터 데이터가 다릅니다.' };
  }

  return {
    status: 'success',
    message: '몬스터가 생성되었습니다.',
  };
};

export const monsterKillHandler = (uuid, payload) => {
  removeMonster(payload.index);

  const point = 100;
  const monsters = getMonsters();
  let score = getScore();

  if (monsters.length !== payload.monsters.length) {
    return { status: 'fail', message: '서버와 몬스터 데이터가 다릅니다.' };
  }

  if (score !== payload.score) {
    return { status: 'fail', message: '서버의 점수와 다릅니다.' };
  }

  addScore(point);

  return {
    status: 'success',
    message: '몬스터를 처치했습니다.',
    syncData: {
      score: getScore(),
    }
  };
};