// Login check
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser){
  alert('Please login first!');
  window.location.href = 'index.html';
}

// Welcome message
document.getElementById("welcomeTextStore").textContent = `Hi ${currentUser.username}, use your points to get eco rewards!`;

// Show current points
const pointsEl = document.getElementById('currentPoints');
function updatePoints(){ pointsEl.innerText = currentUser.points || 0; }
updatePoints();

// Navigation
function goPage(page){ window.location.href = page; }

// Cart logic
let cart = [];

// Toast Notification
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(()=>{ toast.classList.remove('show'); }, 2000);
}

// Add to Cart (points not checked here)
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const id = card.dataset.id;
    const name = card.querySelector('h3').innerText;
    const price = parseInt(card.dataset.price);

    if(cart.find(item=>item.id==id)){
      showToast("Item already in cart!");
      return;
    }

    cart.push({id, name, price});
    showToast("✅ " + name + " added to cart!");
  });
});

// Cart Popup
const cartPopup = document.getElementById('cartPopup');
document.getElementById('openCart').addEventListener('click', () => {
  updateCartPopup();
  cartPopup.style.display = 'flex';
});
function closeCart(){ cartPopup.style.display='none'; }

function updateCartPopup(){
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  let total = 0;
  if(cart.length===0){
    container.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item => {
      container.innerHTML += `<div class="cart-item-card">${item.name} - ${item.price} Points</div>`;
      total += item.price;
    });
  }
  document.getElementById('cartTotal').innerText = "Total: " + total + " Points";
}

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
  let total = cart.reduce((sum, item)=>sum + item.price, 0);
  if(total > currentUser.points){
    alert("❌ Not enough points to checkout!");
    return;
  }

  currentUser.points -= total;
  updatePoints();

  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.map(u=> u.username===currentUser.username ? currentUser : u);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  alert("✅ Checkout successful! Points deducted: " + total);
  cart = [];
  closeCart();
});
