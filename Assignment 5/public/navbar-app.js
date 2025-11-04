document.addEventListener("DOMContentLoaded", async () => {
    const navbarContainer = document.getElementById('navbar-Container');
    const html = await (await fetch('/navbar.html')).text();
    navbarContainer.innerHTML = html;

    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutLink = document.getElementById("logoutLink");

    const response = await fetch("/session-status", { credentials: "include" });
    const data = await response.json();

    if (data.isLoggedIn) {
        loginLink.style.display = "none";
        signupLink.style.display = "none";
        logoutLink.style.display = "flex";
        todoLink.style.display = "flex";
    } else {
        loginLink.style.display = "flex";
        signupLink.style.display = "flex";
        logoutLink.style.display = "none";
        todoLink.style.display = "none";
    }
});