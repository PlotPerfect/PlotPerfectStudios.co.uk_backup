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
  appId: "1:618282091546:web:e158340640403c97b1bcbda3",
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

// Store Google OAuth access token after sign-in
let googleOAuthAccessToken = null;

// Google Sign-In button logic (with GA4 scope)
const googleSignInBtn = document.getElementById('google-signin-btn');
const googleLoginError = document.getElementById('google-login-error');
if (googleSignInBtn) {
  googleSignInBtn.onclick = async function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/analytics.readonly');
    try {
      const result = await auth.signInWithPopup(provider);
      // Extract and store the Google OAuth access token
      if (result.credential && result.credential.accessToken) {
        googleOAuthAccessToken = result.credential.accessToken;
        sessionStorage.setItem('googleOAuthAccessToken', googleOAuthAccessToken);
      }
      // User signed in, UI will update via onAuthStateChanged
    } catch (error) {
      if (googleLoginError) googleLoginError.textContent = 'Google login failed: ' + error.message;
    }
  };
}

// Add a Connect Google Analytics button if access token is missing
function showAnalyticsSection() {
  const analyticsSection = document.getElementById('ga4-analytics-section');
  const resultDiv = document.getElementById('ga4-analytics-result');
  if (analyticsSection) {
    analyticsSection.style.display = 'block';
    let finalToken = googleOAuthAccessToken || sessionStorage.getItem('googleOAuthAccessToken');
    if (!finalToken) {
      // Show a connect button if not already present
      if (!document.getElementById('connect-ga-btn')) {
        const connectBtn = document.createElement('button');
        connectBtn.id = 'connect-ga-btn';
        connectBtn.textContent = 'Connect Google Analytics';
        connectBtn.style.margin = '16px auto';
        connectBtn.onclick = async function() {
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/analytics.readonly');
          try {
            const result = await auth.signInWithPopup(provider);
            if (result.credential && result.credential.accessToken) {
              googleOAuthAccessToken = result.credential.accessToken;
              sessionStorage.setItem('googleOAuthAccessToken', googleOAuthAccessToken);
              if (resultDiv) resultDiv.textContent = '';
              connectBtn.remove();
              fetchGA4Sessions();
            }
          } catch (error) {
            if (resultDiv) resultDiv.textContent = 'Google Analytics connection failed: ' + error.message;
          }
        };
        analyticsSection.appendChild(connectBtn);
      }
      if (resultDiv) resultDiv.textContent = 'To view analytics, connect your Google Analytics account.';
      return;
    }
    fetchGA4Sessions();
  }
}

// Fetch GA4 Sessions using OAuth token
async function fetchGA4Sessions() {
  const resultDiv = document.getElementById('ga4-analytics-result');
  if (!auth.currentUser) {
    if (resultDiv) resultDiv.innerHTML = '<div class="ga4-analytics-card-error">You must be logged in to view analytics.</div>';
    return;
  }
  let sessions = 'N/A';
  let hasData = false;
  try {
    let finalToken = googleOAuthAccessToken || sessionStorage.getItem('googleOAuthAccessToken');
    if (!finalToken && auth.currentUser.providerData && auth.currentUser.providerData.length) {
      finalToken = auth.currentUser.providerData[0].accessToken;
    }
    if (finalToken) {
      const propertyId = '494551293';
      const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
      const body = {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
        metrics: [{ name: 'sessions' }]
      };
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rows && data.rows[0]) {
          sessions = data.rows[0].metricValues[0].value;
          hasData = true;
        }
      }
    }
  } catch (e) {
    // Ignore all errors, just show N/A
  }
  if (resultDiv) {
    resultDiv.innerHTML = `
      <div class="ga4-analytics-card">
        <div class="ga4-analytics-title">Website Analytics (GA4)</div>
        <div class="ga4-analytics-metric-label">Sessions (last 30 days)</div>
        <div class="ga4-analytics-metric-value">${hasData ? sessions : '<span class=\'ga4-analytics-na\'>N/A</span>'}</div>
        <div class="ga4-analytics-footer">Google Analytics 4 Data API</div>
      </div>
    `;
  }
}

