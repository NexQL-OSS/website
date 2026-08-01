import { useEffect, useState } from "preact/hooks";

const STEPS = [
  {
    id: "connect",
    n: "01",
    title: "Connect",
    body: "Encrypted credentials, SSH tunnels, env labels — know which DB you're on.",
  },
  {
    id: "explore",
    n: "02",
    title: "Explore",
    body: "Schemas, tables, views, functions — one tree, no separate client.",
  },
  {
    id: "query",
    n: "03",
    title: "Query",
    body: "Notebooks with AI assist and instant results beside your code.",
  },
  {
    id: "analyze",
    n: "04",
    title: "Analyze",
    body: "Charts, EXPLAIN, profiling, export — still in the same window.",
  },
] as const;

/**
 * Scroll spine: highlights the active Connect→Analyze beat and stamps
 * data-story-beat on <body> so the hero workbench can react.
 */
export default function StorySpine() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = STEPS.map((s) => document.getElementById(`beat-${s.id}`)).filter(
      Boolean,
    ) as HTMLElement[];

    if (!nodes.length) {
      document.body.dataset.storyBeat = STEPS[0].id;
      return;
    }

    if (reduce) {
      document.body.dataset.storyBeat = STEPS[0].id;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target) return;
        const id = visible.target.id.replace(/^beat-/, "");
        const idx = STEPS.findIndex((s) => s.id === id);
        if (idx >= 0) {
          setActive(idx);
          document.body.dataset.storyBeat = id;
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    for (const n of nodes) io.observe(n);
    document.body.dataset.storyBeat = STEPS[0].id;

    return () => {
      io.disconnect();
      delete document.body.dataset.storyBeat;
    };
  }, []);

  return (
    <div class="story-spine" role="list" aria-label="NexQL workflow loop">
      {STEPS.map((s, i) => (
        <a
          key={s.id}
          href={`#beat-${s.id}`}
          class="story-spine-step"
          role="listitem"
          data-active={i === active ? "true" : "false"}
        >
          <div class="story-spine-n">{s.n}</div>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </a>
      ))}
    </div>
  );
}
