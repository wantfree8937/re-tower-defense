document.getElementById('login').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username.trim().length === 0) {
    alert('아이디가 입력되지 않았습니다.');
    return;
  }
  if (password.trim().length === 0) {
    alert('비밀번호가 입력되지 않았습니다');
    return;
  }
  try {
    const response = await fetch('http://localhost:3000/api/sign-in', {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        credential: 'include',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('로그인 성공!', result);

      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      console.error('로그인은 에이스가 아니었습니다.', error);
    }
  } catch (error) {
    console.error(error);
    return;
  }
});
/*
      로그인 API 호출 후 로그인 성공 시 index.html로 이동시켜주세요!
      이 때, 엑세스 토큰은 어딘가에 저장을 해놔야겠죠?!
    */

document.getElementById('back').addEventListener('click', () => {
  window.location.href = 'index.html';
});
