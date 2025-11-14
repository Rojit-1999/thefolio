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

// Form submission (contact page)
// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_9c7ldam";
const EMAILJS_TEMPLATE_ID = "template_atts1oq";

// Google Apps Script URL (optional - for saving to Google Sheets)
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwkxjrGneo6p-HO-TQ0DXgGJfAK1U5fPQEj0qifnqfnwneyeWlptXNfBg_DA8lEhMub/exec";

// Track form submission state to prevent double submissions
let isSubmitting = false;

// Optional function to save form data to Google Sheets
async function saveToGoogleSheets(name, email, role, message, resumeFile) {
  try {
    // Create FormData for Google Apps Script
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("message", message);
    formData.append(
      "resumeFileName",
      resumeFile ? resumeFile.name : "No resume"
    );
    formData.append("timestamp", new Date().toISOString());

    // Use fetch to submit to Google Apps Script
    // Note: This requires your Google Apps Script to be deployed as a web app
    // and allow "Anyone" or "Anyone with Google account" to execute it
    const response = await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors", // Required for Google Apps Script
      body: formData,
    });

    // Note: With no-cors mode, we can't read the response
    // But the data should still be saved to Sheets
    console.log("Data sent to Google Sheets");
    return response;
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    throw error;
  }
}

// Helper function to create and show modal
function createModal(type, message, errorDetails = null) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  let modalContent = "";
  if (type === "success") {
    modalContent = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center card-modern">
        <div class="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-2xl font-bold mb-4">Message Sent!</h3>
        <p class="text-gray-600 mb-6 leading-relaxed">${message}</p>
        <button class="btn-primary modal-close-btn">Continue</button>
      </div>`;
  } else if (type === "error") {
    modalContent = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center card-modern">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 class="text-2xl font-bold mb-4">Network Error</h3>
        <p class="text-gray-600 mb-6">${message}</p>
        ${
          errorDetails
            ? `<p class="text-sm text-gray-500 mb-4">Error: ${errorDetails}</p>`
            : ""
        }
        <button class="btn-primary modal-close-btn">Close</button>
      </div>`;
  }

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);

  // Close modal on button click
  const closeBtn = modal.querySelector(".modal-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
  }

  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }
  });

  // Close modal on Escape key
  const escapeHandler = (e) => {
    if (e.key === "Escape" && modal.parentNode) {
      modal.parentNode.removeChild(modal);
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  return modal;
}

// Helper function to reset form
function resetForm() {
  const form = document.querySelector("form");
  if (form) {
    form.reset();
  }
  // Clear any resume preview
  const resumePreview = document.getElementById("resumePreview");
  const resumeLabel = document.getElementById("resumeLabel");
  if (resumePreview) resumePreview.classList.add("hidden");
  if (resumeLabel) {
    resumeLabel.textContent = "Click to upload your resume (PDF, DOC, DOCX)";
  }
  // Reset character counter
  const counter = document.getElementById("messageCounter");
  if (counter) counter.textContent = "0";
  // Clear any field errors
  document.querySelectorAll(".field-error").forEach((el) => el.remove());
  document.querySelectorAll(".border-red-500").forEach((el) => {
    el.classList.remove("border-red-500");
    el.classList.add("border-gray-300");
  });
}

// Validate resume file
function validateResumeFile(file) {
  if (!file) return { valid: true, message: "" }; // Resume is optional

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, message: "File size must be less than 10MB" };
  }

  // Check file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const fileName = file.name.toLowerCase();

  const isValidType =
    allowedTypes.includes(file.type) ||
    allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!isValidType) {
    return { valid: false, message: "Please upload a PDF, DOC, or DOCX file" };
  }

  return { valid: true, message: "" };
}
function validateWebDesign(value) {
  if (!value || value.trim() === "") {
    return { valid: false, message: "Please select a website design type" };
  }
  return { valid: true, message: "" };
}

