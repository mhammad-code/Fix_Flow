
const USERS_KEY = "fixflow-users";
const SESSION_KEY = "fixflow-session";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 
function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)); }
function getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }

 
if (!getUsers().some(u => u.role === "admin")) {
  saveUsers([...getUsers(), { name: "Admin", email: "admin@fixflow.pk", phone: "", password: "admin123", role: "admin" }]);
}

 
function updateAuthUI() {
  const btn = document.getElementById("authBtn");
  const adminNavBtn = document.getElementById("adminNavBtn");
  const s = getSession();

  if (btn) {
    btn.textContent = s ? "Logout (" + s.name.split(" ")[0] + ")" : "Login";
    btn.setAttribute("href", s ? "#/" : "#/login");
  }

   
  if (adminNavBtn) {
    if (s && s.role === "admin") {
      adminNavBtn.classList.remove("d-none");
    } else {
      adminNavBtn.classList.add("d-none");
    }
  }
}

document.getElementById("authBtn").addEventListener("click", () => {
  if (getSession()) {
    localStorage.removeItem(SESSION_KEY);
    updateAuthUI();
    const hash = location.hash;
    if (hash.startsWith("#/admin") || hash.startsWith("#/dashboard")) {
      location.hash = "#/";
    } else if (hash.startsWith("#/booking")) {
       
      if (window.Pages && window.Pages.booking) window.Pages.booking();
    }
  }
});
updateAuthUI();

 
function showFieldError(id, msg) {
  const input = document.getElementById(id);
  const box = document.getElementById("err-" + id);
  box.textContent = msg;
  box.classList.toggle("show", msg !== "");
  input.classList.toggle("input-error", msg !== "");
  input.classList.toggle("input-success", msg === "");
  return msg === "";
}

function startSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role
  }));
  updateAuthUI();

  const params = Router.params();
  const redirect = params.get("redirect");
  const service = params.get("service");

  if (user.role === "admin") {
    location.hash = "#/admin";
  } else if (redirect === "booking") {
    location.hash = service ? `#/booking?service=${encodeURIComponent(service)}` : "#/booking";
  } else {
    location.hash = "#/dashboard";
  }
}

 
Pages.login = function () {
  const params = Router.params();
  const isBookingRedirect = params.get("redirect") === "booking";
  const bookingNotice = document.getElementById("loginBookingNotice");
  if (bookingNotice) {
    bookingNotice.classList.toggle("d-none", !isBookingRedirect);
  }

   
  document.querySelectorAll("[data-pass]").forEach(btn => btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.pass);
    input.type = input.type === "password" ? "text" : "password";
    btn.firstElementChild.className = input.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
  }));

   
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const pass = document.getElementById("loginPass").value;
    const a = showFieldError("loginEmail", emailRegex.test(email) ? "" : "Enter a valid email address.");
    const b = showFieldError("loginPass", pass.length >= 6 ? "" : "Password must be at least 6 characters.");
    if (!(a && b)) return;

    const user = getUsers().find(u => u.email === email && u.password === pass);
    const msg = document.getElementById("loginMsg");
    if (!user) { msg.textContent = "Wrong email or password."; msg.classList.remove("d-none"); return; }
    startSession(user);
  });

   
  document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const email = v("regEmail").toLowerCase();
    const checks = [
      showFieldError("regName", v("regName").length >= 3 ? "" : "Enter your full name."),
      showFieldError("regEmail", !emailRegex.test(email) ? "Enter a valid email address."
                                 : getUsers().some(u => u.email === email) ? "This email is already registered." : ""),
      showFieldError("regPhone", phoneRegex.test(v("regPhone")) ? "" : "Enter a valid number like 0300-1234567."),
      showFieldError("regPass", v("regPass").length >= 6 ? "" : "Password must be at least 6 characters."),
      showFieldError("regPass2", v("regPass2") === v("regPass") ? "" : "Passwords do not match.")
    ];
    if (!checks.every(ok => ok)) return;

    const user = { name: v("regName"), email, phone: v("regPhone"), password: v("regPass"), role: "customer" };
    saveUsers([...getUsers(), user]);
    startSession(user);                        
  });
};
