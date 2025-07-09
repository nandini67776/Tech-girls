let count = localStorage.getItem('shareCount') ? parseInt(localStorage.getItem('shareCount')) : 0;
let submitted = localStorage.getItem('submitted') === 'true';

const counterText = document.getElementById('counterText');
const form = document.getElementById('registrationForm');
const whatsappBtn = document.getElementById('whatsappBtn');
const successMsg = document.getElementById('successMsg');
const countdownSpan = document.getElementById('countdown'); // Add <span id="countdown"> in HTML

updateCounter();

if (submitted) {
  disableForm();
  successMsg.classList.remove('hidden');
  startCountdown(); // trigger countdown
}

whatsappBtn.addEventListener('click', () => {
  if (count >= 5) return;
  count++;
  localStorage.setItem('shareCount', count);
  updateCounter();

  const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
  window.open(`https://wa.me/?text=${message}`, '_blank');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (count < 5) {
    alert("Please complete WhatsApp sharing before submitting.");
    return;
  }

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const college = document.getElementById('college').value.trim();
  const file = document.getElementById('screenshot').files[0];

  if (!name || !phone || !email || !college || !file) {
    alert("Please fill in all fields and upload a file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (event) {
    const base64Screenshot = event.target.result;

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("college", college);
    formData.append("screenshot", base64Screenshot);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbzaAOCdJAamEbYxxu4EdVhWPJJ9Z70k52uEWHbn5ZMFn6r6lIPUWAOsdzq9fTka4DmC/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      localStorage.setItem('submitted', 'true');
      disableForm();
      successMsg.classList.remove('hidden');
      startCountdown(); // Auto refresh after 5 seconds

    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  };

  reader.readAsDataURL(file);
});

function updateCounter() {
  counterText.textContent = `Click count: ${count}/5`;
  if (count >= 5) {
    counterText.textContent += " ✅ Sharing complete. Please continue.";
    whatsappBtn.disabled = true;
  }
}

function disableForm() {
  document.querySelectorAll("input, button").forEach(el => el.disabled = true);
}

// 🕒 Countdown and refresh function
function startCountdown() {
  let seconds = 1;
  const countdown = setInterval(() => {
    if (countdownSpan) countdownSpan.textContent = seconds;
    seconds--;
    if (seconds < 0) {
      clearInterval(countdown);
      localStorage.clear();
      location.reload();
    }
  }, 1000);
}
