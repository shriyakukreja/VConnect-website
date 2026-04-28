/* ================== GLOBAL STATE ================== */
const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

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

    if (currentPage.includes("dashboard.html") && role !== "User") return;

   
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
                    localStorage.clear();
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

        if (type === "request") {
            content = `
                <h3>Request Cleaning</h3>
                <div class="option-group">
                    <button onclick="selectOption(this)">Very Dirty</button>
                    <button onclick="selectOption(this)">Bad Odor</button>
                </div>
                <button onclick="app.submitReport('request')">Send</button>
            `;
        }

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
window.app = new VConnectApp();

window.openModal = (type) => app.openModal(type);
window.closeModal = () => app.closeModal();

window.selectOption = function(btn) {
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
}