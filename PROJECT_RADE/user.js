document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(!currentUser){
    alert('Please login first!');
    window.location.href = 'index.html';
    return;
  }

  // Update username display
  const usernameDisplay = document.getElementById('usernameDisplay');
  usernameDisplay.innerText = currentUser.username || 'Username';

  // Update stats display
  document.getElementById('pointsDisplay').innerText = currentUser.points || 0;
  document.getElementById('streakDisplay').innerText = currentUser.streak || 0;
  document.getElementById('rankDisplay').innerText = currentUser.rank || 0;
  document.getElementById('aqiDisplay').innerText = 'N/A';

  // =====================
  // NAVIGATION FUNCTIONS
  // =====================
  window.goPage = function(page){
    window.location.href = page;
  }

  window.logout = function(){
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }

  window.openUsernamePopup = function(){
    const popup = document.getElementById('usernamePopup');
    popup.style.display = 'flex';
  }

  window.closeUsernamePopup = function(){
    const popup = document.getElementById('usernamePopup');
    popup.style.display = 'none';
  }

  window.updateUsername = function(){
    const input = document.getElementById('usernameInput').value.trim();
    if(!input){
      alert('Please enter a valid username');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const exists = users.some(u => u.username === input && u.username !== currentUser.username);
    if(exists){
      alert('Username already taken!');
      return;
    }

    users = users.map(u => {
      if(u.username === currentUser.username){
        u.username = input;
      }
      return u;
    });

    currentUser.username = input;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    usernameDisplay.innerText = input;
    closeUsernamePopup();
    alert('Username updated successfully!');
  }

  // =====================
  // STREAK SYSTEM FUNCTIONS
  // =====================
  function updateStreak() {
    const today = new Date();
    today.setHours(0,0,0,0); // normalize today

    if(!currentUser.lastUpload){
      currentUser.streak = 1;
    } else {
      const lastDate = new Date(currentUser.lastUpload);
      lastDate.setHours(0,0,0,0);
      const diffDays = Math.floor((today - lastDate) / (1000*60*60*24));

      if(diffDays === 1){
        currentUser.streak = (currentUser.streak || 0) + 1; // increment streak
      } else if(diffDays > 1){
        currentUser.streak = 1; // reset streak if missed day
      }
      // if diffDays === 0, do nothing (already uploaded today)
    }

    currentUser.lastUpload = today.toISOString();
    document.getElementById('streakDisplay').innerText = currentUser.streak;
    saveCurrentUser();
  }

  function saveCurrentUser(){
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => u.username === currentUser.username ? currentUser : u);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Call this function whenever the user uploads a comparison
  window.recordUpload = function(){
    // Update streak
    updateStreak();
  }
});
