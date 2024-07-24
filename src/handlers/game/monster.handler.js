import { getUsers, getGold, setGold } from '../../models/user.model.js';
import { addMonster, getMonsters, removeMonster } from '../../models/monster.model.js';
import { setScore, getScore } from '../../models/score.model.js';

export const monsterCreateHandler = (userId, payload) => {
  const monster = payload.monsters[payload.monsters.length - 1];
  addMonster(monster);

  const monsters = getMonsters();

  const user = getUsers();

  if (user[0].userId !== userId) {
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

  const monsters = getMonsters();
  let gold = getGold();
  let score = getScore();

  if (monsters.length !== payload.monsters.length) {
    return { status: 'fail', message: '서버와 몬스터 데이터가 다릅니다.' };
  }

  if (score !== payload.score) {
    return { status: 'fail', message: '서버의 점수와 다릅니다.' };
  }

  score += 100; // 몬스터 처치 시 스코어 100씩 증가
  setScore(score);

  if (score % 1000 === 0) {
    gold += 500; // 스코어가 1000 단위가 될 때마다 500골드 추가
    setGold(gold);
    return {
      status: 'success',
      message: '몬스터를 처치했습니다. 골드를 획득합니다.',
      syncData: {
        score,
        userGold: gold,
      },
    };
  }

  return {
    status: 'success',
    message: '몬스터를 처치했습니다.',
    syncData: {
      score,
    },
  };
};
