// Loaded only by /demo/ (the workbench embedded in the home page's Playground).
// Runs after workbench.js and before bootstrap.js.
//
// workbench.js assumes it owns the whole page and "minimizes" the editor back
// to a landing overview. Inside the iframe there is nothing to minimize to, so
// ask the parent page to collapse the demo instead.
(function () {
  if (window.parent === window) return;
  window.setEditorMinimizedState = function (minimized) {
    if (minimized) {
      window.parent.postMessage({ source: "nexql-demo", type: "close" }, window.location.origin);
    }
  };
})();

// ?tour=1 starts the guided tour once the workbench has booted (the parent's
// "Take the guided tour" button opens the demo this way).
(function () {
  if (new URLSearchParams(window.location.search).get("tour") !== "1") return;
  var started = false;
  function go() {
    if (started) return;
    started = true;
    window.setTimeout(function () {
      var btn = document.getElementById("play-tour");
      if (btn) btn.click();
    }, 700);
  }
  document.addEventListener("nexql-themes-ready", go);
  window.addEventListener("load", function () {
    window.setTimeout(go, 3500);
  });
})();
