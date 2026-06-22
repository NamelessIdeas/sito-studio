// Aiuti alla lettura per le pagine di studio. Tre funzioni, tutte locali (nessun
// CDN, nessun cookie: compatibili con i vincoli GDPR del sito):
//   1. barra di avanzamento della lettura in cima alla finestra;
//   2. stima del tempo di lettura ("~N min di lettura") sotto il titolo;
//   3. modalità "focus" (lettura senza distrazioni), con stato in sessionStorage.
//
// Material rigenera SOLO il contenuto a ogni instant navigation, mentre header e
// body restano: gli elementi persistenti (barra, pulsante) si creano una volta
// sola, mentre il tempo di lettura va ricalcolato a ogni pagina. Si usa
// l'observable document$ esposto da Material (fallback su DOMContentLoaded).

(function () {
  "use strict";

  var WPM = 200;                 // velocità di lettura media (parole al minuto)
  var FOCUS_KEY = "focus-reading";

  // ---- 1. Barra di avanzamento ------------------------------------------------
  var bar;
  function ensureBar() {
    if (bar && document.body.contains(bar)) return;
    bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
  }
  function updateProgress() {
    if (!bar) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
    if (ratio < 0) ratio = 0;
    else if (ratio > 1) ratio = 1;
    bar.style.width = (ratio * 100).toFixed(2) + "%";
  }
  // updateProgress legge scrollHeight/clientHeight/scrollTop e scrive subito la
  // width: chiamarla a ogni evento di scroll forza un reflow sincrono per frame.
  // La si batcha in un solo aggiornamento per frame con requestAnimationFrame.
  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      ticking = false;
    });
  }

  // ---- 2. Tempo di lettura ----------------------------------------------------
  function addReadingTime() {
    var content = document.querySelector(".md-content .md-typeset");
    // Niente stima sulla home (ha l'hero) o su pagine senza titolo.
    if (!content || content.querySelector(".home-hero")) return;
    var h1 = content.querySelector("h1");
    if (!h1 || content.querySelector(".reading-meta")) return;

    var words = (content.textContent || "").trim().split(/\s+/).filter(Boolean).length;
    if (words < 30) return;     // pagine-indice troppo corte: niente stima
    var minutes = Math.max(1, Math.round(words / WPM));

    var meta = document.createElement("p");
    meta.className = "reading-meta";
    meta.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm.5-13H11v6l5.2 3.1.8-1.3-4.5-2.7z"/></svg>' +
      "~" + minutes + " min di lettura";
    h1.insertAdjacentElement("afterend", meta);
  }

  // ---- 3. Modalità focus ------------------------------------------------------
  function readFocus() {
    try { return sessionStorage.getItem(FOCUS_KEY) === "1"; } catch (e) { return false; }
  }
  function saveFocus(on) {
    try { sessionStorage.setItem(FOCUS_KEY, on ? "1" : "0"); } catch (e) { /* no-op */ }
  }
  function applyFocus(on) {
    document.body.classList.toggle("focus-reading", on);
    if (toggle) toggle.setAttribute("aria-pressed", on ? "true" : "false");
  }
  var toggle;
  function ensureFocusToggle() {
    if (toggle && document.body.contains(toggle)) return;
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "focus-toggle";
    toggle.setAttribute("aria-label", "Modalità lettura (nascondi i menu laterali)");
    toggle.title = "Modalità lettura";
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 5c-1.9-.8-4-1-6-1s-4.1.2-6 1c-1.9-.8-4-1-6-1H2v15h1c2 0 4.1.2 6 1 1.9-.8 4-1 6-1s4.1.2 6 1h1V5h-1zM11 18.5c-1.6-.5-3.3-.7-5-.7H4V6c1.7 0 3.4.2 5 .7v11.8zm9-.7c-1.7 0-3.4.2-5 .7V6.7c1.6-.5 3.3-.7 5-.7v11.8z"/></svg>';
    toggle.addEventListener("click", function () {
      var on = !document.body.classList.contains("focus-reading");
      applyFocus(on);
      saveFocus(on);
    });
    document.body.appendChild(toggle);
  }

  // ---- Inizializzazione (una tantum + per-pagina) -----------------------------
  var scrollBound = false;
  var booted = false;
  function init() {
    ensureBar();
    ensureFocusToggle();
    applyFocus(readFocus());
    addReadingTime();
    updateProgress();
    if (!scrollBound) {
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize, { passive: true });
      scrollBound = true;
    }
    // Lascia finire la dissolvenza d'ingresso del primo render, poi marca il body
    // così le navigazioni instant successive non ri-animano (CSS: body.md-loaded).
    if (!booted) {
      booted = true;
      window.setTimeout(function () {
        document.body.classList.add("md-loaded");
      }, 400);
    }
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
