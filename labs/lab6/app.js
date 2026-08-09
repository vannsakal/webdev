// ===================================================
//  app.js — shared JS for index.html & register.html
// ===================================================

// -------------------- COOKIE HELPERS --------------------
function getCookie(name) {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    let parts = cookie.split("=");
    if (parts[0] === name) {
      return decodeURIComponent(parts[1]);
    }
  }
  return null;
}

function setCookie(name, value, days) {
  let date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString() + "; path=/";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// -------------------- LOCAL STORAGE --------------------
function getUsers() {
  let data = localStorage.getItem("registeredUsers");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function saveUsers(users) {
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

// ===================================================
//  LOGIN PAGE (index.html)
// ===================================================

// if already logged in, skip to register
if (document.title === "Login") {
  if (getCookie("username")) {
    window.location.href = "register.html";
  }
}

function handleLogin() {
  let username = document.getElementById("username").value.trim();
  let errorMsg = document.getElementById("error-msg");

  if (username === "") {
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.style.display = "none";

  // save username into cookie for 1 day
  setCookie("username", username, 1);

  // go to register page
  window.location.href = "register.html";
}

// ===================================================
//  REGISTER PAGE (register.html)
// ===================================================

window.onload = function () {
  // only run on register page
  if (document.title !== "Register User") return;

  let username = getCookie("username");

  if (!username) {
    // no cookie — send back to login
    window.location.href = "index.html";
  } else {
    // show welcome message
    document.getElementById("welcome").innerText = "Welcome, " + username;
    renderTable();
  }
};

function logout() {
  deleteCookie("username");
  window.location.href = "index.html";
}

function registerUser() {
  let fullName = document.getElementById("fullName").value.trim();
  let email    = document.getElementById("email").value.trim();
  let phone    = document.getElementById("phone").value.trim();
  let errorMsg = document.getElementById("error-msg");

  if (fullName === "" || email === "" || phone === "") {
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.style.display = "none";

  // build user object
  let newUser = {
    fullName: fullName,
    email: email,
    phone: phone,
  };

  // push to array in localStorage
  let users = getUsers();
  users.push(newUser);
  saveUsers(users);

  clearForm();
  renderTable();
}

function clearForm() {
  document.getElementById("fullName").value = "";
  document.getElementById("email").value    = "";
  document.getElementById("phone").value    = "";
}

function deleteUser(index) {
  let users = getUsers();
  users.splice(index, 1);
  saveUsers(users);
  renderTable();
}

function renderTable() {
  let users    = getUsers();
  let tbody    = document.getElementById("users-body");
  let emptyMsg = document.getElementById("empty-msg");
  let table    = document.getElementById("users-table");

  // clear existing rows
  tbody.innerHTML = "";

  if (users.length === 0) {
    emptyMsg.style.display = "block";
    table.style.display    = "none";
    return;
  }

  emptyMsg.style.display = "none";
  table.style.display    = "table";

  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let tr   = document.createElement("tr");
    tr.innerHTML =
      "<td>" + user.fullName + "</td>" +
      "<td>" + user.email    + "</td>" +
      "<td>" + user.phone    + "</td>" +
      "<td><button class='del-btn' onclick='deleteUser(" + i + ")'>Delete</button></td>";
    tbody.appendChild(tr);
  }
}
