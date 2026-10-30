
const SERVICES = [
  { name: "Electrician",         cat: "Electrical",        price: 800,  img: "electrician", icon: "bi-lightning-charge-fill", desc: "Wiring, switches, fans, short circuits" },
  { name: "UPS and Solar",       cat: "Electrical",        price: 2000, img: "ups-solar",   icon: "bi-sun-fill",              desc: "UPS, inverter and solar panels" },
  { name: "CCTV Installation",   cat: "Electrical",        price: 3000, img: "cctv",        icon: "bi-camera-video-fill",     desc: "Cameras, DVR and mobile viewing" },
  { name: "Plumber",             cat: "Plumbing",          price: 700,  img: "plumber",     icon: "bi-droplet-half",          desc: "Leaks, taps, pipes and drains" },
  { name: "Geyser Repair",       cat: "Plumbing",          price: 1200, img: "geyser",      icon: "bi-fire",                  desc: "Gas and electric geyser repair" },
  { name: "Water Tank Cleaning", cat: "Cleaning",          price: 2500, img: "water-tank",  icon: "bi-water",                 desc: "Deep clean of overhead tanks" },
  { name: "Home Cleaning",       cat: "Cleaning",          price: 2500, img: "cleaning",    icon: "bi-stars",                 desc: "Full home and office cleaning" },
  { name: "AC Repair",           cat: "AC and Cooling",    price: 1500, img: "ac-repair",   icon: "bi-snow",                  desc: "Service, gas fill and installation" },
  { name: "Carpenter",           cat: "Carpentry & Paint", price: 1000, img: "carpenter",   icon: "bi-hammer",                desc: "Doors, furniture and fittings" },
  { name: "Painter",             cat: "Carpentry & Paint", price: 1500, img: "painter",     icon: "bi-paint-bucket",          desc: "Interior and exterior painting" }
];

 
let activeCategory = "All";
let searchText = "";

 
function render() {
  const grid = document.getElementById("serviceGrid");

   
  const list = SERVICES.filter(s =>
    (activeCategory === "All" || s.cat === activeCategory) &&
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  document.getElementById("resultCount").textContent = list.length + " service(s) found";

  if (list.length === 0) {
    grid.innerHTML = '<p class="text-center text-muted py-5">No service found. Try another word.</p>';
    return;
  }

   
  grid.innerHTML = list.map(s => `
    <div class="col-12 col-sm-6 col-lg-4">
      <a href="#/booking?service=${encodeURIComponent(s.name)}" class="photo-card">
        <img src="images/${s.img}.jpg" alt="${s.name}" loading="lazy" onerror="imgFallback(this)">
        <span class="badge-icon"><i class="bi ${s.icon}"></i></span>
        <div class="info">
          <h5>${s.name.replace("and", "&")}</h5>
          <p class="desc">${s.desc}</p>
          <p class="price">From Rs. ${s.price.toLocaleString()}</p>
        </div>
      </a>
    </div>`).join("");
}

 
Pages.services = function () {
   
  const cats = ["All", ...new Set(SERVICES.map(s => s.cat))];
  const box = document.getElementById("filters");
  box.innerHTML = cats.map(c =>
    `<button class="filter-btn ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");

   
  box.addEventListener("click", e => {
    if (!e.target.dataset.cat) return;
    activeCategory = e.target.dataset.cat;
    box.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === e.target));
    render();
  });

   
  document.getElementById("searchBox").addEventListener("input", e => {
    searchText = e.target.value;
    render();
  });

  render();
};
