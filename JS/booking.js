const BOOKINGS_KEY = "fixflow-bookings";
const phoneRegex = /^03\d{2}-?\d{7}$/;        

 
const rules = {
  name:    v => v.trim().length < 3 ? "Please enter your full name (at least 3 letters)." : "",
  phone:   v => !phoneRegex.test(v.trim()) ? "Enter a valid mobile number like 0300-1234567." : "",
  area:    v => !v ? "Please choose your area." : "",
  address: v => v.trim().length < 8 ? "Please enter your full address (house, street)." : "",
  service: v => !v ? "Please choose a service." : "",
  date:    v => !v ? "Please pick a date." : (v < todayISO() ? "The date cannot be in the past." : ""),
  time:    v => !v ? "Please choose a time slot." : ""
};

 
function todayISO() {                          
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function fillAreas() {                         
  const city = document.getElementById("city").value;
  document.getElementById("area").innerHTML =
    '<option value="">Choose your area</option>' +
    CITIES[city].map(a => `<option>${a}</option>`).join("");
}

function checkField(id) {                      
  const input = document.getElementById(id);
  const msg = rules[id](input.value);
  const box = document.getElementById("err-" + id);
  box.textContent = msg;
  box.classList.toggle("show", msg !== "");
  input.classList.toggle("input-error", msg !== "");
  input.classList.toggle("input-success", msg === "");
  return msg === "";
}

 
window.addEventListener("citychange", () => {
  const city = document.getElementById("city");
  if (city) { city.value = getCity(); fillAreas(); }
});

 
Pages.booking = function () {
  const session = getSession();
  const authBox = document.getElementById("bookingAuthRequired");
  const formWrap = document.getElementById("formCardWrap");
  const form = document.getElementById("bookingForm");
  const chosen = Router.params().get("service");

   
  if (!session) {
    if (authBox) {
      authBox.classList.remove("d-none");
      const loginBtn = document.getElementById("loginToBookBtn");
      if (loginBtn) {
        loginBtn.href = chosen
          ? `#/login?redirect=booking&service=${encodeURIComponent(chosen)}`
          : "#/login?redirect=booking";
      }
    }
    if (formWrap) formWrap.classList.add("d-none");
    return;
  }

  if (authBox) authBox.classList.add("d-none");
  if (formWrap) formWrap.classList.remove("d-none");

   
  const userLabel = document.getElementById("loggedInUserLabel");
  if (userLabel) userLabel.textContent = `${session.name} (${session.email})`;

  const nameField = document.getElementById("name");
  if (nameField && !nameField.value) nameField.value = session.name || "";

  const phoneField = document.getElementById("phone");
  if (phoneField && !phoneField.value && session.phone) phoneField.value = session.phone;

   
  document.getElementById("city").innerHTML =
    Object.keys(CITIES).map(c => `<option>${c}</option>`).join("");
  document.getElementById("city").value = getCity();
  fillAreas();

  document.getElementById("service").innerHTML =
    '<option value="">Choose a service</option>' +
    SERVICES.map(s => `<option>${s.name}</option>`).join("");

   
  if (chosen) document.getElementById("service").value = chosen;

  document.getElementById("date").min = todayISO();       

   
  document.getElementById("city").addEventListener("change", fillAreas);

   
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("change", () => checkField(id));
    el.addEventListener("blur", () => checkField(id));
  });

  form.addEventListener("submit", submitBooking);

  document.getElementById("bookAnother").addEventListener("click", () => {
    form.reset();
    document.getElementById("city").value = getCity();
    fillAreas();
    form.querySelectorAll(".input-success, .input-error").forEach(el => el.classList.remove("input-success", "input-error"));
    document.getElementById("successBox").classList.add("d-none");
    document.getElementById("formCard").classList.remove("d-none");
    if (session) {
      if (nameField) nameField.value = session.name || "";
      if (phoneField && session.phone) phoneField.value = session.phone;
    }
  });
};

 
function submitBooking(e) {
  e.preventDefault();                           

  const session = getSession();
  if (!session) {
    alert("Please log in to place a booking.");
    location.hash = "#/login?redirect=booking";
    return;
  }

   
  const allValid = Object.keys(rules).map(checkField).every(ok => ok);
  if (!allValid) {
    document.querySelector(".input-error").focus();       
    return;
  }

  const val = id => document.getElementById(id).value.trim();
  const booking = {
    id: "FF-" + Date.now().toString().slice(-6),
    name: val("name"), phone: val("phone"),
    city: val("city"), area: val("area"), address: val("address"),
    service: val("service"), date: val("date"), time: val("time"),
    payment: document.querySelector("input[name=payment]:checked").value,
    notes: val("notes"),
    userEmail: session.email || "",
    status: "Pending",
    created: new Date().toISOString()
  };

   
  const list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  list.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));

   
  document.getElementById("bookingId").textContent = booking.id;
  document.getElementById("bookingSummary").textContent =
    `${booking.service} in ${booking.area}, ${booking.city} on ${booking.date} (${booking.time}).`;
  document.getElementById("formCard").classList.add("d-none");
  document.getElementById("successBox").classList.remove("d-none");
  window.scrollTo(0, 0);
}
