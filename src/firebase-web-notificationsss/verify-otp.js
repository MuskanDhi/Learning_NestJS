console.log("verify-otp.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("verifyForm");
    const emailInput = document.getElementById("email");
    const otpInput = document.getElementById("otp");

    console.log("Form:", form);
    console.log("Email Input:", emailInput);
    console.log("OTP Input:", otpInput);

    // Load email from localStorage
    const savedEmail = localStorage.getItem("email");

    console.log("Saved Email:", savedEmail);

    if (savedEmail) {
        emailInput.value = savedEmail;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("Verify button clicked");

        const email = emailInput.value.trim();
        const otp = otpInput.value.trim();

        console.log("Email:", email);
        console.log("OTP:", otp);

        if (!email || !otp) {
            alert("Please enter email and OTP");
            return;
        }

        try {

            console.log("Calling API...");

            const response = await fetch(
                "http://localhost:3000/auths/verify-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        otp,
                    }),
                }
            );

            console.log("Status:", response.status);

            const data = await response.json();

            console.log("Response:", data);

            if (response.ok) {

                alert("Email verified successfully ✅");

                localStorage.removeItem("email");

                window.location.href = "login.html";

            } else {

                alert(data.message || "Invalid OTP");

            }

        } catch (error) {

            console.error("Fetch Error:", error);

            alert("Something went wrong.");

        }

    });

});