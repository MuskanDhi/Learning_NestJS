window.turnstileSuccess = function (token) {

    console.log("Turnstile Token:", token);

    localStorage.setItem("turnstileToken", token);

    document.getElementById("signupBtn").disabled = false;
    document.getElementById("loginBtn").disabled = false;

};

document.getElementById("signupBtn").addEventListener("click", () => {

    window.location.href = "signup.html";

});

document.getElementById("loginBtn").addEventListener("click", () => {

    window.location.href = "login.html";

});