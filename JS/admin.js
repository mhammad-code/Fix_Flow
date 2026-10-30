const TECHS_KEY = "fixflow-techs";
const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

 
function getTechs() {
  let list = JSON.parse(localStorage.getItem(TECHS_KEY) || "null");
  if (!list) {
    list = [
      { id: "T1", name: "Usman Ali",     skill: "Electrician",         city: "Lahore",     phone: "0300-8472911", rating: 4.8, active: true },
      { id: "T2", name: "Hassan Raza",   skill: "Plumber",             city: "Lahore",     phone: "0321-4458920", rating: 4.6, active: true },
      { id: "T3", name: "Imran Shah",    skill: "AC Repair",           city: "Karachi",    phone: "0333-5120938", rating: 4.7, active: true },
      { id: "T4", name: "Bilal Ahmed",   skill: "UPS and Solar",        city: "Islamabad",  phone: "0312-9901423", rating: 4.9, active: true },
      { id: "T5", name: "Rashid Minhas", skill: "Water Tank Cleaning", city: "Lahore",     phone: "0301-7712390", rating: 4.9, active: true },
      { id: "T6", name: "Kamran Khan",   skill: "Carpenter",           city: "Faisalabad", phone: "0345-6671234", rating: 4.4, active: true },
      { id: "T7", name: "Adeel Malik",   skill: "Painter",             city: "Multan",     phone: "0306-1189201", rating: 4.5, active: false }
    ];
    localStorage.setItem(TECHS_KEY, JSON.stringify(list));
  }
  return list;
}

