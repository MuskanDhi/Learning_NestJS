const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const turnstileToken = localStorage.getItem("turnstileToken");


    if (!turnstileToken) {
        alert("Please complete 'I'm not a robot' verification first.");
        window.location.href = "index.html";
        return;
    }

    if (!email) {
        alert("Enter your email");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:3000/auths/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    turnstileToken,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        if (data.success) {

            localStorage.setItem("email", email);

            alert(data.message);

            window.location.href = "verify-otp.html";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);
        alert("Something went wrong.");

    }

});