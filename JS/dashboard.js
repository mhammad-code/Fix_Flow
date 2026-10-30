
function getBookings() {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
}

function saveBookings(list) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

 
function esc(text) {
  return String(text).replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function formatDate(iso) {                        
  return new Date(iso + "T00:00").toLocaleDateString("en-GB",
    { day: "numeric", month: "short", year: "numeric" });
}

 
let dashFilter = "All";

function renderDashboard() {
  const all = getBookings();

   
  const count = status => all.filter(b => b.status === status).length;
  document.getElementById("statTotal").textContent  = all.length;
  document.getElementById("statActive").textContent = count("Pending") + count("Confirmed");
  document.getElementById("statDone").textContent   = count("Completed");
  document.getElementById("statCancel").textContent = count("Cancelled");

   
  const list = all
    .filter(b => dashFilter === "All" || b.status === dashFilter)
    .sort((a, b) => b.created.localeCompare(a.created));

  document.getElementById("emptyState").classList.toggle("d-none", list.length > 0);
  document.querySelector(".table-card").classList.toggle("d-none", list.length === 0);

  document.getElementById("bookingRows").innerHTML = list.map(b => {
    const canCancel = b.status === "Pending" || b.status === "Confirmed";
    return `
      <tr>
        <td><strong>${esc(b.id)}</strong></td>
        <td>${esc(b.service)}</td>
        <td>${formatDate(b.date)}<br><small class="text-muted">${esc(b.time)}</small></td>
        <td>${esc(b.area)}, ${esc(b.city)}</td>
        <td>${esc(b.payment)}</td>
        <td><span class="status-badge status-${b.status.toLowerCase()}">${b.status}</span></td>
        <td>${canCancel
          ? `<button class="btn btn-sm btn-outline-danger rounded-pill" data-cancel="${esc(b.id)}">Cancel</button>`
          : "-"}</td>
      </tr>`;
  }).join("");
}

 
function loadDemoBookings() {
  const day = offset => {                         
    const d = new Date(Date.now() + offset * 86400000);
    return d.toISOString().slice(0, 10);
  };
  const base = { name: "Demo Customer", phone: "0300-1234567", city: getCity(), area: CITIES[getCity()][0], address: "Demo address, Street 1", notes: "" };
  const demo = [
    { ...base, id: "FF-DEMO01", service: "AC Repair",   tech: "Imran Shah", date: day(2),   time: "Morning (9 AM - 12 PM)",  payment: "Cash on Service", status: "Pending",   created: new Date(Date.now() - 1000).toISOString() },
    { ...base, id: "FF-DEMO02", service: "Electrician", tech: "",           date: day(-5),  time: "Evening (4 PM - 8 PM)",   payment: "JazzCash",        status: "Completed", created: new Date(Date.now() - 2000).toISOString() },
    { ...base, id: "FF-DEMO03", service: "Plumber",     tech: "",           date: day(-10), time: "Afternoon (12 PM - 4 PM)", payment: "Easypaisa",       status: "Cancelled", created: new Date(Date.now() - 3000).toISOString() }
  ];
  saveBookings([...getBookings(), ...demo]);
}

 
Pages.dashboard = function () {
  dashFilter = "All";

  const session = getSession();
  const notice = document.getElementById("dashGuestNotice");
  if (notice) notice.classList.toggle("d-none", !!session);

   
  const box = document.getElementById("dashFilters");
  box.innerHTML = ["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(s =>
    `<button class="filter-btn ${s === dashFilter ? "active" : ""}" data-status="${s}">${s}</button>`).join("");

  box.addEventListener("click", e => {
    if (!e.target.dataset.status) return;
    dashFilter = e.target.dataset.status;
    box.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === e.target));
    renderDashboard();
  });

   
  document.getElementById("bookingRows").addEventListener("click", e => {
    const id = e.target.dataset.cancel;
    if (!id || !confirm("Cancel booking " + id + "?")) return;
    const list = getBookings();
    list.find(b => b.id === id).status = "Cancelled";
    saveBookings(list);
    renderDashboard();
  });

  document.getElementById("loadDemo").addEventListener("click", () => {
    loadDemoBookings();
    renderDashboard();
  });

  renderDashboard();
};
