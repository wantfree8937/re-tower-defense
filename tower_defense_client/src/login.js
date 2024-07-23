function setCookie(token) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 3600 * 1000);

  // 쿠키 생성
  document.cookie = `authorization=Bearer ${token}; expires=${expirationDate.toUTCString()}; path=/`;
}

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.status === 200) {
      setCookie(result.data.token); // 로그인 성공 시 쿠키 설정
      console.log('로그인 성공!', result);

      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      console.error('로그인은 에이스가 아니었습니다.', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error(error);
    alert('서버와 통신 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
  }
});

document.getElementById('back').addEventListener('click', () => {
  window.location.href = 'index.html';
});
