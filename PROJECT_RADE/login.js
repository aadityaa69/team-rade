// CREATE FLOATING LEAVES
const leafContainer = document.getElementById("leafContainer");
const leafEmojis = ["🍃", "🍂", "🌿"];

function generateLeaves() {
  for (let i = 0; i < 35; i++) {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");

    // Random leaf emoji
    leaf.innerText = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];

    // Random starting X position
    leaf.style.left = Math.random() * 100 + "vw";

    // Random animation duration
    leaf.style.animationDuration = 6 + Math.random() * 6 + "s";

    // Random delay
    leaf.style.animationDelay = Math.random() * 5 + "s";

    // Random size
    leaf.style.fontSize = (18 + Math.random() * 14) + "px";

    leafContainer.appendChild(leaf);
  }
}

generateLeaves();

// ========== LOGIN / SIGNUP SYSTEM (keep your existing code) ==========
function showForm(form) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabs = document.querySelectorAll('.tab-btn');

  if(form === 'login'){
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
  }
}

if(!localStorage.getItem('users')){
  localStorage.setItem('users', JSON.stringify([]));
}

window.onload = function() {
  const savedUser = localStorage.getItem('savedUser');
  if(savedUser){
    const user = JSON.parse(savedUser);
    document.getElementById('loginUsername').value = user.username;
    document.getElementById('loginPassword').value = user.password;
    document.getElementById('remember').checked = true;
  }
}

function login(){
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorDiv = document.getElementById('loginError');
  errorDiv.innerText = '';

  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.username === username && u.password === password);

  if(user){
    localStorage.setItem('currentUser', JSON.stringify(user));
    if(document.getElementById('remember').checked){
      localStorage.setItem('savedUser', JSON.stringify({username, password}));
    } else {
      localStorage.removeItem('savedUser');
    }
    window.location.href = 'dashboard.html';
  } else {
    errorDiv.innerText = 'Invalid username or password!';
  }
}

function signup(){
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();
  const errorDiv = document.getElementById('signupError');
  errorDiv.innerText = '';

  if(!username || !password || !confirm){
    errorDiv.innerText = 'Please fill all fields.';
    return;
  }
  if(password !== confirm){
    errorDiv.innerText = 'Passwords do not match.';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users'));
  if(users.find(u => u.username === username)){
    errorDiv.innerText = 'Username already exists.';
    return;
  }

  users.push({username, password, points:0, streak:0});
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful!');
  showForm('login');
}
