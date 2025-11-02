document.addEventListener("DOMContentLoaded", async () => {
    const navbarContainer = document.getElementById('navbar');
    const html = await (await fetch('/navbar.html')).text();
    navbarContainer.innerHTML = html;

    const loginLink = document.getElementById("loginLink");
    const signinLink = document.getElementById("signinLink");
    const logoutLink = document.getElementById("logoutLink");

    const response = await fetch("/session-status", { credentials: "include" });
    const data = await response.json();

    if (data.isLoggedIn) {
        loginLink.style.display = "none";
        signinLink.style.display = "none";
        logoutLink.style.display = "flex";
        todoLink.style.display = "flex";
    } else {
        loginLink.style.display = "flex";
        signinLink.style.display = "flex";
        logoutLink.style.display = "none";
        todoLink.style.display = "none";
    }
});