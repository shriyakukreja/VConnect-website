/* ================== VCONNECT APP ================== */
// ===== WASHROOM HANDLING =====

// Simulate QR (for now)
if (!localStorage.getItem("washroomId")) {
    localStorage.setItem("washroomId", "WR01");
}

// Later when QR is used
const params = new URLSearchParams(window.location.search);
const wr = params.get("wr");

if (wr) {
    localStorage.setItem("washroomId", wr);
}
//Get current washroom
const currentWashroom = 
localStorage.getItem("WashroomID") || "WR01";

console.log("Current Washroom:", currentWashroom);

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
                <button class="submit-btn" onclick="app.submitReport('feedback')">Submit Feedback</button>
            `;
        }

        if (type === "request") {
            content = `
                <h3>Request Cleaning</h3>
                <p>Notify staff about urgent cleaning needs</p>

                <div class="option-group">
                    <button onclick="selectOption(this)">Water/Liquid Spill</button>
                    <button onclick="selectOption(this)">Very Dirty</button>
                    <button onclick="selectOption(this)">Unusable</button>
                    <button onclick="selectOption(this)">Bad Odor</button>
                    <button onclick="toggleOtherBox()">Other</button>
                </div>

                <textarea id="otherBox" placeholder="Describe other issue..." style="display:none;"></textarea>

                <button class="submit-btn" onclick="app.submitReport('request')">Send Request</button>
            `;
        }

        if (type === "status") {
            content = `
                <h3>Report Cleanliness Status</h3>
                <p>Help us track the current state of the facility</p>

                <div class="option-group">
                    <button onclick="selectOption(this)">Clean</button>
                    <button onclick="selectOption(this)">Unclean</button>
                </div>

                <button class="submit-btn" onclick="app.submitReport('status')">Submit Status</button>
            `;
        }

        if (type === "facility") {
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
                    <button onclick="toggleOtherBox()">Other</button>
                </div>

                <textarea id="otherBox" placeholder="Describe other issue..." style="display:none;"></textarea>

                <button class="submit-btn" onclick="app.submitReport('facility')">Report Issue</button>
            `;
        }

        body.innerHTML = content;
        modal.classList.remove("hidden");
    }

    closeModal() {
        document.getElementById("modal").classList.add("hidden");
    }

    showPopup(message) {
        const popup = document.getElementById("actionPopup");
        const popupMsg = document.getElementById("popupMessage");

        if (!popup || !popupMsg) return;

        popupMsg.innerText = message;
        popup.classList.add("show");
        popup.classList.remove("hidden");

        setTimeout(() => {
            popup.classList.remove("show");
            popup.classList.add("hidden");
        }, 3000);
    }

    submitReport(type) {
        let msg = "";

        if (type === "feedback") msg = "Thank you for your feedback!";
        else if (type === "request") msg = "Report sent to the nearest cleaner!";
        else if (type === "status") msg = "Status updated successfully!";
        else if (type === "facility") msg = "Facility issue reported successfully!";

        this.showPopup(msg);
        this.closeModal();
    }
}

const app = new VConnectApp();

/* ================== GLOBAL FUNCTIONS ================== */

window.openModal = (type) => app.openModal(type);
window.closeModal = () => app.closeModal();

window.selectOption = function(button) {
    const buttons = button.parentElement.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
};

window.toggleOtherBox = function() {
    const box = document.getElementById("otherBox");
    if (box) {
        box.style.display = box.style.display === "none" ? "block" : "none";
    }
};

/* ================== LOGIN FUNCTIONALITY ================== */

/* ============== LOGIN FUNCTIONALITY (FIXED) ============== */

let selectedRole = "User";

// Role buttons
const roleButtons = document.querySelectorAll(".role-btn");
const submitBtn = document.getElementById("submitBtn");

roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        roleButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        selectedRole = btn.getAttribute("data-role");
        submitBtn.innerText = `Sign In as ${selectedRole}`;
    });
});

// Form submit
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get values (FIXED SELECTORS)
        const email = loginForm.querySelector("input[type='text']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        console.log("LOGIN CLICKED"); // debug
        console.log(selectedRole, email);

        // Save data
        localStorage.setItem("vconnectRole", selectedRole);
        localStorage.setItem("vconnectEmail", email);

        // 🚀 REDIRECT (MAIN FIX)
        if (selectedRole === "Supervisor") {
            window.location.href = "supervisor-dashboard.html";
        } 
        else if (selectedRole === "Cleaner") {
            window.location.href = "cleaner-dashboard.html";
        } 
        else if (selectedRole === "User") {
            window.location.href = "dashboard.html";
        }
        else {
            window.location.href = "index.html";
        }
    });
}