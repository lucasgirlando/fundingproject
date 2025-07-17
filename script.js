function scrollToForm() {
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  splash.classList.add("fade-out");

  // Wait for splash to fully fade before loading particles
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
  }, 2000); // Delay for splash fade
});


document.getElementById("fundingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = {
    name: form.elements["name"].value,
    email: form.elements["email"].value,
    phone: form.elements["phone"].value,
    businessName: form.elements["businessName"].value,
    monthlyRevenue: form.elements["monthlyRevenue"].value,
    yearsInBusiness: form.elements["yearsInBusiness"].value,
    industry: form.elements["industry"].value,
    useOfFunds: form.elements["useOfFunds"].value,
    fundingHistory: form.elements["fundingHistory"].value,
  };

  emailjs.send("service_95zy8qp", "template_qgwfidj", formData)
    .then(() => {
      console.log("✅ Email sent!");
      document.getElementById("fundingForm").style.display = "none";
      document.getElementById("thankYou").style.display = "block";
    }, (err) => {
      console.error("❌ Email send failed:", err);
      alert("There was an issue sending your message. Please try again.");
    });

  // Optional: internal notification
  emailjs.send("service_95zy8qp", "internal_template", formData);
});
