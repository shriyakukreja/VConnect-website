class VConnectApp {

    openModal(type) {
        const modal = document.getElementById("modal");
        const body = document.getElementById("modalBody");

        let content = "";

        // FEEDBACK
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

        // REQUEST CLEANING
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

        // REPORT STATUS
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

        // FACILITY ISSUE
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

    submitReport(type) {
        const successMsg = document.getElementById("successMessage");
        successMsg.innerText = `Your ${type} report has been submitted successfully!`;
        successMsg.classList.remove("hidden");
        setTimeout(() => successMsg.classList.add("hidden"), 3000);
        this.closeModal();
    }
}

const app = new VConnectApp();

window.openModal = function(type) {
    app.openModal(type);
};

window.closeModal = function() {
    app.closeModal();
};

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

/*login*/
// ROLE SWITCHER FUNCTIONALITY
/* ============== LOGIN FUNCTIONALITY ============== */
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const roleButtons = document.querySelectorAll(".role-btn");
    let selectedRole = "User"; // default role

    // Role switcher
    roleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            roleButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedRole = btn.dataset.role;
            document.getElementById("submitBtn").innerText = `Sign In as ${selectedRole}`;
        });
    });

    // Login form submission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent actual form submission

        // Get email and password values (no validation)
        const email = loginForm.querySelector("input[type='email']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        // Save role and email in localStorage
        localStorage.setItem("vconnectRole", selectedRole);
        localStorage.setItem("vconnectEmail", email);

        // For now, just log and show alert
        console.log(`Logged in as ${selectedRole} with email: ${email}`);
        alert(`Logged in as ${selectedRole}!`);

        // You can redirect later when dashboard pages are ready
        // Example: window.location.href = `${selectedRole.toLowerCase()}-dashboard.html`;
    });
});
// Existing VConnectApp code remains the same

VConnectApp.prototype.showPopup = function(message) {
    const popup = document.getElementById("actionPopup");
    const popupMsg = document.getElementById("popupMessage");
    popupMsg.innerText = message;
    popup.classList.add("show");
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
    }, 3000); // popup shows for 3 seconds
};

// Updated submitReport
VConnectApp.prototype.submitReport = function(type) {
    let msg = "";
    if(type === "feedback") msg = "Thank you for your feedback!";
    else if(type === "request") msg = "Report sent to the nearest cleaner!";
    else if(type === "status") msg = "Status updated successfully!";
    else if(type === "facility") msg = "Facility issue reported successfully!";

    this.showPopup(msg);
    this.closeModal();
};