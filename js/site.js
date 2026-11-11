(function () {
  var tabs = document.querySelectorAll("[data-tab]");
  var panels = {
    whitepaper: document.getElementById("panel-whitepaper"),
    social: document.getElementById("panel-social")
  };

  function idFromHash(hash) {
    return hash === "#social" ? "social" : "whitepaper";
  }

  function show(id, push) {
    if (!panels[id]) id = "whitepaper";
    Object.keys(panels).forEach(function (key) {
      var on = key === id;
      panels[key].classList.toggle("is-active", on);
      panels[key].toggleAttribute("hidden", !on);
    });
    tabs.forEach(function (tab) {
      var on = tab.getAttribute("data-tab") === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (push) {
      var next = "#" + id;
      if (location.hash !== next) history.replaceState(null, "", next);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      show(tab.getAttribute("data-tab"), true);
      var bar = document.querySelector(".tabbar");
      if (bar) {
        var top = bar.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY > top) window.scrollTo(0, top);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    show(idFromHash(location.hash), false);
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  show(idFromHash(location.hash), true);
  window.scrollTo(0, 0);

  function copyFrom(btn) {
    var sel = btn.getAttribute("data-copy");
    var el = sel && document.querySelector(sel);
    if (!el) return;
    var text = (el.innerText || el.textContent || "").trim();
    var done = function () {
      var prev = btn.textContent;
      btn.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(function () {
        btn.textContent = prev;
        btn.classList.remove("is-copied");
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallback(text, done);
      });
    } else {
      fallback(text, done);
    }
  }

  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (btn) copyFrom(btn);
  });
})();
