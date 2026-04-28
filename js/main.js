/* ================== GLOBAL STATE ================== */
let role = localStorage.getItem("role");
let isLoggedIn = localStorage.getItem("isLoggedIn");

/* ================== PAGE CONTROL (SAFE) ================== */
document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname;

    // ❌ DO NOT TOUCH HOME PAGE (guest page stays clean)
    if (currentPage.includes("index.html") || currentPage === "/") return;

    if (isLoggedIn !== "true") return;

    // SAFE PAGE CONTROL (NO REDIRECT LOOPS)
    if (!role || isLoggedIn !== "true") return;

    // Only block clearly wrong access (no forced redirects)
    if (currentPage.includes("staff-dashboard.html") && role !== "Cleaner") return;

    if (currentPage.includes("supervisor-dashboard.html") && role !== "Supervisor") return;

   
});


/* ================== LOGIN ================== */
document.addEventListener("DOMContentLoaded", () => {

    let selectedRole = "User";

    const roleButtons = document.querySelectorAll(".role-btn");
    const loginForm = document.getElementById("loginForm");
    const submitBtn = document.getElementById("submitBtn");

    // ✅ ONLY run if buttons exist (prevents breaking other pages)
    if (roleButtons.length > 0) {
        roleButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                roleButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                selectedRole = btn.dataset.role;

                if (submitBtn) {
                    submitBtn.innerText = `Sign In as ${selectedRole}`;
                }
            });
        });
    }

    // ✅ ONLY run if login form exists
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const input = document.getElementById("emailinput");

            if (!input || input.value.trim() === "") {
                alert("Enter username");
                return;
            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", selectedRole);
            localStorage.setItem("vconnectUserName", input.value);

            alert(`Logged in as ${selectedRole}`);

            window.location.href = "index.html";
        });
    }

});


/* ================== DASHBOARD NAVIGATION ================== */
document.addEventListener("DOMContentLoaded", () => {

    const dashboardLinks = document.querySelectorAll('a[href="dashboard.html"]');

    dashboardLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            const role = localStorage.getItem("role");

            if (role === "Cleaner") {
                window.location.href = "staff-dashboard.html";
            } 
            else if (role === "Supervisor") {
                window.location.href = "supervisor-dashboard.html";
            } 
            else {
                window.location.href = "dashboard.html";
            }
        });
    });

});


/* ================== NAVBAR CONTROL ================== */
document.addEventListener("DOMContentLoaded", () => {

    const navName = document.getElementById("navUserName");
    const loginLink = document.getElementById("loginLink");

    const storedName = localStorage.getItem("vconnectUserName");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true" && storedName) {

        if (navName) {
            navName.innerText = "Hi, " + storedName.split("@")[0];
        }

        if (loginLink) {
            loginLink.innerText = "Logout";

            loginLink.addEventListener("click", () => {
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("role");
                    localStorage.removeItem("vconnectUserName");
                    window.location.href = "index.html";
                }
            });
        }

        // Hide guest-only links
        const how = document.getElementById("howLink");
        const feature = document.getElementById("featureLink");

        if (how) how.style.display = "none";
        if (feature) feature.style.display = "none";

    } else {
        if (navName) navName.innerText = "";
        if (loginLink) loginLink.innerText = "Login";
    }

});


/* ================== DASHBOARD USER NAME ================== */
document.addEventListener("DOMContentLoaded", () => {

    const nameEl = document.getElementById("dashboardUserName");
    const name = localStorage.getItem("vconnectUserName");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!nameEl) return;

    if (isLoggedIn === "true" && name) {
        nameEl.innerText = name.split("@")[0];
    } else {
        nameEl.innerText = "Campus User";
    }

});


/* ================== WASHROOM (QR SIMULATION) ================== */
if (!localStorage.getItem("washroomId")) {
    localStorage.setItem("washroomId", "WR01");
}

const params = new URLSearchParams(window.location.search);
const wr = params.get("wr");

if (wr) {
    localStorage.setItem("washroomId", wr);
}

const currentWashroom = localStorage.getItem("washroomId") || "WR01";

/* ================== VCONNECT APP ================== */
class VConnectApp {

    openModal(type) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modalBody");

    let content = "";

    if (type === "feedback") {
        content = `
            <h3>Submit Feedback</h3>
            <p>Help us improve the washroom facilities</p>

            <div class="option-group">
                <p>How was the cleanliness?</p>
                <button onclick="selectOption(this)">Good</button>
                <button onclick="selectOption(this)">Bad</button>
            </div>

            <textarea placeholder="Write your suggestions..."></textarea>

            <button onclick="app.submitReport('feedback')">Submit Feedback</button>
        `;
    }

