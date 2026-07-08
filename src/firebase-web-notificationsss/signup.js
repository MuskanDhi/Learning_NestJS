const btn = document.getElementById("signupBtn");

btn.onclick = async () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // Get Turnstile token from localStorage
    const turnstileToken = localStorage.getItem("turnstileToken");

    if (!turnstileToken) {
        alert("Please complete 'I'm not a robot' verification first.");
        window.location.href = "index.html";
        return;
    }

    if (!name || !email) {
        alert("Enter all fields");
        return;
    }

    try {

        const res = await fetch("http://localhost:3000/auths/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                turnstileToken,
            }),

        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Signup failed");
            return;
        }

        alert(data.message);

        localStorage.setItem("email", email);

        window.location.href = "verify-otp.html";

    } catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

}