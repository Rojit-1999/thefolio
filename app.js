// Tailwind config
if (typeof tailwind !== "undefined") {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: { sans: ["Poppins", "sans-serif"] },
        colors: { primary: { 500: "#667eea", 600: "#5a67d8", 700: "#4c51bf" } },
      },
    },
  };
}

// Mobile menu toggle
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.toggle("hidden");
}

// Nav active state based on current path
function setActiveNav() {
  const path = (location.pathname || "").toLowerCase();
  const map = [
    { id: "nav-home", match: ["/", "/index.html", "/thefoliostudio.html"] },
    { id: "nav-services", match: ["/services.html"] },
    { id: "nav-portfolio", match: ["/portfolio.html", "/samples.html"] },
    { id: "nav-pricing", match: ["/pricing.html"] },
  ];
  document.querySelectorAll(".nav-link").forEach((el) => {
    el.classList.remove("text-primary-500", "font-bold");
    el.classList.add("text-gray-700");
  });
  const item = map.find((m) => m.match.some((p) => path.endsWith(p)));
  if (item) {
    const el = document.getElementById(item.id);
    if (el) {
      el.classList.remove("text-gray-700");
      el.classList.add("text-primary-500", "font-bold");
    }
  }
}

// Portfolio filtering (portfolio page)
function filterPortfolios(ev, category) {
  if (!ev) return;
  const cards = document.querySelectorAll(".portfolio-card");
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach((tab) => {
    tab.classList.remove("bg-primary-500", "text-white", "active");
    tab.classList.add("bg-gray-100", "text-gray-700");
  });
  if (ev.target) {
    ev.target.classList.remove("bg-gray-100", "text-gray-700");
    ev.target.classList.add("bg-primary-500", "text-white", "active");
  }
  cards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Form submission (contact page)
function handleFormSubmit(event) {
  event.preventDefault();
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center card-modern">
      <div class="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h3 class="text-2xl font-bold mb-4">Message Sent!</h3>
      <p class="text-gray-600 mb-6 leading-relaxed">Thanks for reaching out! We'll get back to you within 24 hours to discuss your portfolio vision and next steps.</p>
      <button onclick="document.body.removeChild(this.closest('.fixed'))" class="btn-primary">Continue</button>
    </div>`;
  document.body.appendChild(modal);
}

// FAQ toggle (pricing page)
function toggleFAQ(button) {
  const content = button.nextElementSibling;
  const arrow = button.querySelector("svg");
  if (!content || !arrow) return;
  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden");
    arrow.style.transform = "rotate(180deg)";
  } else {
    content.classList.add("hidden");
    arrow.style.transform = "rotate(0deg)";
  }
}

// Resume upload (contact page)
function handleResumeUpload(input) {
  const file = input.files[0];
  if (file) {
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    if (file.size > 10 * 1024 * 1024) {
      showUploadError("File size must be less than 10MB");
      input.value = "";
      return;
    }
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      showUploadError("Please upload a PDF, DOC, or DOCX file");
      input.value = "";
      return;
    }
    const fileNameEl = document.getElementById("resumeFileName");
    const previewEl = document.getElementById("resumePreview");
    const labelEl = document.getElementById("resumeLabel");
    if (fileNameEl) fileNameEl.textContent = `${fileName} (${fileSize} MB)`;
    if (previewEl) previewEl.classList.remove("hidden");
    if (labelEl) labelEl.textContent = "Resume uploaded successfully";
  }
}

function removeResume() {
  const input = document.getElementById("resume");
  const previewEl = document.getElementById("resumePreview");
  const labelEl = document.getElementById("resumeLabel");
  if (input) input.value = "";
  if (previewEl) previewEl.classList.add("hidden");
  if (labelEl)
    labelEl.textContent = "Click to upload your resume (PDF, DOC, DOCX)";
}

function showUploadError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700";
  errorDiv.textContent = message;
  const resumeSection = document.getElementById("resume");
  if (resumeSection) {
    const parent = resumeSection.closest("div");
    if (parent) parent.appendChild(errorDiv);
  }
  setTimeout(() => {
    if (errorDiv.parentNode) errorDiv.parentNode.removeChild(errorDiv);
  }, 3000);
}

// Home testimonial slider
let currentTestimonial = 0;
const totalTestimonials = 6;
function updateTestimonialSlider() {
  const slider = document.getElementById("testimonialSlider");
  const dots = document.querySelectorAll(".testimonial-dot");
  if (slider) {
    slider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
  }
  if (dots && dots.length) {
    dots.forEach((dot, index) => {
      if (index === currentTestimonial) {
        dot.classList.remove("bg-gray-300");
        dot.classList.add("bg-primary-500");
      } else {
        dot.classList.remove("bg-primary-500");
        dot.classList.add("bg-gray-300");
      }
    });
  }
}
function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
  updateTestimonialSlider();
}
function previousTestimonial() {
  currentTestimonial =
    (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
  updateTestimonialSlider();
}
function goToTestimonial(index) {
  currentTestimonial = index;
  updateTestimonialSlider();
}

// Pricing testimonial slider
let currentPricingTestimonial = 0;
const totalPricingTestimonials = 3;
function updatePricingTestimonialSlider() {
  const slider = document.getElementById("pricingTestimonialSlider");
  const dots = document.querySelectorAll(".pricing-testimonial-dot");
  if (slider) {
    slider.style.transform = `translateX(-${currentPricingTestimonial * 100}%)`;
  }
  if (dots && dots.length) {
    dots.forEach((dot, index) => {
      if (index === currentPricingTestimonial) {
        dot.classList.remove("bg-gray-300");
        dot.classList.add("bg-primary-500");
      } else {
        dot.classList.remove("bg-primary-500");
        dot.classList.add("bg-gray-300");
      }
    });
  }
}
function nextPricingTestimonial() {
  currentPricingTestimonial =
    (currentPricingTestimonial + 1) % totalPricingTestimonials;
  updatePricingTestimonialSlider();
}
function previousPricingTestimonial() {
  currentPricingTestimonial =
    (currentPricingTestimonial - 1 + totalPricingTestimonials) %
    totalPricingTestimonials;
  updatePricingTestimonialSlider();
}
function goToPricingTestimonial(index) {
  currentPricingTestimonial = index;
  updatePricingTestimonialSlider();
}

// Autoplay for home testimonials
let testimonialInterval;
function startTestimonialAutoplay() {
  testimonialInterval = setInterval(nextTestimonial, 5000);
}
function stopTestimonialAutoplay() {
  clearInterval(testimonialInterval);
}

// Touch handlers
let touchStartX = 0;
let touchEndX = 0;
let isTestimonialSwiping = false;
function handleTestimonialTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  isTestimonialSwiping = true;
  stopTestimonialAutoplay();
}
function handleTestimonialTouchEnd(e) {
  if (!isTestimonialSwiping) return;
  touchEndX = e.changedTouches[0].screenX;
  const swipeThreshold = 50;
  const swipeDistance = touchStartX - touchEndX;
  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) nextTestimonial();
    else previousTestimonial();
  }
  isTestimonialSwiping = false;
  startTestimonialAutoplay();
}
function handlePricingTestimonialTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
}
function handlePricingTestimonialTouchEnd(e) {
  touchEndX = e.changedTouches[0].screenX;
  const swipeThreshold = 50;
  const swipeDistance = touchStartX - touchEndX;
  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) nextPricingTestimonial();
    else previousPricingTestimonial();
  }
}

// Initialize per-page
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();

  // Home page setup
  if (document.getElementById("testimonialSlider")) {
    updateTestimonialSlider();
    startTestimonialAutoplay();
    const section = document.querySelector(".testimonial-slider-container");
    if (section) {
      section.addEventListener("mouseenter", stopTestimonialAutoplay);
      section.addEventListener("mouseleave", startTestimonialAutoplay);
    }
    const homeSlider = document.getElementById("testimonialSlider");
    if (homeSlider) {
      homeSlider.addEventListener("touchstart", handleTestimonialTouchStart, {
        passive: true,
      });
      homeSlider.addEventListener("touchend", handleTestimonialTouchEnd, {
        passive: true,
      });
    }
  }

  // Pricing page setup
  if (document.getElementById("pricingTestimonialSlider")) {
    updatePricingTestimonialSlider();
    const pricingSlider = document.getElementById("pricingTestimonialSlider");
    if (pricingSlider) {
      pricingSlider.addEventListener(
        "touchstart",
        handlePricingTestimonialTouchStart,
        { passive: true }
      );
      pricingSlider.addEventListener(
        "touchend",
        handlePricingTestimonialTouchEnd,
        { passive: true }
      );
    }
  }

  // Portfolio page: activate first tab state
  if (document.getElementById("portfolioGrid")) {
    const firstTab = document.querySelector(".filter-tab");
    if (firstTab) {
      firstTab.classList.add("bg-primary-500", "text-white", "active");
      firstTab.classList.remove("bg-gray-100", "text-gray-700");
    }
  }
});


