const signupForm = document.getElementById("signup-form");
const signinForm = document.getElementById("signin-form");
const verifyOtpForm = document.getElementById("otp-code-form");
const createAccountForm = document.getElementById("create-account-form");
const createGroupForm = document.getElementById("create-group-form");

function signup() {
    signupForm?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;

        getResultAndProcess({ path: "/auth/signup", body: { email } });
    });
}

function signin() {
    signinForm?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;

        getResultAndProcess({ path: "/auth/signin", body: { email } });
    });
}

function verifyOtp() {
    verifyOtpForm?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const code = document.getElementById("auth-code").value;

        getResultAndProcess({ path: "/auth/verify-otp", body: { code } });
    });
}

function createAccount() {
    createAccountForm?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const bio = document.getElementById("bio").value;

        if (!firstName) {
            alert("First name is required");
            return;
        }

        getResultAndProcess({
            path: "/user/create-account",
            body: {
                firstName,
                lastName,
                bio,
            },
        });
    });
}

function createGroup() {
    document.addEventListener("DOMContentLoaded", () => {
        createGroupForm?.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const link = document.getElementById("link").value;
            const bio = document.getElementById("bio").value;

            if (!name) {
                alert("name is required");
                return;
            }
            if (!link) {
                alert("link is required");
                return;
            }

            const body = { name, link, bio };
            getResultAndProcess({ path: "/group/create", body });
        });
    });
}
// ====================================================================================
signup();
signin();
verifyOtp();
createAccount();
createGroup();
// ====================================================================================
