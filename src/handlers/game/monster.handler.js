import { getUsers, getGold, setGold } from '../../models/user.model.js';
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

  const monsters = getMonsters();

  if (monsters.length !== payload.monsters.length) {
    return { status: 'fail', message: '서버와 몬스터 데이터가 다릅니다.' };
  }

  if (getScore() !== payload.score) {
    return { status: 'fail', message: '서버의 점수와 다릅니다.' };
  }

  addScore(100); // 몬스터 처치 시 스코어 100씩 증가

  if (getScore() % 1000 === 0) {
    const goldNow = getGold();
    setGold(goldNow+500); // 스코어가 1000 단위가 될 때마다 500골드 추가
    return {
      status: 'success',
      message: '몬스터를 처치했습니다. 골드를 획득합니다.',
      syncData: {
        score: getScore(),
        userGold: getGold(),
      },
    };
  }

  return {
    status: 'success',
    message: '몬스터를 처치했습니다.',
    syncData: {
      score: getScore(),
    },
  };
};
