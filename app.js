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

// Validation functions
function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, message: "Full name is required" };
  }
  if (trimmed.length < 2) {
    return { valid: false, message: "Name must be at least 2 characters" };
  }
  if (trimmed.length > 100) {
    return { valid: false, message: "Name must be less than 100 characters" };
  }
  // Check for valid name format (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return {
      valid: false,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }
  return { valid: true, message: "" };
}

function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, message: "Email address is required" };
  }
  // Comprehensive email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  // Check for common email format issues
  if (trimmed.length > 254) {
    return { valid: false, message: "Email address is too long" };
  }
  if (
    trimmed.indexOf("..") !== -1 ||
    trimmed.startsWith(".") ||
    trimmed.endsWith(".")
  ) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  return { valid: true, message: "" };
}

function validateRole(role) {
  if (!role || role === "") {
    return { valid: false, message: "Please select your profession" };
  }
  return { valid: true, message: "" };
}

function validateMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) {
    return { valid: false, message: "Project details are required" };
  }
  if (trimmed.length < 10) {
    return {
      valid: false,
      message: "Please provide at least 10 characters of details",
    };
  }
  if (trimmed.length > 2000) {
    return {
      valid: false,
      message: "Message must be less than 2000 characters",
    };
  }
  return { valid: true, message: "" };
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  // Remove existing error message
  const existingError = field.parentElement.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  // Add error styling to field
  field.classList.remove("border-gray-300", "border-green-500");
  field.classList.add("border-red-500");

  // Add error message
  if (message) {
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "field-error mt-1 text-sm text-red-600 flex items-center";
    errorDiv.innerHTML = `
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      ${message}
    `;
    field.parentElement.appendChild(errorDiv);
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  // Remove error message
  const existingError = field.parentElement.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  // Remove error styling
  field.classList.remove("border-red-500");
  field.classList.add("border-gray-300");
}

function validateField(fieldId, validator) {
  const field = document.getElementById(fieldId);
  if (!field) return false;

  const value = field.value;
  const result = validator(value);

  if (result.valid) {
    clearFieldError(fieldId);
    return true;
  } else {
    showFieldError(fieldId, result.message);
    return false;
  }
}

// Form submission (contact page) - MERGED VERSION
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwkxjrGneo6p-HO-TQ0DXgGJfAK1U5fPQEj0qifnqfnwneyeWlptXNfBg_DA8lEhMub/exec";

async function handleFormSubmit(event) {
  event.preventDefault();

  // Validate all fields FIRST
  const nameValid = validateField("name", validateName);
  const emailValid = validateField("email", validateEmail);
  const roleValid = validateField("role", validateRole);
  const messageValid = validateField("message", validateMessage);

  // If any field is invalid, stop submission
  if (!nameValid || !emailValid || !roleValid || !messageValid) {
    // Scroll to first error
    const firstError = document.querySelector(".border-red-500");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }
    return;
  }

  // All validations passed - prepare form data
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;
  const message = document.getElementById("message").value.trim();
  const resumeInput = document.getElementById("resume");
  const resumeFile = resumeInput.files[0];

  // Prepare form data
  const formData = {
    name,
    email,
    role,
    message,
    resume: resumeFile ? resumeFile.name : null,
  };

  // Show loading state (optional - you can add a loading spinner)
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    // Prepare form data as JSON (matching Google Apps Script expectation)
    const formData = {
      name,
      email,
      role,
      message,
      resume: resumeFile ? resumeFile.name : null,
    };

    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Get response text and parse as JSON
    const responseText = await res.text();
    console.log("Response:", responseText); // Debug log

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response:", e);
      throw new Error("Invalid response from server");
    }

    if (result.success) {
      // Show success modal
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

      // Reset form after successful submission
      document.querySelector("form").reset();
      // Clear any resume preview
      const resumePreview = document.getElementById("resumePreview");
      const resumeLabel = document.getElementById("resumeLabel");
      if (resumePreview) resumePreview.classList.add("hidden");
      if (resumeLabel)
        resumeLabel.textContent =
          "Click to upload your resume (PDF, DOC, DOCX)";

      // Reset character counter
      const counter = document.getElementById("messageCounter");
      if (counter) counter.textContent = "0";
    } else {
      // Show error modal with server message
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
      modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center card-modern">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">Submission Failed</h3>
          <p class="text-gray-600 mb-6">${
            result.message ||
            "Could not submit the form. Please try again later."
          }</p>
          <button onclick="document.body.removeChild(this.closest('.fixed'))" class="btn-primary">Close</button>
        </div>`;
      document.body.appendChild(modal);
    }
  } catch (err) {
    console.error("Submission failed", err);
    // Show network error modal with more details
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center card-modern">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 class="text-2xl font-bold mb-4">Network Error</h3>
        <p class="text-gray-600 mb-6">Please check your internet connection and try again later.</p>
        <p class="text-sm text-gray-500 mb-4">Error: ${err.message}</p>
        <button onclick="document.body.removeChild(this.closest('.fixed'))" class="btn-primary">Close</button>
      </div>`;
    document.body.appendChild(modal);
  } finally {
    // Restore button state
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
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

  // Contact form real-time validation
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const roleField = document.getElementById("role");
  const messageField = document.getElementById("message");

  if (nameField) {
    nameField.addEventListener("blur", () =>
      validateField("name", validateName)
    );
    nameField.addEventListener("input", () => {
      if (nameField.classList.contains("border-red-500")) {
        validateField("name", validateName);
      }
    });
  }

  if (emailField) {
    emailField.addEventListener("blur", () =>
      validateField("email", validateEmail)
    );
    emailField.addEventListener("input", () => {
      if (emailField.classList.contains("border-red-500")) {
        validateField("email", validateEmail);
      }
    });
  }

  if (roleField) {
    roleField.addEventListener("change", () =>
      validateField("role", validateRole)
    );
  }

  if (messageField) {
    // Initialize character counter
    const counter = document.getElementById("messageCounter");
    if (counter) {
      counter.textContent = messageField.value.length;
    }

    messageField.addEventListener("blur", () =>
      validateField("message", validateMessage)
    );
    messageField.addEventListener("input", () => {
      if (messageField.classList.contains("border-red-500")) {
        validateField("message", validateMessage);
      }
      // Update character counter
      if (counter) {
        counter.textContent = messageField.value.length;
      }
    });
  }

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