function saveTechs(list) {
  localStorage.setItem(TECHS_KEY, JSON.stringify(list));
}

 
function renderAdmin() {
  const bookings = getBookings();
  const techs = getTechs();

   
  const done = bookings.filter(b => b.status === "Completed");
  const revenue = done.reduce((sum, b) => sum + ((SERVICES.find(s => s.name === b.service) || {}).price || 0), 0);

  const aTotal = document.getElementById("aTotal");
  const aPending = document.getElementById("aPending");
  const aDone = document.getElementById("aDone");
  const aRevenue = document.getElementById("aRevenue");

  if (aTotal) aTotal.textContent = bookings.length;
  if (aPending) aPending.textContent = bookings.filter(b => b.status === "Pending").length;
  if (aDone) aDone.textContent = done.length;
  if (aRevenue) aRevenue.textContent = revenue.toLocaleString();

   
  const activeTechs = techs.filter(t => t.active);
  const bookingsEl = document.getElementById("adminBookings");
  if (bookingsEl) {
    bookingsEl.innerHTML = bookings.length === 0
      ? '<tr><td colspan="7" class="text-center text-muted py-4">No bookings received yet.</td></tr>'
      : [...bookings].sort((a, b) => b.created.localeCompare(a.created)).map(b => {
        const assignedTech = techs.find(t => t.name === b.tech);
        return `
        <tr>
          <td><strong class="text-primary">${esc(b.id)}</strong></td>
          <td>${esc(b.name)}<br><a href="tel:${esc(b.phone)}" class="text-muted small text-decoration-none"><i class="bi bi-telephone me-1"></i>${esc(b.phone)}</a></td>
          <td><span class="service-pill">${esc(b.service)}</span></td>
          <td>${formatDate(b.date)}<br><small class="text-muted">${esc(b.time)}</small></td>
          <td>${esc(b.area)}, ${esc(b.city)}</td>
          <td>
            <select class="form-select form-select-sm" data-tech-id="${esc(b.id)}">
              <option value="">-- Unassigned --</option>
              ${activeTechs.map(t => `<option value="${esc(t.name)}" ${b.tech === t.name ? "selected" : ""}>${esc(t.name)} (${esc(t.skill)})</option>`).join("")}
            </select>
            ${assignedTech ? `<small class="text-primary d-block mt-1"><i class="bi bi-telephone-fill me-1" style="font-size:0.75rem;"></i><a href="tel:${esc(assignedTech.phone)}" class="text-primary text-decoration-none fw-semibold">${esc(assignedTech.phone)}</a></small>` : ""}
          </td>
          <td>
            <select class="form-select form-select-sm" data-status-id="${esc(b.id)}">
              ${STATUSES.map(s => `<option value="${s}" ${b.status === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </td>
        </tr>`;
      }).join("");
  }

   
  const techsEl = document.getElementById("adminTechs");
  if (techsEl) {
    techsEl.innerHTML = techs.length === 0
      ? '<tr><td colspan="8" class="text-center text-muted py-4">No technicians registered.</td></tr>'
      : techs.map(t => `
        <tr>
          <td><span class="badge bg-secondary-subtle text-secondary border font-monospace">${esc(t.id)}</span></td>
          <td><strong>${esc(t.name)}</strong></td>
          <td><a href="tel:${esc(t.phone)}" class="text-primary text-decoration-none fw-semibold"><i class="bi bi-telephone-fill me-1 small"></i>${esc(t.phone || "0300-1234567")}</a></td>
          <td><span class="service-pill">${esc(t.skill)}</span></td>
          <td>${esc(t.city)}</td>
          <td><i class="bi bi-star-fill text-warning me-1"></i>${t.rating || 4.8}</td>
          <td><span class="status-badge ${t.active ? "status-completed" : "status-cancelled"}">${t.active ? "Active" : "Suspended"}</span></td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary btn-sm" data-tech-toggle="${esc(t.id)}">
                ${t.active ? "Suspend" : "Activate"}
              </button>
              <button class="btn btn-outline-danger btn-sm" data-tech-delete="${esc(t.id)}" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>`).join("");
  }

   
  const customers = getUsers().filter(u => u.role === "customer");
  const customersEl = document.getElementById("adminCustomers");
  if (customersEl) {
    customersEl.innerHTML = customers.length === 0
      ? '<tr><td colspan="3" class="text-center text-muted py-4">No registered customers yet.</td></tr>'
      : customers.map(u => `
        <tr>
          <td><strong>${esc(u.name)}</strong></td>
          <td>${esc(u.email)}</td>
          <td>${esc(u.phone || "N/A")}</td>
        </tr>`).join("");
  }

   
  const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
  const msgsEl = document.getElementById("adminMessages");
  if (msgsEl) {
    msgsEl.innerHTML = messages.length === 0
      ? '<p class="text-center text-muted py-4">No messages received yet.</p>'
      : [...messages].reverse().map(m => `
        <div class="stat-box text-start mb-3">
          <p class="fw-bold mb-1">${esc(m.name)} <small class="text-muted">&lt;${esc(m.email)}&gt;</small></p>
          <p class="small text-muted mb-2">${new Date(m.date).toLocaleString("en-GB")}</p>
          <p class="mb-0">${esc(m.message)}</p>
        </div>`).join("");
  }
}

 
Pages.admin = function () {
  const s = getSession();
  const isAdmin = s && s.role === "admin";

  const adminLocked = document.getElementById("adminLocked");
  const adminPanel = document.getElementById("adminPanel");
  if (adminLocked) adminLocked.classList.toggle("d-none", isAdmin);
  if (adminPanel) adminPanel.classList.toggle("d-none", !isAdmin);

  if (!isAdmin) return;

   
  const adminThemeBtn = document.getElementById("adminThemeToggle");
  if (adminThemeBtn) {
    const isDark = document.body.classList.contains("dark");
    adminThemeBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    adminThemeBtn.onclick = () => {
      if (window.toggleTheme) window.toggleTheme();
    };
  }

   
  const viewSiteBtn = document.getElementById("adminViewSiteBtn");
  if (viewSiteBtn) {
    viewSiteBtn.onclick = () => {
      document.body.classList.remove("admin-mode");
      localStorage.removeItem(SESSION_KEY);
      if (window.updateAuthUI) updateAuthUI();
      location.hash = "#/";
    };
  }

   
  const logoutBtn = document.getElementById("adminPortalLogoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem(SESSION_KEY);
      document.body.classList.remove("admin-mode");
      if (window.updateAuthUI) updateAuthUI();
      location.hash = "#/";
    };
  }

   
  const toggleBtn = document.getElementById("toggleAddTechBtn");
  const cancelBtn = document.getElementById("cancelAddTechBtn");
  const addCard = document.getElementById("addTechCard");
  const addForm = document.getElementById("addTechForm");

  if (toggleBtn) toggleBtn.onclick = () => addCard.classList.toggle("d-none");
  if (cancelBtn) cancelBtn.onclick = () => addCard.classList.add("d-none");

   
  if (addForm) {
    addForm.onsubmit = e => {
      e.preventDefault();
      const name = document.getElementById("techName").value.trim();
      const skill = document.getElementById("techSkill").value;
      const city = document.getElementById("techCity").value;
      const phone = document.getElementById("techPhone").value.trim() || "0300-1234567";
      const rating = parseFloat(document.getElementById("techRating").value) || 4.8;

      if (!name) return;

      const techs = getTechs();
      techs.unshift({
        id: "T" + (Date.now().toString().slice(-4)),
        name,
        skill,
        city,
        phone,
        rating,
        active: true
      });

      saveTechs(techs);
      addForm.reset();
      addCard.classList.add("d-none");
      renderAdmin();
    };
  }

   
  const panel = document.getElementById("adminPanel");
  if (panel) {
    panel.onchange = e => {
      const list = getBookings();
      if (e.target.dataset.statusId) {
        const item = list.find(b => b.id === e.target.dataset.statusId);
        if (item) item.status = e.target.value;
      } else if (e.target.dataset.techId) {
        const item = list.find(b => b.id === e.target.dataset.techId);
        if (item) item.tech = e.target.value;
      } else {
        return;
      }
      saveBookings(list);
      renderAdmin();
    };

     
    panel.onclick = e => {
      const toggleId = e.target.closest("[data-tech-toggle]")?.dataset.techToggle;
      if (toggleId) {
        const techs = getTechs();
        const t = techs.find(x => x.id === toggleId);
        if (t) {
          t.active = !t.active;
          saveTechs(techs);
          renderAdmin();
        }
        return;
      }

      const deleteId = e.target.closest("[data-tech-delete]")?.dataset.techDelete;
      if (deleteId) {
        if (confirm("Delete this technician?")) {
          const techs = getTechs().filter(x => x.id !== deleteId);
          saveTechs(techs);
          renderAdmin();
        }
        return;
      }
    };
  }

  const demoBtn = document.getElementById("adminDemo");
  if (demoBtn) demoBtn.onclick = () => { loadDemoBookings(); renderAdmin(); };

  renderAdmin();
};
