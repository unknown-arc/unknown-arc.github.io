// Vanilla re-implementation of the framer-motion <SwipeCards /> component.
// Drag with pointer events, spring back on release, swipe-away past threshold,
// rotation/opacity tied to drag offset, stacked depth scaling, and a reset button.
(function () {
  const CARD_DATA = [
    { id: 1, url: "img/ankit-1.jpg" },
    { id: 2, url: "img/ankit-2.jpg" },
    { id: 3, url: "img/ankit-3.jpg" },
    { id: 4, url: "img/ankit-4.jpg" },
  ];

  function initSwipeCards(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    let cards = CARD_DATA.slice();

    function render() {
      mount.innerHTML = "";

      if (cards.length === 0) {
        const wrap = document.createElement("div");
        wrap.className = "swipe-again show";
        wrap.style.gridRow = "1";
        wrap.style.gridColumn = "1";
        const btn = document.createElement("button");
        btn.className = "btn btn-outline";
        btn.type = "button";
        btn.innerHTML = window.SiteRender.icon("refresh-cw", "size-4") + "<span>Again</span>";
        btn.addEventListener("click", () => {
          cards = CARD_DATA.slice();
          render();
        });
        wrap.appendChild(btn);
        mount.appendChild(wrap);
        if (window.lucide) window.lucide.createIcons({ nodes: [wrap] });
        return;
      }

      cards.forEach((card, index) => {
        const depth = cards.length - 1 - index;
        const isFront = index === cards.length - 1;
        buildCard(card, depth, isFront);
      });
    }

    function buildCard(card, depth, isFront) {
      const el = document.createElement("div");
      el.className = "swipe-card" + (isFront ? " front" : "");
      el.dataset.id = card.id;

      const skeleton = document.createElement("div");
      skeleton.className = "skeleton";
      el.appendChild(skeleton);

      const img = document.createElement("img");
      img.src = card.url;
      img.alt = isFront ? "Ankit Kumar Singh" : "";
      img.draggable = false;
      img.loading = isFront ? "eager" : "lazy";
      img.addEventListener("load", () => skeleton.remove());
      el.appendChild(img);

      const staticOffset = card.id % 2 ? 6 : -6;
      const baseRotate = isFront ? 0 : staticOffset;
      const scale = isFront ? 1 : Math.max(0.85, 0.94 - depth * 0.04);

      let x = 0;
      let rotate = baseRotate;
      applyTransform(el, x, rotate, scale, 1);

      mount.appendChild(el);

      if (!isFront) return;

      // ---- drag handling (front card only) ----
      let dragging = false;
      let startX = 0;
      let pointerId = null;
      let rafId = null;

      function applyDragFrame() {
        rotate = baseRotate + clamp(x, -150, 150) * (18 / 150);
        const opacity = 1 - Math.min(1, Math.abs(x) / 100);
        applyTransform(el, x, rotate, scale, opacity);
      }

      function onPointerDown(e) {
        dragging = true;
        pointerId = e.pointerId;
        el.setPointerCapture(pointerId);
        startX = e.clientX - x;
        el.style.transition = "none";
      }

      function onPointerMove(e) {
        if (!dragging) return;
        x = e.clientX - startX;
        applyDragFrame();
      }

      function onPointerUp() {
        if (!dragging) return;
        dragging = false;
        el.style.transition = "";

        if (Math.abs(x) > 100) {
          const dir = x > 0 ? 1 : -1;
          el.style.transition = "transform .35s cubic-bezier(.2,.8,.2,1), opacity .35s ease";
          applyTransform(el, dir * 400, rotate + dir * 20, scale, 0);
          setTimeout(() => {
            cards = cards.filter((c) => c.id !== card.id);
            render();
          }, 220);
        } else {
          springBack();
        }
      }

      function springBack() {
        cancelAnimationFrame(rafId);
        const stiffness = 0.18;
        const damping = 0.72;
        let vx = 0;
        function step() {
          const force = -x * stiffness;
          vx = (vx + force) * damping;
          x += vx;
          rotate = baseRotate + clamp(x, -150, 150) * (18 / 150);
          applyTransform(el, x, rotate, scale, 1);
          if (Math.abs(x) > 0.5 || Math.abs(vx) > 0.5) {
            rafId = requestAnimationFrame(step);
          } else {
            x = 0;
            applyTransform(el, 0, baseRotate, scale, 1);
          }
        }
        rafId = requestAnimationFrame(step);
      }

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
    }

    function applyTransform(el, x, rotateDeg, scale, opacity) {
      el.style.transform = `translateX(${x}px) rotate(${rotateDeg}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    render();
  }

  window.initSwipeCards = initSwipeCards;
})();
