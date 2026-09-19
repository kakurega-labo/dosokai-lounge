//js/statusColor.js

  const statusEl = document.getElementById('status-display');

  database.ref('status').on('value', (snapshot) => {
    const val = snapshot.val();

    statusEl.classList.remove('status-green', 'status-yellow', 'status-red');

    if (val === 'green') {
      statusEl.textContent = '混雑なし';
      statusEl.classList.add('status-green');
    } else if (val === 'yellow') {
      statusEl.textContent = 'やや混雑';
      statusEl.classList.add('status-yellow');
    } else if (val === 'red') {
      statusEl.textContent = '大変混雑';
      statusEl.classList.add('status-red');
    } else {
      statusEl.textContent = '取得エラー';
    }
  });