async function handleFormSubmit(event) {
  event.preventDefault();

  // Prevent multiple submissions
  if (isSubmitting) return;

  // Validate fields
  const nameValid = validateField("name", validateName);
  const emailValid = validateField("email", validateEmail);
  const webDesignValid = validateField("web_design", validateWebDesign);
  const roleValid = validateField("role", validateRole);
  const messageValid = validateField("message", validateMessage);

  // Resume file validation
  const resumeInput = document.getElementById("resume");
  const resumeFile = resumeInput ? resumeInput.files[0] : null;
  const resumeValidation = validateResumeFile(resumeFile);

  if (!resumeValidation.valid) {
    showUploadError(resumeValidation.message);
    const firstError = document.querySelector(".border-red-500");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }
    return;
  }

  // Stop if any validation fails
  if (
    !nameValid ||
    !emailValid ||
    !webDesignValid ||
    !roleValid ||
    !messageValid
  ) {
    const firstError = document.querySelector(".border-red-500");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }
    return;
  }

  // Submit button state
  const submitButton = event.target.querySelector('button[type="submit"]');
  if (!submitButton) {
    console.error("Submit button not found");
    return;
  }

  isSubmitting = true;
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  let successShown = false;

  try {
    const form = document.getElementById("contactForm");
    if (!form) throw new Error("Form not found");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const web_design = document.getElementById("web_design").value;
    const role = document.getElementById("role").value;
    const message = document.getElementById("message").value.trim();

    // Ensure emailjs exists
    if (typeof emailjs === "undefined") {
      throw new Error("EmailJS is not loaded.");
    }

    // Create hidden field to_name if not present
    let toNameField = form.querySelector('input[name="to_name"]');
    if (!toNameField) {
      toNameField = document.createElement("input");
      toNameField.type = "hidden";
      toNameField.name = "to_name";
      toNameField.value = "The Folio Studio";
      form.appendChild(toNameField);
    }

    const handleSuccess = () => {
      if (successShown) return;
      successShown = true;

      createModal(
        "success",
        "Thanks for reaching out! We'll get back to you within 24 hours to discuss your portfolio vision and next steps."
      );

      resetForm();

      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      isSubmitting = false;
    };

    const handleError = (errorMessage) => {
      console.error("EmailJS Error:", errorMessage);

      createModal(
        "error",
        "Failed to send your message. Please try again or contact us directly.",
        typeof errorMessage === "string"
          ? errorMessage
          : errorMessage.text || "Unknown error"
      );

      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      isSubmitting = false;
    };

    // Send Email
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form).then(
      (response) => {
        console.log("Email sent successfully!", response.status, response.text);

        // Google Sheets save (non-blocking)
        saveToGoogleSheets(name, email, role, message, resumeFile).catch(
          (err) => {
            console.warn("Sheets save failed:", err);
          }
        );

        handleSuccess();
      },
      (error) => {
        const msg = error.text || error.message || "Unknown error";
        handleError(msg);
      }
    );
  } catch (err) {
    console.error("Submission failed:", err);

    createModal(
      "error",
      "Please check your internet connection and try again later.",
      err.message
    );

    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    isSubmitting = false;
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
    // Use centralized validation function
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      showUploadError(validation.message);
      input.value = "";
      return;
    }

    // Show file preview
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    const fileNameEl = document.getElementById("resumeFileName");
    const previewEl = document.getElementById("resumePreview");
    const labelEl = document.getElementById("resumeLabel");
    if (fileNameEl) fileNameEl.textContent = `${fileName} (${fileSize} MB)`;
    if (previewEl) previewEl.classList.remove("hidden");
    if (labelEl) labelEl.textContent = "Resume uploaded successfully";

    // Clear any previous upload errors
    const errorDiv = input.closest("div")?.querySelector(".mt-2.p-3.bg-red-50");
    if (errorDiv) {
      errorDiv.remove();
    }
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
const totalTestimonials = 5;
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

// Touch handlers - separate variables for each slider to prevent conflicts
let testimonialTouchStartX = 0;
let testimonialTouchEndX = 0;
let isTestimonialSwiping = false;

function handleTestimonialTouchStart(e) {
  testimonialTouchStartX = e.changedTouches[0].screenX;
  isTestimonialSwiping = true;
  stopTestimonialAutoplay();
}

function handleTestimonialTouchEnd(e) {
  if (!isTestimonialSwiping) return;
  testimonialTouchEndX = e.changedTouches[0].screenX;
  const swipeThreshold = 50;
  const swipeDistance = testimonialTouchStartX - testimonialTouchEndX;
  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) nextTestimonial();
    else previousTestimonial();
  }
  isTestimonialSwiping = false;
  startTestimonialAutoplay();
}

// Separate variables for pricing testimonial slider
let pricingTestimonialTouchStartX = 0;
let pricingTestimonialTouchEndX = 0;

function handlePricingTestimonialTouchStart(e) {
  pricingTestimonialTouchStartX = e.changedTouches[0].screenX;
}

function handlePricingTestimonialTouchEnd(e) {
  pricingTestimonialTouchEndX = e.changedTouches[0].screenX;
  const swipeThreshold = 50;
  const swipeDistance =
    pricingTestimonialTouchStartX - pricingTestimonialTouchEndX;
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
