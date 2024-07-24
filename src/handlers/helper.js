import { CLIENT_VERSION } from '../constants.js';
import { getUsers, removeUser, clearGold, setGold } from '../models/user.model.js';
import { clearMonsters } from '../models/monster.model.js';
import { clearScore } from '../models/score.model.js';
import handlerMappings from './handlerMapping.js';
import { getGameAssets } from '../init/assets.js';
import { getHighScore } from '../db/user/user.db.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  clearMonsters();
  clearScore();
  clearGold();
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

export const handleConnection = async (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  const [highScore] = await getHighScore();
  const initdata = getGameAssets().initData.data;
  setGold(initdata.userGold);

  socket.emit('connection', { uuid: userUUID, initdata, highScore: highScore.high_score });
};

export const handleEvent = (io, socket, userUUID, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
      socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
      return;
    }
  
    const handler = handlerMappings[data.handlerId];
    if (!handler) {
      socket.emit('response', { status: 'fail', message: 'Handler not found' });
      return;
    }
  
    // 적절한 핸들러에 userID 와 payload를 전달하고 결과를 받습니다.
    const response = handler(userUUID, data.payload);
    // 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 합니다.
    // if (response.broadcast) {
    //   io.emit('response', 'broadcast');
    //   return;
    // }
    // 해당 유저에게 적절한 response를 전달합니다.

    socket.emit('response', response);
  };