/* Add styles for analytics card */
(function addGA4AnalyticsStyles() {
  if (document.getElementById('ga4-analytics-styles')) return;
  const style = document.createElement('style');
  style.id = 'ga4-analytics-styles';
  style.textContent = `
    .ga4-analytics-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
      padding: 32px 40px 24px 40px;
      max-width: 420px;
      margin: 32px auto 0 auto;
      text-align: center;
      font-family: 'Segoe UI', Arial, sans-serif;
      border: 1px solid #e5e7eb;
      transition: box-shadow 0.2s;
    }
    .ga4-analytics-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #b46a2b;
      margin-bottom: 18px;
      letter-spacing: 0.01em;
    }
    .ga4-analytics-metric-label {
      font-size: 1.1rem;
      color: #222;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .ga4-analytics-metric-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #2d2d2d;
      margin-bottom: 12px;
      letter-spacing: 0.01em;
    }
    .ga4-analytics-na {
      color: #bbb;
      font-weight: 600;
      font-size: 2.2rem;
    }
    .ga4-analytics-footer {
      font-size: 0.95rem;
      color: #888;
      margin-top: 10px;
      letter-spacing: 0.01em;
    }
    .ga4-analytics-card-error {
      background: #fff3f3;
      color: #b30000;
      border: 1px solid #ffd6d6;
      border-radius: 10px;
      padding: 18px 24px;
      margin: 24px auto 0 auto;
      max-width: 400px;
      text-align: center;
      font-size: 1.1rem;
    }
  `;
  document.head.appendChild(style);
})();

auth.onAuthStateChanged(user => {
  if (user) {
    if (loginContainer) loginContainer.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    showLogoutButton();
    showDashboardUsername(user);
    showAnalyticsSection();
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

// === MAINTENANCE PLANNER CALENDAR LOGIC ===

const calendarBody = document.getElementById('calendar-body');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeTaskModalBtn = document.getElementById('close-task-modal');
const taskForm = document.getElementById('task-form');
const taskServiceInput = document.getElementById('task-service');
const taskDetailsInput = document.getElementById('task-details');
const taskDateInput = document.getElementById('task-date');
const taskRecurringInput = document.getElementById('task-recurring');
const modalTitle = document.getElementById('modal-title');

let tasks = [];
let editingTaskId = null;

function getTodayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function renderCalendar(year, month) {
  calendarBody.innerHTML = '';
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  let date = 1;
  for (let i = 0; i < 6; i++) { // 6 weeks max
    const row = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      cell.style = 'height:70px; min-width:90px; border:1px solid #ececec; vertical-align:top; position:relative;';
      if (i === 0 && j < firstDay) {
        cell.innerHTML = '';
      } else if (date > daysInMonth) {
        cell.innerHTML = '';
      } else {
        const cellDate = new Date(year, month, date);
        const cellDateStr = cellDate.toISOString().slice(0, 10);
        cell.innerHTML = `<div style='font-size:0.98rem; color:#888; position:absolute; top:6px; left:8px;'>${date}</div>`;
        // Render tasks for this day
        const dayTasks = getTasksForDate(cellDateStr);
        dayTasks.forEach(task => {
          const taskDiv = document.createElement('div');
          taskDiv.textContent = task.service;
          taskDiv.title = task.details;
          taskDiv.style = `margin:18px 0 0 0; padding:4px 8px; border-radius:6px; font-size:0.98rem; font-weight:600; background:${task.done ? '#2ecc71' : '#ce8157'}; color:#fff; cursor:pointer;`;
          taskDiv.onclick = () => toggleTaskDone(task.id);
          cell.appendChild(taskDiv);
        });
        // Add button to add task for this day
        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.title = 'Add task for this day';
        addBtn.style = 'position:absolute; top:4px; right:8px; background:#ce8157; color:#fff; border:none; border-radius:50%; width:22px; height:22px; font-size:1rem; cursor:pointer;';
        addBtn.onclick = (e) => {
          e.stopPropagation();
          openTaskModal(null, cellDateStr);
        };
        cell.appendChild(addBtn);
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
    if (date > daysInMonth) break;
  }
}

function getTasksForDate(dateStr) {
  // Return tasks for this date, including recurring tasks
  const d = new Date(dateStr);
  return tasks.filter(task => {
    if (task.date === dateStr) return true;
    if (task.recurring) {
      // Check if this date matches the recurrence rule (same weekday and week of month)
      const taskDate = new Date(task.date);
      const weekOfMonth = Math.floor((d.getDate() - 1) / 7);
      const taskWeekOfMonth = Math.floor((taskDate.getDate() - 1) / 7);
      return d.getDay() === taskDate.getDay() && weekOfMonth === taskWeekOfMonth;
    }
    return false;
  });
}

function openTaskModal(task, dateStr) {
  editingTaskId = task ? task.id : null;
  modalTitle.textContent = task ? 'Edit Maintenance Task' : 'Add Maintenance Task';
  taskServiceInput.value = task ? task.service : '';
  taskDetailsInput.value = task ? task.details : '';
  taskDateInput.value = dateStr || (task ? task.date : getTodayStr());
  taskRecurringInput.checked = task ? !!task.recurring : false;
  taskModal.style.display = 'flex';
}

function closeTaskModal() {
  editingTaskId = null;
  taskForm.reset();
  taskModal.style.display = 'none';
}

addTaskBtn.onclick = () => openTaskModal(null, '');
closeTaskModalBtn.onclick = closeTaskModal;
taskModal.onclick = (e) => { if (e.target === taskModal) closeTaskModal(); };

taskForm.onsubmit = function(e) {
  e.preventDefault();
  const service = taskServiceInput.value.trim();
  const details = taskDetailsInput.value.trim();
  const date = taskDateInput.value;
  const recurring = taskRecurringInput.checked;
  if (!service || !details || !date) return;
  if (editingTaskId) {
    // Edit existing
    const idx = tasks.findIndex(t => t.id === editingTaskId);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], service, details, date, recurring };
    }
  } else {
    // Add new
    tasks.push({ id: 'task-' + Date.now(), service, details, date, recurring, done: false });
  }
  closeTaskModal();
  renderCalendar(currentYear, currentMonth);
};

function toggleTaskDone(taskId) {
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    tasks[idx].done = !tasks[idx].done;
    renderCalendar(currentYear, currentMonth);
  }
}

