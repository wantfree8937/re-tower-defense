document.getElementById('register').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username.trim().length === 0) {
    alert('아이디를 입력해 주세요.');
    return;
  }
  if (password.trim().length === 0) {
    alert('비밀번호를 입력해 주세요.');
    return;
  }
  try {
    const response = await fetch('http://localhost:3000/api/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('회원가입 완료!', result);

      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      console.error('회원가입 실패!', error.message);
      alert('회원가입 실패!' + error.message);
    }
  } catch (error) {
    console.error('오?류 발생 :', error);
    alert('회원가입 중 오류가 발생했습니다!');
  }
});

document.getElementById('back').addEventListener('click', () => {
  window.location.href = 'index.html';
});
