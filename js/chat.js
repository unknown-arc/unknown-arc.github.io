// Chat widget UI — accordion panel, message thread, prompt chips.
// Note: the original site calls a hosted AI backend (TACOS). This static rebuild
// keeps 100% of the UI/animation but answers locally from the portfolio data,
// so it works with no server. Swap `getBotReply` for a real fetch() call if you
// stand the backend back up.
(function () {
  const ALL_PROMPTS = [
    "Tell me about Ankit's experience",
    "What projects has Ankit worked on?",
    "What technologies does Ankit use?",
    "What is Ankit's current role?",
    "Tell me about Ankit's skills",
    "What companies has Ankit worked at?",
    "What is Ankit currently working on?",
    "What kind of developer is Ankit?",
    "What problems does Ankit like solving?",
    "What areas is Ankit strongest in?",
    "What is Ankit focusing on learning now?",
    "Which project best represents Ankit's work?",
    "What was the motivation behind Ankit's projects?",
    "What has Ankit built outside of work?",
    "How does Ankit approach system design?",
    "What does Ankit care about in clean architecture?",
    "How does Ankit balance speed vs correctness?",
    "What engineering principles does Ankit follow?",
    "What tradeoffs does Ankit often discuss?",
    "What can you help me with?",
    "Where should I start if I want to explore Ankit's work?",
    "What should I read to understand Ankit's thinking?",
    "Is Ankit more backend or frontend focused?",
    "How can I contact Ankit?",
  ];

  function pickRandom(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  function getBotReply(text) {
    const q = text.toLowerCase();
    const D = window.SITE_DATA;

    if (/(contact|email|reach|hire)/.test(q)) {
      return "You can reach Ankit at [ankitkumarsingh.in@gmail.com](mailto:ankitkumarsingh.in@gmail.com), through the [contact form](contact.html), or on [LinkedIn](https://www.linkedin.com/in/ankitkumarsingh-in/).";
    }
    if (/(project|built|build|portfolio)/.test(q)) {
      const names = D.projects.map((p) => p.name).join(", ");
      return `Ankit's built **${names}**, plus a few other Python projects. Check out the [projects page](projects.html) for details.`;
    }
    if (/(experience|work|company|role|current)/.test(q)) {
      const current = D.career[0];
      return `Ankit is currently working as a **${current.positions[0].title}** (since ${current.positions[0].start}). Before that, he worked as a **Python Developer**, building automation scripts and small tools — see the Work tab on the homepage for the full timeline.`;
    }
    if (/(education|school|study|degree|university)/.test(q)) {
      const edu = D.education[0];
      return `Ankit is studying **${edu.positions[0].title}** at [${edu.name}](${edu.href}), since ${edu.positions[0].start}.`;
    }
    if (/(tech|stack|skill|language|framework)/.test(q)) {
      return "Ankit works mainly with **Python** (Pandas, NumPy), **SQL**, and data visualization tools like **Power BI**, alongside general-purpose Python development.";
    }
    if (/(backend|frontend|full[\s-]?stack|data)/.test(q)) {
      return "Data Analyst by profession, Python developer at heart — Ankit enjoys turning raw data into clear, actionable insights.";
    }
    return "Thanks for the question! This static rebuild answers from local portfolio data rather than a live AI backend, so I might not have a great answer for that — try asking about Ankit's experience, projects, or how to get in touch.";
  }

  function initChat() {
    const root = document.getElementById("chat-root");
    if (!root) return;

    root.innerHTML = `
      <div class="chat-panel" id="chat-panel">
        <button class="chat-trigger" id="chat-trigger" type="button" aria-expanded="false">
          <span class="chat-bot-icon" aria-hidden="true">
            ${window.SiteRender.icon("bot", "chat-bot-svg")}
          </span>
          <span class="chat-trigger-content">
            <span class="chat-trigger-copy">
              <p class="small">Chat with</p>
              <span class="status"><span class="dot"></span><span class="who">Ankit's Assistant</span></span>
            </span>
          </span>
          <span class="chat-trigger-arrow">
            ${window.SiteRender.icon("chevron-down", "chat-chevron")}
          </span>
        </button>
        <div class="chat-body">
          <div class="chat-messages" id="chat-messages"></div>
          <form class="chat-input-form" id="chat-form">
            <button type="button" class="btn btn-outline trash" id="chat-clear" title="Clear chat" disabled>
              ${window.SiteRender.icon("trash", "size-4")}
            </button>
            <input class="input" id="chat-input" placeholder="Ask something..." autocomplete="off" />
            <button type="submit" class="btn btn-default" id="chat-send" title="Send message" disabled>
              ${window.SiteRender.icon("send-horizontal", "size-4")}
            </button>
          </form>
        </div>
      </div>`;

    const panel = document.getElementById("chat-panel");
    const trigger = document.getElementById("chat-trigger");
    const messagesEl = document.getElementById("chat-messages");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    const clearBtn = document.getElementById("chat-clear");

    let messages = [];
    let opened = false;

    function setOpen(isOpen) {
      panel.classList.toggle("open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      if (isOpen && !opened) {
        opened = true;
        renderMessages();
      }
    }

    trigger.addEventListener("click", () => {
      setOpen(!panel.classList.contains("open"));
    });

    // Public API so other parts of the page (e.g. the "Ankit's Assistant"
    // link in the hero) can open the widget programmatically.
    window.ArcChat = {
      open() {
        setOpen(true);
        input.focus();
      },
      close() {
        setOpen(false);
      },
    };

    input.addEventListener("input", () => {
      sendBtn.disabled = input.value.length === 0;
    });

    clearBtn.addEventListener("click", () => {
      messages = [];
      renderMessages();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      messages.push({ role: "user", content: text });
      input.value = "";
      sendBtn.disabled = true;
      renderMessages();
      showThinking();

      setTimeout(() => {
        hideThinking();
        messages.push({ role: "assistant", content: getBotReply(text) });
        renderMessages();
      }, 500 + Math.random() * 400);
    });

    function mdToHtml(text) {
      let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return `<p>${html}</p>`;
    }

    function renderMessages() {
      clearBtn.disabled = messages.length === 0;

      if (messages.length === 0) {
        const prompts = pickRandom(ALL_PROMPTS, 3);
        messagesEl.innerHTML = `
          <div class="chat-empty">
            ${window.SiteRender.icon("bot", "bot-big")}
            <p class="hint">Send a message to start the chat!</p>
            <p class="desc">You can ask the bot anything about me and it will help to find the relevant information!</p>
            <div class="chat-prompts">
              <p class="lead">Try asking:</p>
              <div style="display:flex;flex-direction:column;gap:.375rem">
                ${prompts
                  .map(
                    (p) =>
                      `<button type="button" class="btn btn-outline btn-sm chat-prompt-btn" data-prompt="${p.replace(/"/g, "&quot;")}"><span>${p}</span></button>`,
                  )
                  .join("")}
              </div>
            </div>
            <p class="chat-powered">Powered by local data (no live backend in this static build)</p>
          </div>`;
        messagesEl.querySelectorAll(".chat-prompt-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            input.value = btn.dataset.prompt;
            sendBtn.disabled = false;
            input.focus();
          });
        });
      } else {
        messagesEl.innerHTML = `<ul>${messages
          .map((m) => {
            const isBot = m.role === "assistant";
            return `<li><div class="chat-msg ${isBot ? "bot" : "user"}">
              ${isBot ? window.SiteRender.icon("bot", "bot-icon") : ""}
              <div class="chat-bubble">${mdToHtml(m.content)}</div>
            </div></li>`;
          })
          .join("")}</ul><div id="chat-thinking-slot"></div>`;
      }

      if (window.lucide) window.lucide.createIcons({ nodes: [messagesEl] });
      messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
    }

    function showThinking() {
      const slot = document.getElementById("chat-thinking-slot");
      if (!slot) return;
      slot.innerHTML = `<div class="chat-thinking">${window.SiteRender.icon("loader-2", "")}<p>Thinking...</p></div>`;
      if (window.lucide) window.lucide.createIcons({ nodes: [slot] });
      messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
    }
    function hideThinking() {
      const slot = document.getElementById("chat-thinking-slot");
      if (slot) slot.innerHTML = "";
    }

    // header toggle (show/hide entire widget)
    const chatToggleBtn = document.getElementById("chat-toggle-btn");
    if (chatToggleBtn) {
      let visible = true;
      chatToggleBtn.addEventListener("click", () => {
        visible = !visible;
        panel.style.display = visible ? "" : "none";
        chatToggleBtn.innerHTML = visible
          ? window.SiteRender.icon("bot", "size-5") + '<span class="sr-only">Chat Toggle</span>'
          : window.SiteRender.icon("bot-off", "size-5") + '<span class="sr-only">Chat Toggle</span>';
        if (window.lucide) window.lucide.createIcons({ nodes: [chatToggleBtn] });
      });
    }
  }

  window.initChat = initChat;
})();
