import { getUsers, getGold, setGold } from '../../models/user.model.js';
import {
  towerCost,
  upgradeCost,
  addTower,
  removeTower,
  getTowers,
} from '../../models/tower.model.js';

// 타워 정보 저장
export const saveTowerInfoHandler = (userId, payload) => {
  // userId 검증
  // const userId = getUsers();
  // userId.forEach(element => {
  //     if ( uuid !== element ) {
  //         console.log(`해당하는 userid와 일치하지 않습니다.`);
  //     }
  // })

  const towerData = {
    userId,
    towerX: payload.x,
    towerY: payload.y,
    // towerLevel: payload.towerLevel,
  };
  console.log('server recv:', towerData);
  addTower(towerData);
  console.log('server TowerList:', getTowers());

  console.log(
    `SERVER측 타워 정보 저장 - userId: ${towerData.userId}, towerX: ${towerData.towerX}, towerY: ${towerData.towerY}`,
  );
  return {
    status: 'success',
    message: `SERVER측 타워 정보 저장 - userId: ${towerData.userId}, towerX: ${towerData.towerX}, towerY: ${towerData.towerY}`,
  };
};

export const upgradeTower = (userId, payload) => {
  const towers = getTowers();
  console.log('towers:', towers);
  const { towerIndex } = payload;
  //console.log('towerIndex:',towerIndex);

  const user = getUsers();

  const goldNow = getGold();
  const Cost = upgradeCost;

  if (user[0].userId !== userId) {
    return { status: 'fail', message: '유저 정보가 다릅니다.' };
  }

  console.log('towers[towerIndex]:', towers[towerIndex]);
  if (!towers[towerIndex]) {
    return { status: 'fail', message: '서버에 존재하지 않는 대상입니다.' };
  }

  // 골드 감소 반영
  setGold(goldNow - Cost);

  return {
    status: 'success',
    message: '대상 확인, 타워를 업그레이드했습니다.',
  };
};

export const refundTower = (userId, payload) => {
  const towers = getTowers();
  const { towerIndex, upgradeCount } = payload;
  
  const user = getUsers();

  const goldNow = getGold();
  const Cost = towerCost;

  if (user[0].userId !== userId) {
    return { status: 'fail', message: '유저 정보가 다릅니다.' };
  }

  if (!towers[towerIndex]) {
    return { status: 'fail', message: '서버에 존재하지 않는 대상입니다.' };
  }

  // 골드증가 반영
  setGold(goldNow + Cost * (1 + upgradeCount) / 2);
  
  // 판매대상 타워삭제
  removeTower(towerIndex);

  return {
    status: 'success',
    message: '대상 확인, 타워를 판매했습니다.',
  };
};

export const attackTower = (uuid, payload) => {};
