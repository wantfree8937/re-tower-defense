import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import { CLIENT_VERSION } from './Constants.js';

function getCookieValue(name) {
  const regex = new RegExp(`(^| )${name}=([^;]+)`);
  const match = document.cookie.match(regex);
  if (match) {
    return match[2];
  }
}
const token = getCookieValue('authorization');

//토큰이 없으면 로그인!
if (!token) {
  window.location.href = 'login.html';
}

let serverSocket; // 서버 웹소켓 객체
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const NUM_OF_MONSTERS = 5; // 몬스터 개수

let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력

let towerCost = 0; // 타워 구입 비용
let numOfInitialTowers = 0; // 초기 타워 개수
let monsterLevel = 0; // 몬스터 레벨
let monsterSpawnInterval = 0; // 몬스터 생성 주기
let goldenMonsterSpawnInterval = 0; // 황금고블린 생성 주기
let monsterType = 1; // 황금고블린과 일반 몬스터 구분을 위한 type 생성
const monsters = [];
const towers = [];

let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let isInitGame = false;
let isGameOver = false;

let isBuy = false;  // 구매 상태
let isRefund = false; // 판매 상태
let isUpgrade = false; // 업그레이드 상태
const upgradeCost = 500; // 업그레이드 비용

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImage = new Image();
towerImage.src = 'images/tower.png';

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

// 황금고블린 이미지 생성
const goldenMonsterImages = [];
const makeGoldenMonsterImages = () => {
  const img = new Image();
  img.src = `images/monster${6}.png`;
  goldenMonsterImages.push(img);
};
makeGoldenMonsterImages();

let monsterPath;

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width - 100) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width - 100) {
      currentX = canvas.width - 50;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > canvas.height) {
      currentY = canvas.height;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath();
}

