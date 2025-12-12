// Navigation function
function goPage(page) {
  window.location.href = page;
}

document.addEventListener('DOMContentLoaded', function() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: "You" };

  // Dummy users
  const dummyUsers = [
    { username: "ankit roy", points: 120 },
    { username: "anish sharma", points: 250 },
    { username: "aayush shreastha", points: 180 },
    { username: "prithivi narayah shah", points: 550 }
  ];

  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Add dummy users if missing
  dummyUsers.forEach(dummy => {
    if (!users.some(u => u.username === dummy.username)) users.push(dummy);
  });

  localStorage.setItem('users', JSON.stringify(users));

  // Sort by points descending
  users.sort((a,b) => (b.points||0) - (a.points||0));

  function renderLeaderboard(usersList, tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    usersList.forEach((user, index) => {
      const tr = document.createElement('tr');
      if (currentUser && user.username === currentUser.username) {
        tr.style.backgroundColor = 'rgba(37,150,87,0.3)';
        tr.style.fontWeight = 'bold';
      }

      let rankDisplay = (index >= 3) ? (index + 1).toString() : '';
      if (index === 0) rankDisplay = '🥇';
      else if (index === 1) rankDisplay = '🥈';
      else if (index === 2) rankDisplay = '🥉';

      tr.innerHTML = `
        <td>${rankDisplay}</td>
        <td>${user.username}</td>
        <td>${user.points.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render all leaderboards with same data
  renderLeaderboard(users, 'global-leaderboard');
  renderLeaderboard(users, 'regional-leaderboard');
  renderLeaderboard(users, 'weekly-leaderboard');
});
