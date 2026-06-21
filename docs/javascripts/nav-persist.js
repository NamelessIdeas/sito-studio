// Mantiene aperti nella barra laterale SOLO i rami che l'utente ha aperto,
// invece di richiuderli a ogni cambio pagina (la instant navigation di Material
// rigenera la sidebar) e senza tenerli tutti aperti (come farebbe
// navigation.expand). Lo stato è salvato in sessionStorage del browser: nessuna
// richiesta a terzi e nessun cookie (compatibile con i vincoli GDPR del sito).

(function () {
  "use strict";

  var KEY = "nav-expanded";

  function load() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function save(ids) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(ids));
    } catch (e) {
      /* sessionStorage non disponibile: la funzione si limita a non persistere */
    }
  }

  function apply() {
    var open = load();
    var toggles = document.querySelectorAll(".md-nav__toggle");

    Array.prototype.forEach.call(toggles, function (cb) {
      // Salta il toggle della table of contents (non è un ramo del menu).
      if (!cb.id || cb.id === "__toc") return;

      // Ripristina i rami che l'utente aveva aperto in precedenza.
      if (open.indexOf(cb.id) !== -1) cb.checked = true;

      // Registra le aperture/chiusure manuali successive.
      cb.addEventListener("change", function () {
        var ids = load();
        var i = ids.indexOf(cb.id);
        if (cb.checked && i === -1) ids.push(cb.id);
        else if (!cb.checked && i !== -1) ids.splice(i, 1);
        save(ids);
      });
    });
  }

  // Material espone l'observable document$ che emette il documento dopo ogni
  // navigazione "instant"; in sua assenza si ricade su DOMContentLoaded.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(apply);
  } else {
    document.addEventListener("DOMContentLoaded", apply);
  }
})();
