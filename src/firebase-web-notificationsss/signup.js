const btn = document.getElementById("signupBtn");

btn.onclick = async () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

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
                email
            })

        });

        const data = await res.json();

        alert(data.message);

        localStorage.setItem("email", email);

        window.location.href = "verify-otp.html";

    } catch (err) {

        console.log(err);

    }

}