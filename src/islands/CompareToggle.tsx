import { useState } from "preact/hooks";

type Mode = "nexql" | "other";

/** In-editor vs separate-app compare — dramatizes context switching. */
export default function CompareToggle() {
  const [mode, setMode] = useState<Mode>("nexql");

  return (
    <div>
      <div class="compare-toggle" role="group" aria-label="Compare workflow">
        <button
          type="button"
          aria-pressed={mode === "nexql"}
          onClick={() => setMode("nexql")}
        >
          In your editor
        </button>
        <button
          type="button"
          aria-pressed={mode === "other"}
          onClick={() => setMode("other")}
        >
          Separate apps
        </button>
      </div>

      {mode === "nexql" ? (
        <div class="compare-stage" aria-live="polite">
          <h3>One window. Zero context loss.</h3>
          <p>
            Notebooks, explorer, AI, and EXPLAIN stay beside your code. Env labels make
            PROD obvious before you run.
          </p>
          <div class="compare-windows">
            <div class="compare-win is-nexql">VS Code · NexQL · query.pgsql · SQL Assistant</div>
          </div>
        </div>
      ) : (
        <div class="compare-stage" aria-live="polite">
          <h3>Four windows. Constant switching.</h3>
          <p>
            pgAdmin / DBeaver / TablePlus for SQL, a monitor for plans, a chat tab for
            help, and your editor for code — schema context dies on every hop.
          </p>
          <div class="compare-windows">
            <div class="compare-win is-frag">1 · SQL client</div>
            <div class="compare-win is-frag">2 · Query monitor / EXPLAIN UI</div>
            <div class="compare-win is-frag">3 · Chat / docs tab</div>
            <div class="compare-win is-frag">4 · VS Code (your actual work)</div>
          </div>
        </div>
      )}
    </div>
  );
}
