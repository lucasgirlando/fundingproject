window.addEventListener("DOMContentLoaded", () => {
  emailjs.init("ntpdz1-kojjfmourz");
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

document.getElementById("fundingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const firstName = form.elements["firstName"].value;
  const lastName = form.elements["lastName"].value;

  const formData = {
    name: `${firstName} ${lastName}`,
    email: form.elements["email"].value,
    phone: form.elements["phone"].value,
    businessName: form.elements["businessName"].value,
    monthlyRevenue: form.elements["monthlyRevenue"].value,
    yearsInBusiness: form.elements["years"].value,
    industry: form.elements["industry"].value,
    useOfFunds: form.elements["useOfFunds"].value,
    fundingHistory: form.elements["funding"].value,
  };

  console.log("📤 Submitting form data:", formData);

  try {
    // Send to EmailJS (main notification)
    await emailjs.send("service_95zy8qp", "template_qgwfidj", formData);
    console.log("✅ EmailJS: Email sent");

    // Optional: Send internal copy
    emailjs.send("service_95zy8qp", "internal_template", formData);

    // Send to Zapier Webhook
    const zapierResponse = await fetch("https://hooks.zapier.com/hooks/catch/23918523/uud7059/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!zapierResponse.ok) {
      throw new Error(`Zapier returned status ${zapierResponse.status}`);
    }

    console.log("✅ Zapier: Webhook sent");

    // Final UI feedback
    document.getElementById("fundingForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";

  } catch (error) {
    console.error("❌ Form submission error:", error);
    alert("Failed to send form: " + (error?.message || "Unknown error"));
  }
});
