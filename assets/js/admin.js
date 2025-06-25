// Use Firebase CDN globals, not ES6 imports, for static HTML usage
// Remove all import statements

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJ2R5HazFELOn0Dla5d2Hevz7O-HrFiac",
  authDomain: "plotperfectadmin.firebaseapp.com",
  databaseURL: "https://plotperfectadmin-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "plotperfectadmin",
  storageBucket: "plotperfectadmin.firebasestorage.app",
  messagingSenderId: "618282091546",
  appId: "1:618282091546:web:e1583406403c97b1bcbda3",
  measurementId: "G-N6RYXJW2HQ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Add Firebase Database
const database = firebase.database();

const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('admin-dashboard');
const loginError = document.getElementById('login-error');

// Autofill username in login form if email is entered and user exists
const emailInput = document.getElementById('email');
if (emailInput) {
  emailInput.addEventListener('blur', function() {
    const email = emailInput.value.trim();
    if (!email) return;
    // Try to find the user by email (requires admin privileges, so workaround: after login, fetch username)
    // Instead, after successful login, always fetch and autofill username
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const usernameInput = document.getElementById('username');
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Fetch username from database and update dashboard and login form
        const user = userCredential.user;
        if (user) {
          database.ref('users/' + user.uid + '/profile/username').once('value').then(snapshot => {
            const dbUsername = snapshot.val();
            if (dbUsername) {
              // Fill username in dashboard and login form
              if (usernameInput) usernameInput.value = dbUsername;
              const welcomeMsg = document.querySelector('.admin-dashboard-welcome');
              if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${dbUsername}!`;
            }
          });
          // Save username to database if changed
          if (user && usernameInput) {
            database.ref('users/' + user.uid + '/profile/username').once('value').then(snapshot => {
              const dbUsername = snapshot.val();
              if (dbUsername !== usernameInput.value) {
                database.ref('users/' + user.uid + '/profile').set({
                  username: usernameInput.value,
                  email: email
                });
              }
            });
          }
        }
        loginContainer.style.display = 'none';
        dashboard.style.display = 'block';
      })
      .catch(error => {
        loginError.textContent = error.message;
      });
  });
}

// --- CLIENT SPREADSHEET FUNCTIONALITY ---
const clientTableHTML = `
  <div class="admin-client-section">
    <h3 class="admin-client-title">Client List</h3>
    <form id="add-client-form" class="admin-client-form">
      <input type="text" id="client-company" placeholder="Company Name" required />
      <input type="text" id="client-contact" placeholder="Contact Name" required />
      <input type="text" id="client-website" placeholder="Website" required />
      <input type="date" id="client-date" placeholder="Date Joined" required />
      <select id="client-status" required>
        <option value="in-Progress" selected>In-Progress</option>
        <option value="Test Stage">Test Stage</option>
        <option value="Complete">Complete</option>
      </select>
      <button type="submit">Add Client</button>
    </form>
    <div class="admin-client-table-wrapper">
      <table id="client-table" class="admin-client-table">
        <thead>
          <tr id="client-table-header-row">
            <th draggable="true" data-col="company">Company<br><input type="text" class="admin-client-filter" data-filter="company" placeholder="Filter" /></th>
            <th draggable="true" data-col="contact">Contact<br><input type="text" class="admin-client-filter" data-filter="contact" placeholder="Filter" /></th>
            <th draggable="true" data-col="website">Website<br><input type="text" class="admin-client-filter" data-filter="website" placeholder="Filter" /></th>
            <th draggable="true" data-col="date">Date Joined<br><input type="date" class="admin-client-filter" data-filter="date" placeholder="Filter" /></th>
            <th draggable="true" data-col="status">Status<br><input type="text" class="admin-client-filter" data-filter="status" placeholder="Filter" /></th>
          </tr>
        </thead>
        <tbody id="client-table-body"></tbody>
      </table>
    </div>
  </div>
`;

// Insert client list into dashboard
function renderClientSection() {
  if (!document.querySelector('.admin-client-section')) {
    dashboard.insertAdjacentHTML('beforeend', clientTableHTML);
    setupClientTableHandlers();
    fetchAndRenderClientsTable();
  }
}

// Add client to Firebase
function addClientToFirebase(company, contact, website, date, status) {
  const newClientRef = database.ref('Clients').push();
  return newClientRef.set({
    company,
    contact,
    website,
    date,
    status
  });
}

// Fetch and render clients
function fetchAndRenderClientsTable() {
  database.ref('Clients').on('value', snapshot => {
    const clients = snapshot.val() || {};
    renderClientTable(Object.entries(clients).map(([id, data]) => ({ id, ...data })));
  });
}

// Render client list with filter and drag/drop
function renderClientTable(clients) {
  const tbody = document.getElementById('client-table-body');
  if (!tbody) return;
  const filters = getClientTableFilters();
  tbody.innerHTML = '';
  clients
    .filter(c =>
      c.company.toLowerCase().includes(filters.company) &&
      c.contact.toLowerCase().includes(filters.contact) &&
      c.website.toLowerCase().includes(filters.website) &&
      (!filters.date || (c.date && c.date.startsWith(filters.date))) &&
      (!filters.status || (c.status && c.status.toLowerCase().includes(filters.status)))
    )
    .forEach(client => {
      const tr = document.createElement('tr');
      tr.className = 'admin-client-row';
      tr.draggable = true;
      tr.dataset.id = client.id;
      // Ensure website has protocol
      let websiteUrl = client.website || '';
      if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
        websiteUrl = 'https://' + websiteUrl;
      }
      // Status coloring
      let statusColor = '#f1c40f';
      let statusText = 'In-Progress';
      if (client.status === 'Test Stage') {
        statusColor = '#3498db';
        statusText = 'Test Stage';
      } else if (client.status === 'Complete') {
        statusColor = '#2ecc71';
        statusText = 'Complete';
      } else if (client.status && client.status.toLowerCase().includes('progress')) {
        statusColor = '#f1c40f';
        statusText = 'In-Progress';
      }
      tr.innerHTML = `
        <td class="admin-client-company">${client.company}</td>
        <td class="admin-client-contact">${client.contact}</td>
        <td class="admin-client-website"><a href="${websiteUrl}" target="_blank" rel="noopener noreferrer">${client.website}</a></td>
        <td class="admin-client-date">${client.date || ''}</td>
        <td class="admin-client-status">
          <select class="admin-client-status-dropdown" data-id="${client.id}" style="background:${statusColor};color:#fff;padding:4px 12px;border-radius:6px;font-weight:700;">
            <option value="in-Progress" ${statusText==='In-Progress'?'selected':''}>In-Progress</option>
            <option value="Test Stage" ${statusText==='Test Stage'?'selected':''}>Test Stage</option>
            <option value="Complete" ${statusText==='Complete'?'selected':''}>Complete</option>
          </select>
        </td>
        <td class="admin-client-delete"><button class="admin-client-delete-btn" data-id="${client.id}" title="Delete Client">&times;</button></td>
      `;
      tbody.appendChild(tr);
    });
  setupTableRowDragAndDrop();
  setupDeleteClientHandlers();
  setupResizableColumns();
  setupStatusDropdownHandlers();
}

// Handle status dropdown changes in table
function setupStatusDropdownHandlers() {
  document.querySelectorAll('.admin-client-status-dropdown').forEach(dropdown => {
    dropdown.onchange = function() {
      const clientId = this.getAttribute('data-id');
      const newStatus = this.value;
      let statusColor = '#f1c40f';
      if (newStatus === 'Test Stage') statusColor = '#3498db';
      else if (newStatus === 'Complete') statusColor = '#2ecc71';
      else if (newStatus && newStatus.toLowerCase().includes('progress')) statusColor = '#f1c40f';
      this.style.background = statusColor;
      this.style.color = '#fff';
      database.ref('Clients/' + clientId + '/status').set(newStatus);
    };
  });
}

// Add resizer handles to each th and enable resizing
function setupResizableColumns() {
  const table = document.getElementById('client-table');
  if (!table) return;
  const ths = table.querySelectorAll('th');
  ths.forEach((th, i) => {
    // Remove existing resizer if any
    const oldResizer = th.querySelector('.col-resizer');
    if (oldResizer) oldResizer.remove();
    // Don't add resizer to last column (delete button)
    if (i === ths.length - 1) return;
    const resizer = document.createElement('div');
    resizer.className = 'col-resizer';
    th.appendChild(resizer);
    let startX, startWidth;
    resizer.addEventListener('mousedown', function(e) {
      startX = e.pageX;
      startWidth = th.offsetWidth;
      document.body.style.cursor = 'col-resize';
      function onMouseMove(e2) {
        const newWidth = Math.max(60, startWidth + (e2.pageX - startX));
        th.style.width = newWidth + 'px';
        // Set all tds in this column
        const idx = th.cellIndex;
        table.querySelectorAll('tr').forEach(row => {
          if (row.cells[idx]) row.cells[idx].style.width = newWidth + 'px';
        });
      }
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
}

// Add delete button event listeners
function setupDeleteClientHandlers() {
  document.querySelectorAll('.admin-client-delete-btn').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const clientId = this.getAttribute('data-id');
      if (clientId && confirm('Are you sure you want to delete this client?')) {
        database.ref('Clients/' + clientId).remove();
      }
    };
  });
}

function getClientTableFilters() {
  const filters = { company: '', contact: '', website: '', date: '', status: '' };
  document.querySelectorAll('.admin-client-filter').forEach(input => {
    const col = input.getAttribute('data-filter');
    filters[col] = input.value.toLowerCase();
  });
  return filters;
}

// Setup add, filter, and drag/drop handlers
function setupClientTableHandlers() {
  document.getElementById('add-client-form').onsubmit = function(e) {
    e.preventDefault();
    const company = document.getElementById('client-company').value.trim();
    const contact = document.getElementById('client-contact').value.trim();
    const website = document.getElementById('client-website').value.trim();
    const date = document.getElementById('client-date').value;
    const status = document.getElementById('client-status').value;
    if (company && contact && website && date && status) {
      addClientToFirebase(company, contact, website, date, status).then(() => {
        this.reset();
      });
    }
  };
  document.querySelectorAll('.admin-client-filter').forEach(input => {
    input.oninput = fetchAndRenderClientsTable;
  });
  setupTableColumnDragAndDrop();
}

// Drag and drop for table rows (local only)
function setupTableRowDragAndDrop() {
  const tbody = document.getElementById('client-table-body');
  let dragSrcRow = null;
  tbody.querySelectorAll('tr').forEach(row => {
    row.ondragstart = function(e) {
      dragSrcRow = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.outerHTML);
      this.classList.add('dragElem');
    };
    row.ondragover = function(e) {
      e.preventDefault();
      this.classList.add('over');
      return false;
    };
    row.ondragleave = function() {
      this.classList.remove('over');
    };
    row.ondrop = function(e) {
      e.stopPropagation();
      if (dragSrcRow !== this) {
        this.parentNode.removeChild(dragSrcRow);
        this.insertAdjacentHTML('beforebegin', e.dataTransfer.getData('text/html'));
        setupTableRowDragAndDrop();
      }
      this.classList.remove('over');
      return false;
    };
    row.ondragend = function() {
      this.classList.remove('over');
      this.classList.remove('dragElem');
    };
  });
}

// Drag and drop for table columns (local only)
function setupTableColumnDragAndDrop() {
  const headerRow = document.getElementById('client-table-header-row');
  let dragSrcTh = null;
  headerRow.querySelectorAll('th').forEach(th => {
    th.ondragstart = function(e) {
      dragSrcTh = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', th.cellIndex);
      this.classList.add('dragElem');
    };
    th.ondragover = function(e) {
      e.preventDefault();
      this.classList.add('over');
      return false;
    };
    th.ondragleave = function() {
      this.classList.remove('over');
    };
    th.ondrop = function(e) {
      e.stopPropagation();
      const from = parseInt(e.dataTransfer.getData('text/plain'));
      const to = this.cellIndex;
      if (from !== to) {
        moveTableColumn(from, to);
      }
      this.classList.remove('over');
      return false;
    };
    th.ondragend = function() {
      this.classList.remove('over');
      this.classList.remove('dragElem');
    };
  });
}

function moveTableColumn(from, to) {
  const table = document.getElementById('client-table');
  for (let row of table.rows) {
    if (to < from) {
      row.insertBefore(row.cells[from], row.cells[to]);
    } else {
      row.insertBefore(row.cells[from], row.cells[to].nextSibling);
    }
  }
}

// Show username in dashboard after login
function showDashboardUsername(user) {
  if (!user) return;
  database.ref('users/' + user.uid + '/profile/username').once('value').then(snapshot => {
    const dbUsername = snapshot.val();
    const welcomeMsg = document.querySelector('.admin-dashboard-welcome');
    if (welcomeMsg) {
      welcomeMsg.textContent = dbUsername ? `Welcome, ${dbUsername}!` : 'Welcome to your Business Assistant';
    }
    renderClientSection();
  });
}

// Add logout button logic
function showLogoutButton() {
  let logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) {
    logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'admin-logout-btn';
    logoutBtn.style.position = 'fixed';
    logoutBtn.style.top = '20px';
    logoutBtn.style.right = '30px';
    dashboard.appendChild(logoutBtn);
  }
  logoutBtn.style.display = 'inline-block';
  logoutBtn.onclick = function() {
    auth.signOut().then(() => {
      dashboard.style.display = 'none';
      loginContainer.style.display = 'block';
      logoutBtn.style.display = 'none';
      loginForm.reset();
    });
  };
}

auth.onAuthStateChanged(user => {
  if (user) {
    if (loginContainer) loginContainer.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    showLogoutButton();
    showDashboardUsername(user);
  } else {
    if (dashboard) dashboard.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'block';
    let logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    // Optionally clear the username field on logout
    const usernameInput = document.getElementById('username');
    if (usernameInput) usernameInput.value = '';
    // Reset welcome message
    const welcomeMsg = document.querySelector('.admin-dashboard-welcome');
    if (welcomeMsg) welcomeMsg.textContent = 'Welcome to your Business Assistant';
  }
});
