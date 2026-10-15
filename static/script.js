const emailForm = document.getElementById("emailForm");

const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const senderInput = document.getElementById("sender");

const analyzeButton = document.getElementById("analyzeButton");
const clearButton = document.getElementById("clearButton");
const analyzeAgainButton = document.getElementById("analyzeAgainButton");

const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const resultState = document.getElementById("resultState");
const errorState = document.getElementById("errorState");

const resultPanel = document.getElementById("resultPanel");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const resultSubject = document.getElementById("resultSubject");
const resultSender = document.getElementById("resultSender");
const errorMessage = document.getElementById("errorMessage");

const totalEmails = document.getElementById("totalEmails");
const spamCount = document.getElementById("spamCount");
const normalCount = document.getElementById("normalCount");

let total = 0;
let spam = 0;
let normal = 0;

function hideAllStates() {
    emptyState.hidden = true;
    loadingState.hidden = true;
    resultState.hidden = true;
    errorState.hidden = true;
}

function resetResult() {
    hideAllStates();
    resultPanel.classList.remove("spam");
    emptyState.hidden = false;
}

function updateStatistics() {
    totalEmails.textContent = total;
    spamCount.textContent = spam;
    normalCount.textContent = normal;
}

function showError(message) {
    hideAllStates();
    errorMessage.textContent = message;
    errorState.hidden = false;
}

emailForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        emailInput.focus();
        return;
    }

    hideAllStates();
    loadingState.hidden = false;

    analyzeButton.disabled = true;
    analyzeButton.innerHTML = "<span>⌕</span> Scanning...";

    try {
        // Show the scanning animation briefly.
        const scanDelay = new Promise(resolve => setTimeout(resolve, 1200));

        // Send the email to the existing Flask backend.
        const request = fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        });

        const response = await request;
        const data = await response.json();

        await scanDelay;

        if (!response.ok) {
            throw new Error(data.error || "Unable to analyze this email.");
        }

        if (data.result !== "Spam" && data.result !== "Not Spam") {
            throw new Error("The server returned an unexpected result.");
        }

        total++;

        if (data.result === "Spam") {
            spam++;
        } else {
            normal++;
        }

        updateStatistics();

        hideAllStates();

        resultState.hidden = false;

        resultPanel.classList.toggle("spam", data.result === "Spam");

        if (data.result === "Spam") {
            resultIcon.textContent = "!";
            resultTitle.textContent = "Spam Detected";
            resultMessage.textContent =
                "The model classified this message as potential spam.";
        } else {
            resultIcon.textContent = "✓";
            resultTitle.textContent = "Not Spam";
            resultMessage.textContent =
                "The model classified this message as not spam.";
        }

        resultSubject.textContent =
            subjectInput.value.trim() || "Not provided";

        resultSender.textContent =
            senderInput.value.trim() || "Not provided";

    } catch (error) {
        showError(
            error.message || "Something went wrong. Please try again."
        );
    } finally {
        analyzeButton.disabled = false;
        analyzeButton.innerHTML = "<span>⌕</span> Analyze Email";
    }
});

// Clear the form and result.
clearButton.addEventListener("click", function () {
    emailForm.reset();
    resetResult();
    emailInput.focus();
});

// Allow another email to be analyzed.
analyzeAgainButton.addEventListener("click", function () {
    emailInput.value = "";
    resetResult();
    emailInput.focus();
});

// Reset the result when the user starts entering a new message.
emailInput.addEventListener("input", function () {
    if (!loadingState.hidden) {
        return;
    }

    resetResult();
});

// Initial state.
updateStatistics();
resetResult();