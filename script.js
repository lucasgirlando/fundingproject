window.addEventListener("DOMContentLoaded", () => {
  emailjs.init("ntpdz1-kojjfmourz");
  
  const phoneInputField = document.querySelector("#phone");
  window.phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["us", "ve", "mx", "ca"],
    initialCountry: "us",
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
  });
});



function scrollToForm() {
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  splash.classList.add("fade-out");

  setTimeout(() => {
    tsParticles.load("tsparticles", {
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      particles: {
        number: { value: 45, density: { enable: true, area: 800 } },
        color: { value: "#ffffff" },
        opacity: { value: 0.07 },
        size: { value: { min: 1, max: 2 } },
        move: {
          enable: true,
          speed: 0.2,
          direction: "none",
          outModes: { default: "out" }
        }
      },
      interactivity: {
        events: {
          onhover: { enable: false },
          onclick: { enable: false }
        }
      }
    });
  }, 2000);
});

const timestamp = new Date().toLocaleString("en-US", {
  timeZone: "America/New_York", // or your desired timezone
  dateStyle: "medium",
  timeStyle: "short"
});


document.getElementById("fundingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

    const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phoneError");

  // Strip non-digits from formatted input (like +1 (555) 555-5555 → 15555555555)
  const rawPhoneDigits = window.phoneInput.getNumber().replace(/\D/g, '');

  if (rawPhoneDigits.length !== 10) {
    phoneError.style.display = "block";
    phoneInput.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  } else {
    phoneError.style.display = "none";
  }


  const form = e.target;
  const firstName = form.elements["firstName"].value;
  const lastName = form.elements["lastName"].value;

  const formData = {
    firstName: firstName,
    lastName: lastName,
    email: form.elements["email"].value,
    phone: window.phoneInput.getNumber(),
    businessName: form.elements["businessName"].value,
    monthlyRevenue: form.elements["monthlyRevenue"].value,
    yearsInBusiness: form.elements["years"].value,
    industry: form.elements["industry"].value,
    useOfFunds: form.elements["useOfFunds"].value,
    fundingHistory: form.elements["funding"].value,
    fundingAmountRequested: form.elements["fundingAmount"].value,
    referrerCode: form.elements["referrerCode"].value,
    timestamp
  };

  console.log("📤 Submitting form data:", formData);

  try {
    // Send to EmailJS (main notification)
    await emailjs.send("service_95zy8qp", "template_qgwfidj", formData);
    console.log("✅ EmailJS: Email sent");

    await emailjs.send("service_95zy8qp", "internal_notification", {
       ...formData,
       to_email: "intake@miamifundinghub.com"
      });


    // Optional: Send internal copy
    emailjs.send("service_95zy8qp", "internal_template", formData);

    // Send to Zapier Webhook
    const zapierResponse = await fetch("https://hooks.zapier.com/hooks/catch/23918523/uud7059/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "no-cors",
      body: JSON.stringify(formData)
    });
  
    console.log("✅ Zapier: Webhook sent (no-cors)");


    console.log("✅ Zapier: Webhook sent");

    // Final UI feedback
    document.getElementById("fundingForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";

  } catch (error) {
    console.error("❌ Form submission error:", error);
    alert("Failed to send form: " + (error?.message || "Unknown error"));
  }
});