    else if (type === "request") {
        content = `
            <h3>Request Cleaning</h3>
            <p>Notify staff about urgent cleaning needs</p>

            <div class="option-group">
                <button onclick="selectOption(this)">Water/Liquid Spill</button>
                <button onclick="selectOption(this)">Very Dirty</button>
                <button onclick="selectOption(this)">Unusable</button>
                <button onclick="selectOption(this)">Bad Odor</button>
            </div>

            <button onclick="app.submitReport('request')">Send Request</button>
        `;
    }

    else if (type === "status") {
        content = `
            <h3>Report Cleanliness Status</h3>
            <p>Help us track the current state of the facility</p>

            <div class="option-group">
                <button onclick="selectOption(this)">Clean</button>
                <button onclick="selectOption(this)">Unclean</button>
            </div>

            <button onclick="app.submitReport('status')">Submit Status</button>
        `;
    }

    else if (type === "facility") {
        content = `
            <h3>Report Facility Issue</h3>
            <p>Let us know if something is missing or broken</p>

            <div class="option-group">
                <button onclick="selectOption(this)">No Soap</button>
                <button onclick="selectOption(this)">No Tissue</button>
                <button onclick="selectOption(this)">Tap Broken</button>
                <button onclick="selectOption(this)">Light Broken</button>
                <button onclick="selectOption(this)">No Water</button>
                <button onclick="selectOption(this)">Door Broken</button>
            </div>

            <button onclick="app.submitReport('facility')">Report Issue</button>
        `;
    }

    // 🔴 IMPORTANT: set content AFTER building it
    body.innerHTML = content;

    modal.classList.remove("hidden");
}
    closeModal() {
        document.getElementById("modal").classList.add("hidden");
    }

    submitReport(type) {

        let msg = "";

        if (type === "feedback") msg = "Feedback submitted!";
        else if (type === "request") msg = "Cleaning request sent!";
        else if (type === "status") msg = "Status updated!";
        else if (type === "facility") msg = "Issue reported!";

        const selected = document.querySelector(".option-group .selected");
        const otherBox = document.getElementById("otherBox");

        let issueText = "";

        if (selected) {
            issueText = selected.innerText;
        } else if (otherBox && otherBox.value.trim() !== "") {
            issueText = otherBox.value;
        } else {
            issueText = type;
        }

        const newReport = {
            id: Date.now(),
            issue: issueText,
            washroom: localStorage.getItem("washroomId") || "WR01",
            time: new Date().toLocaleTimeString(),
            status: "pending",
            user: localStorage.getItem("vconnectUserName") || "Guest"
        };

        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push(newReport);
        localStorage.setItem("reports", JSON.stringify(reports));

        console.log("Saved report:", newReport);

        alert(msg);

        this.closeModal();
    }
}

// ✅ ONLY ONE INSTANCE
const app = new VConnectApp();

window.app = app;

window.openModal = function(type) {
    app.openModal(type);
};

window.closeModal = function() {
    app.closeModal();
};

window.selectOption = function(btn) {
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

}
// ===== SIMPLE WORKING MODAL (NO BUGS) =====
function openQuickModal(type) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modalBody");

    if (!modal || !body) {
        alert("Modal not found");
        return;
    }

    let content = `
        <h3>${type.toUpperCase()}</h3>
        <p>Select an option</p>

        <div class="option-group">
            <button onclick="selectOption(this)">Very Dirty</button>
            <button onclick="selectOption(this)">Bad Odor</button>
        </div>

        <button onclick="sendQuickReport('${type}')">Send</button>
    `;

    body.innerHTML = content;
    modal.classList.remove("hidden");
}

function sendQuickReport(type) {
    const selected = document.querySelector(".option-group .selected");

    const report = {
        issue: selected ? selected.innerText : type,
        washroom: localStorage.getItem("washroomId") || "WR01",
        time: new Date().toLocaleTimeString(),
        user: localStorage.getItem("vconnectUserName") || "Guest"
    };

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    alert("Report sent!");
    closeModal();
}

// KEEP THIS (important)
function selectOption(btn) {
    const all = btn.parentElement.querySelectorAll("button");
    all.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
}
function selectOption(button) {
    const buttons = button.parentElement.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}
const socket = io("https://joe-backend-61qy.onrender.com");

socket.on("connect", () => {
    console.log("Connected to backend");
});
socket.on("sensor-update", (data) => {
    console.log("Live sensor data:", data);

    // 🔴 UPDATE YOUR UI HERE
});