function drawPath() {
  const segmentLength = 20; // 몬스터 경로 세그먼트 길이
  const imageWidth = 60; // 몬스터 경로 이미지 너비
  const imageHeight = 60; // 몬스터 경로 이미지 높이
  const gap = 5; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < monsterPath.length - 1; i++) {
    const startX = monsterPath[i].x;
    const startY = monsterPath[i].y;
    const endX = monsterPath[i + 1].x;
    const endY = monsterPath[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도는 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      // 사실 이거는 삼각함수에 대한 기본적인 이해도가 있으면 충분히 이해하실 수 있습니다.
      // 자세한 것은 https://thirdspacelearning.com/gcse-maths/geometry-and-measure/sin-cos-tan-graphs/ 참고 부탁해요!
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function getRandomPositionNearPath(maxDistance) {
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function placeInitialTowers() {
  for (let i = 0; i < numOfInitialTowers; i++) {
    const { x, y } = getRandomPositionNearPath(200);
    const tower = new Tower(x, y, towerCost);
    towers.push(tower);
    console.log(tower);
    tower.draw(ctx, towerImage);

    sendEvent(21, { x, y, isInitial: true });
  }
}

function placeNewTower(data) {
  if (userGold < towerCost) {
    console.log('골드가 부족합니다!');
  } else {
    const { x, y } = data;
    const tower = new Tower(x, y, towerCost);
    towers.push(tower);
    tower.draw(ctx, towerImage);

    sendEvent(21, { x, y });
  }
}

// 타워 판매
function buyTower() {
  if (!isBuy) {
    isRefund = false;
    isUpgrade = false;
    isBuy = true;
  } else {
    isBuy = false;
  }
}

// 타워 판매
function refundTower() {
  if (!isRefund) {
    isBuy = false;
    isUpgrade = false;
    isRefund = true;
  } else {
    isRefund = false;
  }
}

// 타워 업그레이드
function upgradeTower() {
  if (!isUpgrade) {
    isBuy = false;
    isRefund = false;
    isUpgrade = true;
  } else {
    isUpgrade = false;
  }
}

//타워 클릭 이벤트
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const towerRangeX = 30;
  const towerRangeY = 30;
  
  if (isBuy) {
    if (userGold < upgradeCost) {
      console.log('골드가 부족합니다!');
    } else {
      const towerWidth = 78;
      const towerHeight = 150;
      const x = clickX - (towerWidth / 2);
      const y = clickY - (towerHeight / 2);
      placeNewTower({ x, y });
    }
    isBuy = false;
  } else {
    for (let i = 0; i < towers.length; i++) {
      const tower = towers[i];

      const towerCenterX = tower.x + tower.width / 2;
      const towerCenterY = tower.y + tower.height / 2;

      const deltaX = Math.abs(towerCenterX - clickX);
      const deltaY = Math.abs(towerCenterY - clickY);

      if (deltaX <= towerRangeX && deltaY <= towerRangeY && isRefund) {
        sendEvent(17, { towerIndex: i, upgradeCount: towers[i].upgraded });
        towers.splice(i, 1);
      } else if (deltaX <= towerRangeX && deltaY <= towerRangeY && isUpgrade) {
        if (userGold < upgradeCost) {
          console.log('골드가 부족합니다!');
        } else {
          const res = towers[i].upgrade(userGold); // 업그레이드 가능여부 확인 후 강화
          if (res) {
            sendEvent(16, { towerIndex: i });
          } // 업그레이드 비용만큼 골드 감소
          else {
            console.log('업그레이드 실패');
          }
        }
      }
    }
  }
});

function placeBase() {
  const lastPoint = monsterPath[monsterPath.length - 1];
  base = new Base(lastPoint.x, lastPoint.y, baseHp);
  base.draw(ctx, baseImage);
}

function spawnMonster() {
  const normalMonster = new Monster(monsterPath, monsterImages, monsterLevel, 1);
  monsters.push(normalMonster);

  sendEvent(11, {
    monsterLevel,
    monsters,
  });
}

// 황금 고블린 생성 함수
function spawnGoldenMonster() {
  const goldenMonster = new Monster(monsterPath, goldenMonsterImages, monsterLevel, 2);
  goldenMonster.speed = 10;

  monsters.push(goldenMonster);
  sendEvent(11, {
    monsters,
  });
}

function gameLoop() {
  if (isGameOver) {
    return;
  }

  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  if (isBuy) {
    ctx.fillStyle = 'black';
    ctx.fillText(`타워생성 위치지정`, 800, 150);
  }
  if (isUpgrade) {
    ctx.fillStyle = 'black';
    ctx.fillText(`타워 강화 모드 ON`, 800, 150);
  }
  if (isRefund) {
    ctx.fillStyle = 'black';
    ctx.fillText(`타워 판매 모드 ON`, 800, 150);
  }

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower) => {
    tower.draw(ctx, towerImage);
    tower.updateCooldown();
    monsters.forEach((monster) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const isDestroyed = monster.move(base);
      if (isDestroyed) {
        base.draw(ctx, baseImage);
        /* 게임 오버 */
        isGameOver = true;
        sendEvent(3, { score, highScore });

        setTimeout(() => {
          alert(`게임 오버. 서버 내 최고 점수: ${highScore}`);
          location.reload();
        }, 500);
      }
      monster.draw(ctx);
    } else {
      /* 몬스터가 죽었을 때 */
      monsters.splice(i, 1);
      sendEvent(12, {
        index: i,
        monsterLevel,
        monsters,
        score,
      });
    }
  }

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function dataSync(data) {
  userGold = data.userGold !== undefined ? data.userGold : userGold;
  baseHp = data.baseHp !== undefined ? data.baseHp : baseHp;
  monsterLevel = data.monsterLevel !== undefined ? data.monsterLevel : monsterLevel;
  score = data.score !== undefined ? data.score : score;
  highScore = data.highScore !== undefined ? data.highScore : highScore;
}

function initGame() {
  if (isInitGame) {
    return;
  }

  monsterPath = generateRandomMonsterPath(); // 몬스터 경로 생성
  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)
  placeInitialTowers(); // 설정된 초기 타워 개수만큼 사전에 타워 배치
  placeBase(); // 기지 배치

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  setInterval(spawnGoldenMonster, goldenMonsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  /* 서버 접속 코드 (여기도 완성해주세요!) */
  serverSocket = io('http://localhost:3000', {
    query: {
      clientVersion: CLIENT_VERSION,
      token: getCookieValue('authorization'),
    },
    auth: {
      token: localStorage.getItem('token'), // 토큰이 저장된 어딘가에서 가져와야 합니다!
    },
  });

  let userId = null;
  serverSocket.on('response', async (data) => {
    console.log(data);
    if (data.syncData) {
      // response에 syncData가 포함되어 있으면 데이터 동기화 함수 실행
      dataSync(data.syncData);
    }
  });

  serverSocket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
    userGold = data.initdata.userGold;
    baseHp = data.initdata.baseHp;
    towerCost = data.initdata.towerCost;
    numOfInitialTowers = data.initdata.numOfInitialTowers;
    monsterLevel = data.initdata.monsterLevel;
    monsterSpawnInterval = data.initdata.monsterSpawnInterval;
    goldenMonsterSpawnInterval = data.initdata.goldenMonsterSpawnInterval;
    highScore = data.highScore;
    if (!isInitGame) {
      initGame();
    }
  });

  /* 
    서버의 이벤트들을 받는 코드들은 여기다가 쭉 작성해주시면 됩니다! 
    e.g. serverSocket.on("...", () => {...});
    이 때, 상태 동기화 이벤트의 경우에 아래의 코드를 마지막에 넣어주세요! 최초의 상태 동기화 이후에 게임을 초기화해야 하기 때문입니다! 
    if (!isInitGame) {
      initGame();
    }
  */
});

const sendEvent = (handlerId, payload) => {
  serverSocket.emit('event', {
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '300px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';

buyTowerButton.addEventListener('click', buyTower);
document.body.appendChild(buyTowerButton);

const upgradeTowerButton = document.createElement('button');
upgradeTowerButton.textContent = '타워 업그레이드';
upgradeTowerButton.style.position = 'absolute';
upgradeTowerButton.style.top = '10px';
upgradeTowerButton.style.right = '130px';
upgradeTowerButton.style.padding = '10px 20px';
upgradeTowerButton.style.fontSize = '16px';
upgradeTowerButton.style.cursor = 'pointer';

upgradeTowerButton.addEventListener('click', upgradeTower);
document.body.appendChild(upgradeTowerButton);

const refundTowerButton = document.createElement('button');
refundTowerButton.textContent = '타워 판매';
refundTowerButton.style.position = 'absolute';
refundTowerButton.style.top = '10px';
refundTowerButton.style.right = '10px';
refundTowerButton.style.padding = '10px 20px';
refundTowerButton.style.fontSize = '16px';
refundTowerButton.style.cursor = 'pointer';

refundTowerButton.addEventListener('click', refundTower);
document.body.appendChild(refundTowerButton);

export { sendEvent };
