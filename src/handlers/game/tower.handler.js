// import { getUsers } from "../models/user.model.js";
import { getTowers } from "../../models/tower.model.js";


// 타워 정보 저장
export const saveTowerInfoHandler = (uuid, payload) => {

    // userId 검증
    // const userId = getUsers();
    // userId.forEach(element => {
    //     if ( uuid !== element ) {
    //         console.log(`해당하는 userid와 일치하지 않습니다.`);
    //     }
    // })

    const towers = getTowers();
    const towerData = {
        uuid,
        towerX: payload.x,
        towerY: payload.y,
        // towerLevel: payload.towerLevel,
    }
    towers.push(towerData);
    console.log(`SERVER측 타워 정보 저장 : ${towerData}`);
};

// import { getUsers } from '../../models/user.model.js';
// import { addTower, removeTower, getTowers, updateTower } from '../../models/tower.model.js';

// export const createTower = (uuid, payload) => {
//   const tower = payload.towers[payload.towers.length - 1];
//   addTower(tower);

//   const userId = getUsers();
//   const towers = getTowers();

//   if (userId[0].uuid !== uuid) {
//     return { status: 'fail', message: '유저 정보가 다릅니다.' };
//   }

//   if (towers.length !== payload.towers.length) {
//     return { status: 'fail', message: '서버와 타워 데이터가 다릅니다.' };
//   }

//   return {
//     status: 'success',
//     message: '타워가 생성되었습니다.',
//   };
// };

// export const upgradeTower = (uuid, payload) => {
//   const towers = getTowers();
//   const { towerIndex } = payload;

//   const userId = getUsers();

//   if (userId[0].uuid !== uuid) {
//     return { status: 'fail', message: '유저 정보가 다릅니다.' };
//   }

//   if (!towers[towerIndex]) {
//     return { status: 'fail', message: '서버에 존재하지 않는 대상입니다.' };
//   }

//   return {
//     status: 'success',
//     message: '대상 확인, 타워를 업그레이드했습니다.',
//   };
// };
