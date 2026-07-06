const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

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
                }),
            }
        );

        const data = await response.json();

        alert(data.message);

        if (data.success) {

            localStorage.setItem("email", email);

            alert(data.message);

            window.location.href = "verify-otp.html";

        }

    } catch (err) {

        console.error(err);

    }

});