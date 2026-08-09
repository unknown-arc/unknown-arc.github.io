// Shared render helpers — build DOM from SITE_DATA, mirroring the React components 1:1
(function () {
  const D = window.SITE_DATA;

  // Authentic brand marks (not generic outline icons) for GitHub & LinkedIn,
  // inlined so they work offline and always match the current text color.
  const BRAND_ICONS = {
  github:
    '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M29.3444 30.4767C31.7481 29.9771 33.9292 29.1109 35.6247 27.8393C38.5202 25.6677 40 22.3137 40 19C40 16.6754 39.1187 14.5051 37.5929 12.6669C36.7427 11.6426 39.2295 4.00001 37.02 5.02931C34.8105 6.05861 31.5708 8.33691 29.8726 7.8341C28.0545 7.29577 26.0733 7.00001 24 7.00001C22.1992 7.00001 20.4679 7.22313 18.8526 7.63452C16.5046 8.23249 14.2591 6.00001 12 5.02931C9.74086 4.05861 10.9736 11.9633 10.3026 12.7946C8.84119 14.6052 8 16.7289 8 19C8 22.3137 9.79086 25.6677 12.6863 27.8393C14.6151 29.2858 17.034 30.2077 19.7401 30.6621" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M19.7402 30.662C18.5817 31.9372 18.0024 33.148 18.0024 34.2946C18.0024 35.4411 18.0024 38.3465 18.0024 43.0108" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M29.3443 30.4767C30.4421 31.9175 30.991 33.2112 30.991 34.3577C30.991 35.5043 30.991 38.3886 30.991 43.0108" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M6 31.2156C6.89887 31.3255 7.56554 31.7388 8 32.4555C8.65169 33.5304 11.0742 37.5181 13.8251 37.5181C15.6591 37.5181 17.0515 37.5181 18.0024 37.5181" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',

  linkedin:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 22V15C18 13.8954 17.1046 13 16 13C14.8954 13 14 13.8954 14 15V22H10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 22V15C10 11.6863 12.6863 9 16 9C19.3137 9 22 11.6863 22 15V22H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="9" width="4" height="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5" cy="4" r="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

  function icon(name, cls) {
    if (BRAND_ICONS[name]) {
      // wrap so the class + sizing behaves exactly like a lucide icon
      const wrapperClass = `icon-brand ${cls || ""}`.trim();
      return `<span class="${wrapperClass}" aria-hidden="true">${BRAND_ICONS[name]}</span>`;
    }
    return `<i data-lucide="${name}" class="${cls || "mono-icon"}"></i>`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  // ---------- Header ----------
  function renderHeader(activePage) {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const navLinks = D.routes.filter((r) => r.showInNav);
    const items = navLinks
      .map((nav) => {
        const isActive = nav.path === activePage;
        return `<li class="link"><a href="${nav.path}" title="${escapeHtml(nav.description)}" class="${isActive ? "active" : ""}">${nav.name}</a></li>`;
      })
      .join("");

    mount.innerHTML = `
      <div class="wrap">
        <nav class="main-nav">
          <ul>${items}</ul>
          <div class="nav-actions">
            <button id="chat-toggle-btn" class="btn btn-icon btn-ghost" type="button" title="Chat Toggle">
              ${icon("bot", "size-5")}
              <span class="sr-only">Chat Toggle</span>
            </button>
            <button id="theme-toggle-btn" class="btn btn-icon btn-ghost" type="button" title="Theme Toggle">
              ${icon("moon", "size-4")}
              <span class="sr-only">Theme Toggle</span>
            </button>
          </div>
        </nav>
      </div>`;
  }

  // ---------- Footer ----------
  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const year = new Date().getFullYear();
    mount.innerHTML = `
      <div class="wrap">
        ${renderSocialsHtml()}
        <section class="footer-copy">
          <p>&copy; ${year} <a class="link" href="index.html">Ankit Kumar Singh</a> | <a class="link" href="privacy.html" style="font-weight:700">privacy?</a></p>
        </section>
      </div>`;
  }

  // ---------- Socials ----------
  function renderSocialsHtml() {
    const items = D.socials
      .map(
        (s) => `<a href="${s.href}" target="_blank" rel="noopener noreferrer" class="social-link" title="${s.name}">
          <span class="sr-only">${s.name}</span>
          ${icon(s.icon, "size-5")}
        </a>`,
      )
      .join("");
    return `<section class="socials">${items}</section>`;
  }

  function renderSocials(mountId) {
    const mount = document.getElementById(mountId);
    if (mount) mount.innerHTML = renderSocialsHtml();
  }

  // ---------- Experience (tabs + timeline) ----------
  function timelinePositionHtml(pos) {
    const desc =
      pos.description && pos.description.length
        ? `<ul class="pos-desc">${pos.description.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>`
        : "";
    const links =
      pos.links && pos.links.length
        ? `<div class="pos-links">${pos.links
            .map(
              (l) => `<a href="${l.href}" target="_blank" rel="noreferrer"><span class="badge badge-default" title="${l.name}">${icon(l.icon, "")}${l.name}</span></a>`,
            )
            .join("")}</div>`
        : "";
    return `<div class="timeline-position">
      <div class="pos-row">
        <p class="pos-title">${escapeHtml(pos.title)}</p>
        <time class="pos-time"><span>${pos.start}</span><span> - </span><span>${pos.end ?? "Present"}</span></time>
      </div>
      ${desc}
      ${links}
    </div>`;
  }

  function timelineItemHtml(exp) {
    return `<li class="timeline-item">
      <a href="${exp.href}" target="_blank" rel="noreferrer" class="timeline-logo">
        <span class="avatar"><img src="${exp.logo}" alt="${escapeHtml(exp.name)}" loading="lazy" decoding="async" onerror="this.style.display='none'"></span>
      </a>
      <div class="timeline-body">
        <a href="${exp.href}" target="_blank" rel="noreferrer" style="width:fit-content"><h2>${escapeHtml(exp.name)}</h2></a>
        <div class="timeline-positions">
          ${exp.positions.map(timelinePositionHtml).join("")}
        </div>
      </div>
    </li>`;
  }

  function timelineHtml(experience) {
    return `<div class="card"><div><ul class="timeline-list">${experience.map(timelineItemHtml).join("")}</ul></div></div>`;
  }

  function renderExperience(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = `
      <div>
        <div class="tabs-list" role="tablist">
          <button class="tabs-trigger" data-tab="Experience" data-state="active" role="tab">Experience</button>
          <button class="tabs-trigger" data-tab="education" role="tab">Education</button>
        </div>
        <div class="tabs-content" data-tab-content="Experience" data-state="active">${timelineHtml(D.career)}</div>
        <div class="tabs-content" data-tab-content="education">${timelineHtml(D.education)}</div>
      </div>`;

    mount.querySelectorAll(".tabs-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        mount.querySelectorAll(".tabs-trigger").forEach((b) => b.removeAttribute("data-state"));
        mount.querySelectorAll(".tabs-content").forEach((c) => c.removeAttribute("data-state"));
        btn.setAttribute("data-state", "active");
        mount.querySelector(`[data-tab-content="${btn.dataset.tab}"]`).setAttribute("data-state", "active");
      });
    });
  }

  // ---------- Projects ----------
  function projectCardHtml(project) {
    const { name, href, description, image, tags, links } = project;
    const imageHtml = image
      ? `<div class="project-image-wrap"><a href="${href || image}"><span class="img-inner"><span class="skeleton" aria-hidden="true"></span><img src="${image}" alt="${escapeHtml(name)}" loading="lazy" onload="this.previousElementSibling.remove()"></span></a></div>`
      : "";
    const tagsHtml =
      tags && tags.length
        ? `<div class="project-tags">${[...tags].sort().map((t) => `<span class="badge badge-secondary badge-tag">${escapeHtml(t)}</span>`).join("")}</div>`
        : "";
    const linksHtml =
      links && links.length
        ? `<div class="project-links">${links
            .map(
              (l) => `<a href="${l.href}" target="_blank"><span class="badge badge-default badge-link">${icon(l.icon, "")}${l.name}</span></a>`,
            )
            .join("")}</div>`
        : "";

    return `<div class="card project-card">
      ${imageHtml}
      <div class="project-content">
        <h3 class="card-title">${escapeHtml(name)}</h3>
        <p class="project-desc">${escapeHtml(description)}</p>
      </div>
      <div class="project-footer">
        ${tagsHtml}
        ${linksHtml}
      </div>
    </div>`;
  }

  function renderProjects(mountId, limit) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    let projects = D.projects;
    if (limit) projects = projects.slice(0, limit);
    mount.innerHTML = projects.map(projectCardHtml).join("");
  }

  window.SiteRender = {
    icon,
    renderHeader,
    renderFooter,
    renderSocials,
    renderExperience,
    renderProjects,
  };
})();
