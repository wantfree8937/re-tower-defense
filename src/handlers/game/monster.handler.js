import { getUsers, getGold, setGold } from '../../models/user.model.js';
import {
  addMonster,
  getMonsters,
  removeMonster,
  getMonsterLevel,
  setMonsterLevel,
  getMonster,
} from '../../models/monster.model.js';
import { setScore, getScore } from '../../models/score.model.js';
import { getBaseHp, setBaseHp } from '../../models/base.model.js';

export const monsterCreateHandler = (userId, payload) => {
  const monster = payload.monsters[payload.monsters.length - 1];
  const monsterLevel = getMonsterLevel();
  const user = getUsers();

  if (user[0].userId !== userId) {
    return { status: 'fail', message: '유저 정보가 다릅니다.' };
  }

  if (monsterLevel !== monster.level) {
    return { status: 'fail', message: '서버와 몬스터 레벨이 다릅니다.' };
  }

  addMonster(monster);

  return {
    status: 'success',
    message: '몬스터가 생성되었습니다.',
  };
};

export const monsterKillHandler = (userId, payload) => {
  const deathMonster = getMonster(payload.index);
  removeMonster(payload.index);

  const monsters = getMonsters();
  let gold = getGold();
  let score = getScore();
  let monsterLevel = getMonsterLevel();
  const user = getUsers();

  if (user[0].userId !== userId) {
    return { status: 'fail', message: '유저 정보가 다릅니다.' };
  }

  if (monsters.length - 1 !== payload.monsters.length) {
    return { status: 'fail', message: '서버와 몬스터 데이터가 다릅니다.' };
  }

  if (score !== payload.score) {
    return { status: 'fail', message: '서버의 점수와 다릅니다.' };
  }

  console.log(`몬스터 타입은 : ${deathMonster.monsterType}`);
  if (deathMonster.monsterType === 1) {
    score += 100; // 몬스터 처치 시 스코어 100씩 증가
    setScore(score);
  } else {
    gold += 500; // 황금 고블린 처치 시 스코어 1000씩 증가
    setGold(gold);
  }

  if (score % 1000 === 0) {
    gold += 500; // 스코어가 1000 단위가 될 때마다 500골드 추가
    setGold(gold);
    monsterLevel++;
    setMonsterLevel(monsterLevel);
    return {
      status: 'success',
      message: '몬스터를 처치했습니다. 골드를 획득합니다.',
      syncData: {
        score,
        userGold: gold,
        monsterLevel,
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

export const baseUnderAttack = (userId, payload) => {
  const user = getUsers();

  if (user[0].userId !== userId) {
    return { status: 'fail', message: '유저 정보가 다릅니다.' };
  }

  const baseHp = getBaseHp();
  setBaseHp(baseHp);
  return {
    status: 'success',
    message: '기지가 공격당함.',
    syncData: {
      baseHp,
    },
  };
};
