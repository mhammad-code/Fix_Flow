
const MESSAGES_KEY = "fixflow-messages";

function setMap() {
  const frame = document.getElementById("mapFrame");
  if (frame) frame.src = "https://www.google.com/maps?q=" + encodeURIComponent(getCity() + ", Pakistan") + "&output=embed";
}
window.addEventListener("citychange", setMap);

Pages.contact = function () {
  setMap();

  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const checks = [
      showFieldError("cName", v("cName").length >= 3 ? "" : "Please enter your name."),
      showFieldError("cEmail", emailRegex.test(v("cEmail")) ? "" : "Enter a valid email address."),
      showFieldError("cMessage", v("cMessage").length >= 10 ? "" : "Message must be at least 10 characters.")
    ];
    if (!checks.every(ok => ok)) return;

    const list = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
    list.push({ id: Date.now(), name: v("cName"), email: v("cEmail"), message: v("cMessage"), date: new Date().toISOString() });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(list));

    e.target.reset();
    e.target.querySelectorAll(".input-success").forEach(el => el.classList.remove("input-success"));
    document.getElementById("contactOk").classList.remove("d-none");
  });
};
