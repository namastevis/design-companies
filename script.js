const DEMO_USER = { username: "admin", password: "password123" };

let isLoggedIn = false;
let companies = [];
let filteredCompanies = [];
let editIndex = null;

function getCompanies() {
  const data = localStorage.getItem("companies");
  if (data) return JSON.parse(data);
  return [
    {
      name: "DesignWorks",
      website: "https://designworks.com",
      cities: [
        { city: "Mumbai", vertical: "Product" },
        { city: "Delhi", vertical: "UI/UX" }
      ],
      sector: "FMCG",
      category: "Product",
      hr: {
        name: "R Kamat",
        designation: "HR Head",
        email: "rkamat@dw.com",
        mobile: "1111111111",
        location: "Mumbai"
      },
      designHead: {
        name: "A Desai",
        designation: "Chief Designer",
        email: "adesai@dw.com",
        mobile: "2222222222",
        location: "Delhi"
      }
    }
  ];
}

function saveCompanies(companies) {
  localStorage.setItem("companies", JSON.stringify(companies));
}

function renderCompanies() {
  const dataToDisplay = filteredCompanies.length ? filteredCompanies : companies;
  let html = `<table>
    <thead>
      <tr>
        <th>#</th>
        <th>Company</th>
        <th>Website</th>
        <th>Cities & Verticals</th>
        <th>Sector</th>
        <th>Design Category</th>
        ${isLoggedIn ? "<th>HR Contact</th><th>Design Head</th><th>Edit</th>" : ""}
      </tr>
    </thead>
    <tbody>`;
  dataToDisplay.forEach((c, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${c.name}</td>
      <td><a href="${c.website}" target="_blank" rel="noopener noreferrer">${c.website.replace(/^https?:\/\//, "")}</a></td>
      <td>${c.cities.map(cv => `${cv.city} (${cv.vertical})`).join(", ")}</td>
      <td>${c.sector}</td>
      <td>${c.category}</td>`;
    if (isLoggedIn) {
      html += `<td>
        <strong>${c.hr.name}</strong><br />
        ${c.hr.designation}<br />
        <a href="mailto:${c.hr.email}">${c.hr.email}</a><br />
        ${c.hr.mobile}<br />
        ${c.hr.location}
      </td>
      <td>
        <strong>${c.designHead.name}</strong><br />
        ${c.designHead.designation}<br />
        <a href="mailto:${c.designHead.email}">${c.designHead.email}</a><br />
        ${c.designHead.mobile}<br />
        ${c.designHead.location}
      </td>
      <td>
        <button class="pill-btn edit-btn" onclick="startEdit(${findCompanyIndex(i)})">Edit</button>
      </td>`;
    }
    html += "</tr>";
  });
  html += "</tbody></table>";
  document.getElementById("company-list").innerHTML = html;
  document.getElementById("add-company-section").style.display = isLoggedIn ? "block" : "none";
}

window.startEdit = function(index) {
  editIndex = index;
  document.getElementById("form-title").textContent = "Edit Company";
  document.getElementById("submit-btn").textContent = "Save Changes";
  document.getElementById("cancel-edit-btn").style.display = "inline";
  const c = companies[index];
  document.getElementById("company-name").value = c.name;
  document.getElementById("company-website").value = c.website;
  document.getElementById("company-cities").value = c.cities.map(cv => `${cv.city}:${cv.vertical}`).join(", ");
  document.getElementById("company-sector").value = c.sector;
  document.getElementById("company-category").value = c.category;
  document.getElementById("hr-name").value = c.hr.name;
  document.getElementById("hr-designation").value = c.hr.designation;
  document.getElementById("hr-email").value = c.hr.email;
  document.getElementById("hr-mobile").value = c.hr.mobile;
  document.getElementById("hr-location").value = c.hr.location;
  document.getElementById("dh-name").value = c.designHead.name;
  document.getElementById("dh-designation").value = c.designHead.designation;
  document.getElementById("dh-email").value = c.designHead.email;
  document.getElementById("dh-mobile").value = c.designHead.mobile;
  document.getElementById("dh-location").value = c.designHead.location;
}

function findCompanyIndex(displayIndex) {
  if (filteredCompanies.length) {
    const name = filteredCompanies[displayIndex].name;
    return companies.findIndex(c => c.name === name);
  } else {
    return displayIndex;
  }
}

document.getElementById("cancel-edit-btn").onclick = () => {
  editIndex = null;
  document.getElementById("add-company-form").reset();
  document.getElementById("form-title").textContent = "Add Company";
  document.getElementById("submit-btn").textContent = "Add Company";
  document.getElementById("cancel-edit-btn").style.display = "none";
};

document.getElementById("add-company-form").onsubmit = function(e) {
  e.preventDefault();
  const updatedCompany = {
    name: document.getElementById("company-name").value,
    website: document.getElementById("company-website").value,
    cities: document.getElementById("company-cities").value.split(",").map((item) => {
      let [city, vertical] = item.split(":").map((v) => v.trim());
      return { city, vertical };
    }),
    sector: document.getElementById("company-sector").value,
    category: document.getElementById("company-category").value,
    hr: {
      name: document.getElementById("hr-name").value,
      designation: document.getElementById("hr-designation").value,
      email: document.getElementById("hr-email").value,
      mobile: document.getElementById("hr-mobile").value,
      location: document.getElementById("hr-location").value
    },
    designHead: {
      name: document.getElementById("dh-name").value,
      designation: document.getElementById("dh-designation").value,
      email: document.getElementById("dh-email").value,
      mobile: document.getElementById("dh-mobile").value,
      location: document.getElementById("dh-location").value
    }
  };
  if (editIndex !== null) {
    companies[editIndex] = updatedCompany;
    editIndex = null;
    document.getElementById("form-title").textContent = "Add Company";
    document.getElementById("submit-btn").textContent = "Add Company";
    document.getElementById("cancel-edit-btn").style.display = "none";
  } else {
    companies.push(updatedCompany);
  }
  saveCompanies(companies);
  filteredCompanies = [];
  document.getElementById("add-company-form").reset();
  renderCompanies();
};

const modeToggle = document.getElementById("mode-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

modeToggle.addEventListener("click", () => {
  const body = document.body;
  const isDay = body.classList.contains("day-mode");
  if (isDay) {
    body.classList.remove("day-mode");
    body.classList.add("night-mode");
    sunIcon.style.display = "none";
    moonIcon.style.display = "inline";
  } else {
    body.classList.remove("night-mode");
    body.classList.add("day-mode");
    sunIcon.style.display = "inline";
    moonIcon.style.display = "none";
  }
});
if (document.body.classList.contains("night-mode")) {
  sunIcon.style.display = "none";
  moonIcon.style.display = "inline";
} else {
  sunIcon.style.display = "inline";
  moonIcon.style.display = "none";
}

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", () => {
  const query = searchBar.value.trim().toLowerCase();
  if (!query) {
    filteredCompanies = [];
    renderCompanies();
    return;
  }
  filteredCompanies = companies.filter((c) => {
    const searchableFields = [
      c.name.toLowerCase(),
      c.sector.toLowerCase(),
      c.category.toLowerCase(),
      (c.cities || []).map(cv => `${cv.city.toLowerCase()} ${cv.vertical.toLowerCase()}`).join(" ")
    ].join(" ");
    return searchableFields.includes(query);
  });
  renderCompanies();
});

document.getElementById("login-btn").onclick = () => {
  const modal = document.getElementById("login-modal");
  modal.setAttribute("aria-hidden", "false");
  modal.style.display = "flex";
  document.getElementById("username").focus();
};
document.getElementById("close-login").onclick = () => {
  const modal = document.getElementById("login-modal");
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
};
document.getElementById("login-form").onsubmit = (e) => {
  e.preventDefault();
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value;
  if (u === DEMO_USER.username && p === DEMO_USER.password) {
    isLoggedIn = true;
    companies = getCompanies();
    document.getElementById("login-modal").setAttribute("aria-hidden", "true");
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline";
    filteredCompanies = [];
    searchBar.value = "";
    renderCompanies();
  } else {
    alert("Login failed: Invalid username or password.");
  }
};
document.getElementById("logout-btn").onclick = () => {
  isLoggedIn = false;
  companies = getCompanies();
  filteredCompanies = [];
  searchBar.value = "";
  document.getElementById("login-btn").style.display = "inline";
  document.getElementById("logout-btn").style.display = "none";
  renderCompanies();
};

companies = getCompanies();
renderCompanies();
