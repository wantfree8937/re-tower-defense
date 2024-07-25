### Team.ProjectNull

# 🌱 RE: 타워 디펜스 게임

## 🔍 소개

- 팀명 **Project Null** 은 Null의 속성을 착안하여 지은 팀명입니다.
- 비워진 값(null)을 채워 넣으며, 지식의 공백을 채우자는 의미로 지었습니다.
- Socket.io 를 이용한 타워 디펜스 게임 프로젝트
- - 제작 기간 : 2024.7.19.(목) ~ 2024.7.25.(수)

## 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/wantfree8937"><img src="https://avatars.githubusercontent.com/u/101966192?v=4" width="100px;" alt=""/><br /><sub><b> 팀장 : 박승엽  </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/Kdkplaton"><img src="https://avatars.githubusercontent.com/u/160683826?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 김동규 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/uchanjeon"><img src="https://avatars.githubusercontent.com/u/167044937?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 전우찬 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/JollyDude16"><img src="https://avatars.githubusercontent.com/u/167201080?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 민광규 </b></sub></a><br /></td>
    </tr>
      <td align="center"><a href="https://github.com/ru2134"><img src="https://avatars.githubusercontent.com/u/167045410?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 황남웅 </b></sub></a><br /></td>
  </tbody>
</table>

## ⚙️ Backend 기술 스택

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/socketdotio-010101?style=for-the-badge&logo=prisma&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

## 구현 기능

- **유저(user) 이벤트**

1. **회원 가입**

- 회원가입 시 MySQL에 유저의 username 과 해시된 PW를 저장하고 추가적으로 user-id 를 생성해서 저장합니다.

2. **로그인**

- 로그인 시 서버에서는 DB조회 후 검증한 뒤 쿠키를 생성합니다.
- 클라이언트에서는 쿠키를 헤더(authorization)에 저장하고, 유저의 ID를 토큰에 저장합니다.

- **게임 초기화(게임 시작 이벤트)**

3. **길 배치**

- 클라이언트에서 맵의 가로 기준 처음과 끝까지 일정 간격으로 x, y 좌표를 생성합니다.
- 각 좌표와 좌표를 순서대로 잇는 길을 생성합니다.

4. **초기 타워 배치**

- x, y 좌표로 이루어진 위치 정보를 numOfInitialTower 변수에 저장된 숫자만큼 생성합니다.
- 각 위치 정보를 클래스로 만들어 towers 배열에 추가합니다.

- **게임 이벤트**
- **게임 이벤트/ 타워 이벤트**

5. **타워 구입 이벤트**

- 게임 시작시, 타워 구입 버튼을 볼 수 있습니다.
- 해당 버튼을 클릭시 타워 구입 이벤트가 실행되게 됩니다.
- 타워 구입 이벤트는 타워에 타워의 가격만큼 유저의 골드를 차감시키고 타워 생성 이벤트를 실행시킵니다.
- 타워 생성 이벤트는 길 주변의 렌덤한 좌표에 타워를 생성합니다.

6. **타워 업그레이드**

- 타워 업그레이드 버튼을 클릭해서 타워 업그레이드 이벤트를 활성화 합니다.
- 이벤트 활성화 중 캔버스 내의 클릭한 위치를 클라이언트에서 전송합니다.
- 클릭한 위치에서 일정 거리 내의 타워를 탐색합니다.
- 클릭 위치에서 가장 가까운 타워를 업그레이드할 타워로 지정합니다.
- 유저가 업그레이드 비용을 소지하고 있는 지 확인하고, 소지 하고 있지 않다면, 강화 이벤트를 비활성화합니다.
- 타워 업그레이드 이벤트 발생시 업그레이드 비용만큼 골드를 차감하고 타워를 강화합니다.

7. **타워 환불**

- 타워 환불버튼을 클릭해서 타워 환불 이벤트를 활성화 합니다.
- 이벤트 활성화 중 캔버스 내의 클릭한 위치를 클라이언트에서 전송합니다.
- 클릭한 위치에서 일정 거리 내의 타워를 탐색합니다.
- 클릭 위치에서 가장 가까운 타워를 환불할 타워로 지정합니다.
- 타워 환불 이벤트 발생 시 구매 비용의 절반(혹은 환불 비용)만큼의 골드를 차감하고 지정된 타워를 제거합니다.

- **게임 이벤트/ 몬스터 이벤트**

8. **몬스터 생성**

- 일정 주기로 몬스터가 생성됩니다.

9. **타워 몬스터 공격**

- 타워가 생성된 몬스터의 배열을 순회하며, 몬스터들의 좌표를 탐색합니다.
- 몬스터가 타워 좌표 기준 공격 범위에 들어오면 몬스터 공격 이벤트가 발생합니다.
- 몬스터가 범위 밖으로 나갈 때 까지 일정 주기로 탐색된 몬스터를 공격합니다.
- 몬스터가 범위 밖으로 나가면 다음 몬스터를 탐색합니다.

10. **몬스터 사망**

- 몬스터가 사망하면 100점 씩 유저가 획득하며, 점수가 1000점 단위로 오를 때 마다 골드를 획득합니다.

11. **상태 동기화**

- 클라이언트에서 리스폰스 데이터를 받을 때 마다, userGold, baseHp, monsterLevel, score, highscore 정보 업데이트합니다.

## **ERD Diagram**

![image](https://github.com/user-attachments/assets/797d5345-f89d-40e7-b867-e1dcc93224af)
