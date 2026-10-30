const routes = {
  "/": "home",
  "/services": "services",
  "/booking": "booking",
  "/login": "login",
  "/dashboard": "dashboard",
  "/contact": "contact",
  "/admin": "admin"
};

 
const titles = {
  home: "Home", services: "Services", booking: "Book a Service",
  login: "Login / Register", dashboard: "My Bookings",
  contact: "Contact", admin: "Admin Panel", "404": "Page not found"
};



window.Pages = {};

const app = document.getElementById("app");



function getRoute() {
  const [path, query] = (location.hash.slice(1) || "/").split("?");
  return { path, params: new URLSearchParams(query || "") };
}

 
window.Router = { params: () => getRoute().params };

 
async function loadView() {
  const { path } = getRoute();
  const name = routes[path] || "404";

  app.innerHTML = '<div class="view-loader"><div class="spinner-border text-primary"></div></div>';

  try {
    const res = await fetch("views/" + name + ".html");
    if (!res.ok) throw new Error("View file not found");
    app.innerHTML = await res.text();
  } catch (err) {
    app.innerHTML =
      '<div class="not-found container"><h2>Could not load this page</h2>' +
      '<p class="text-muted">Run the project with Live Server and check that views/' + name + '.html exists.</p>' +
      '<a href="#/" class="btn btn-fix">Go Home</a></div>';
  }

   
  app.classList.remove("view-enter");    
  void app.offsetWidth;
  app.classList.add("view-enter");

  window.scrollTo(0, 0);                               
  document.title = (titles[name] || "FixFlow") + " | FixFlow";

  document.querySelectorAll(".navbar-fix .nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + path);
  });

  const menu = document.getElementById("menu");        
  if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();

  const s = window.getSession ? getSession() : null;
  const isAdminView = path === "/admin" && s && s.role === "admin";
  document.body.classList.toggle("admin-mode", isAdminView);

  if (Pages[name]) Pages[name]();                      
  initPage();                                          
  if (window.updateAuthUI) updateAuthUI();             
}

 
window.addEventListener("hashchange", loadView);




window.addEventListener("load", loadView);
