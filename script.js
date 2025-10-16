const SHEET_ID = '1gcKHjPRnHREzSIvIQbT7Gq2n7iLjPJHO1_zLOK70JQU';
const SHEET_RANGE = 'Sheet1!A2:O';
const API_KEY = 'AIzaSyD11rViAA48UbgreiZli__U4fWSss1d9tU';

const categories = [
  "UI/UX",
  "Product",
  "Branding",
  "Interaction Design",
  "Visual Design",
  "Service Design",
  "Industrial Design"
];

let companies = [];
let filteredCompanies = [];
let activeCategory = null;

function parseCitiesVerticals(text) {
  if (!text) return [];
  return text.split(',').map(item => {
    const [city, vertical] = item.split(':').map(s => s.trim());
    return { city, vertical };
  });
}

function fetchCompaniesFromSheet() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.values) {
        alert('No data found in the Google Sheet.');
        return [];
      }
      return data.values.map(row => ({
        name: row[0],
        website: row[1],
        cities: parseCitiesVerticals(row[2]),
        sector: row[3] || '',
        category: row[4] || '',
        contactType: row[5] || '',
        hr: {
          name: row[6] || '',
          designation: row[7] || '',
          email: row[8] || '',
          mobile: row[9] || '',
          location: row[10] || ''
        },
        designHead: {
          name: row[11] || '',
          designation: row[12] || '',
          email: row[13] || '',
          mobile: row[14] || '',
          location: row[15] || ''
        }
      }));
    });
}

function renderCategoryFilters() {
  const container = document.getElementById('category-filters');
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.textContent = 'All';
  allBtn.className = activeCategory === null ? 'pill-btn accent' : 'pill-btn';
  allBtn.onclick = () => {
    if (activeCategory === null) {
      // Deselect All if clicked again
      activeCategory = null;
      filteredCompanies = companies;
    } else {
      activeCategory = null;
      filteredCompanies = companies;
    }
    renderCategoryFilters();
    renderCompanies();
  };
  container.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = activeCategory === cat ? 'pill-btn accent' : 'pill-btn';
    btn.onclick = () => {
      if (activeCategory === cat) {
        // Toggle off filter if same filter clicked
        activeCategory = null;
        filteredCompanies = companies;
      } else {
        activeCategory = cat;
        filteredCompanies = companies.filter(c => c.category === cat);
      }
      renderCategoryFilters();
      renderCompanies();
    };
    container.appendChild(btn);
  });
}

function renderCompanies() {
  const dataToDisplay = filteredCompanies.length || activeCategory !== null ? filteredCompanies : companies;
  let html = `<table>
    <thead>
      <tr>
        <th>#</th>
        <th>Company</th>
        <th>Website</th>
        <th>Cities & Verticals</th>
        <th>Sector</th>
        <th>Category</th>
        <th>Type</th>
        <th>Design Head</th>
      </tr>
    </thead>
    <tbody>`;

  dataToDisplay.forEach((c, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${c.name}</td>
      <td><a href="${c.website}" target="_blank" rel="noopener noreferrer">${c.website.replace(/^https?:\/\//, '')}</a></td>
      <td>${c.cities.map(cv => `${cv.city} (${cv.vertical})`).join(', ')}</td>
      <td>${c.sector}</td>
      <td>${c.category}</td>
      <td>${c.contactType}</td>
      <td>${c.designHead.name}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('company-list').innerHTML = html;
}

// Day/Night mode toggle
const modeToggle = document.getElementById('mode-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

modeToggle.addEventListener('click', () => {
  const body = document.body;
  const isDay = body.classList.contains('day-mode');
  if (isDay) {
    body.classList.remove('day-mode');
    body.classList.add('night-mode');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'inline';
  } else {
    body.classList.remove('night-mode');
    body.classList.add('day-mode');
    sunIcon.style.display = 'inline';
    moonIcon.style.display = 'none';
  }
});

if (document.body.classList.contains('night-mode')) {
  sunIcon.style.display = 'none';
  moonIcon.style.display = 'inline';
} else {
  sunIcon.style.display = 'inline';
  moonIcon.style.display = 'none';
}

function initDashboard() {
  fetchCompaniesFromSheet()
    .then(data => {
      companies = data;
      filteredCompanies = data;
      activeCategory = null;
      renderCategoryFilters();
      renderCompanies();
    })
    .catch(err => alert('Failed to load companies from Google Sheets: ' + err.message));
}

initDashboard();
