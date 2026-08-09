// Contact form — client-side validation mirrors the Zod schema, confirm dialog,
// toast feedback. No backend in this static rebuild, so the final "send" opens
// a pre-filled mailto: to ankitkumarsingh.in@gmail.com (swap `submitMessage` for a real
// fetch() call if you wire up a form backend / serverless function).
(function () {
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput = document.getElementById("cf-name");
    const emailInput = document.getElementById("cf-email");
    const messageInput = document.getElementById("cf-message");
    const honeypot = document.getElementById("cf-website");
    const submitBtn = document.getElementById("cf-submit");

    const overlay = document.getElementById("confirm-overlay");
    const confirmEmail = document.getElementById("confirm-email");
    const confirmCancel = document.getElementById("confirm-cancel");
    const confirmSend = document.getElementById("confirm-send");

    let pendingData = null;

    function setError(input, message) {
      clearError(input);
      if (!message) return;
      const p = document.createElement("p");
      p.className = "input-error";
      p.textContent = message;
      p.dataset.errorFor = input.id;
      input.closest(".field").appendChild(p);
    }
    function clearError(input) {
      const existing = input.closest(".field").querySelector(`[data-error-for="${input.id}"]`);
      if (existing) existing.remove();
    }

    function validate() {
      let valid = true;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name) {
        setError(nameInput, "Name is required.");
        valid = false;
      } else if (name.length < 2) {
        setError(nameInput, "Must be at least 2 characters.");
        valid = false;
      } else clearError(nameInput);

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        setError(emailInput, "Email is required.");
        valid = false;
      } else if (!emailRe.test(email)) {
        setError(emailInput, "Invalid email.");
        valid = false;
      } else clearError(emailInput);

      if (!message) {
        setError(messageInput, "Message is required.");
        valid = false;
      } else clearError(messageInput);

      return valid;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (honeypot.value) {
        showToast("error", "Something went wrong. Please try again.");
        return;
      }
      if (!validate()) return;

      pendingData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
      };
      confirmEmail.textContent = pendingData.email;
      overlay.classList.add("show");
    });

    confirmCancel.addEventListener("click", () => {
      overlay.classList.remove("show");
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("show");
    });

    confirmSend.addEventListener("click", async () => {
      if (!pendingData) return;
      overlay.classList.remove("show");

      submitBtn.disabled = true;
      confirmSend.disabled = true;
      const originalHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = `<div style="display:flex;align-items:center"><span>Sending...</span></div>`;

      await submitMessage(pendingData);

      submitBtn.disabled = false;
      confirmSend.disabled = false;
      submitBtn.innerHTML = originalHtml;
      form.reset();
      pendingData = null;
    });

    async function submitMessage(data) {
      // No live backend in this static build — fall back to opening the user's
      // mail client with the message pre-filled, then confirm success.
      const subject = encodeURIComponent(`Message from ${data.name} via the portfolio site`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.open(`mailto:ankitkumarsingh.in@gmail.com?subject=${subject}&body=${body}`, "_blank");
      showToast("success", "Message sent successfully!");
    }

    function showToast(type, message) {
      let toaster = document.getElementById("toaster");
      if (!toaster) {
        toaster = document.createElement("div");
        toaster.id = "toaster";
        toaster.className = "toaster";
        document.body.appendChild(toaster);
      }
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerHTML = `${window.SiteRender.icon(type === "success" ? "check-circle-2" : "x-circle", "")}<span>${message}</span>`;
      toaster.appendChild(toast);
      if (window.lucide) window.lucide.createIcons({ nodes: [toast] });
      setTimeout(() => {
        toast.style.transition = "opacity .2s ease";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 200);
      }, 3500);
    }
  }

  window.initContactForm = initContactForm;
})();
