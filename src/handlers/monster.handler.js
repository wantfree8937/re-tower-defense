import { getUsers, removeUser } from '../models/user.model.js';
import { addMonster, getMonsters, removeMonster } from '../models/monster.model.js';

export const monsterCreateHandler = (uuid, payload) => {
  const monster = payload.monsters[payload.monsters.length - 1];
  addMonster(monster);

  const monsters = getMonsters();
  //console.log(monsters.length);

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

  return {
    status: 'success',
    message: '몬스터를 처치했습니다.',
  };
};