// Calendar navigation
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function renderCalendarHeader() {
  let calTable = document.getElementById('calendar-table');
  if (!calTable) return;
  let oldHeader = document.getElementById('calendar-header-row');
  if (oldHeader) oldHeader.remove();
  const headerRow = document.createElement('tr');
  headerRow.id = 'calendar-header-row';
  const headerCell = document.createElement('th');
  headerCell.colSpan = 7;
  headerCell.style = 'background:#fff; border:none; padding:12px 0 0 0;';
  headerCell.innerHTML = `
    <button id='prev-month-btn' style='margin-right:18px; background:#eee; border:none; border-radius:6px; padding:4px 12px; font-size:1rem; cursor:pointer;'>&lt;</button>
    <span style='font-size:1.2rem; font-weight:700; color:#c77b4c;'>${getMonthName(currentMonth)} ${currentYear}</span>
    <button id='next-month-btn' style='margin-left:18px; background:#eee; border:none; border-radius:6px; padding:4px 12px; font-size:1rem; cursor:pointer;'>&gt;</button>
  `;
  headerRow.appendChild(headerCell);
  calTable.querySelector('thead').insertAdjacentElement('afterbegin', headerRow);
  document.getElementById('prev-month-btn').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendarHeader();
    renderCalendar(currentYear, currentMonth);
  };
  document.getElementById('next-month-btn').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendarHeader();
    renderCalendar(currentYear, currentMonth);
  };
}

function getMonthName(monthIdx) {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][monthIdx];
}

// Initial render
if (calendarBody) {
  renderCalendarHeader();
  renderCalendar(currentYear, currentMonth);
}
