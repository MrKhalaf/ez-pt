// function import example: useEffect(() => {}, [])
import { useEffect, useState } from 'react';
// object example: ReactDOM.createRoot(...)
import ReactDOM from 'react-dom/client';

// union example: "hold"
type Kind = 'hold' | 'rep';
// union example: "left"
type Side = 'left' | 'right' | 'both';
// union example: "work"
type Phase = 'work' | 'rest' | 'done';

// object shape example: { id: 1, name: "Bird Dog", kind: "hold", sets: 4, hold: 13, rest: 10, paired: true }
type Exercise = { id: number; name: string; kind: Kind; sets: number; hold?: number; reps?: number; rest: number; paired: boolean };
// object shape example: { exerciseId: 1, set: 2, side: "right", phase: "rest", seconds: 8 }
type Session = { exerciseId: number; set: number; side: Side; phase: Phase; seconds: number };
// object shape example: { 1: 4, 2: 3 }
type Progress = Record<number, number>;

// string example: "2026-03-31"
const today = () => new Date().toISOString().slice(0, 10);
// array example: [{ id: 1, name: "Bird Dog", kind: "hold", sets: 4, hold: 13, rest: 10, paired: true }]
const seed: Exercise[] = [
  // object example: paired hold exercise
  { id: 1, name: 'Bird Dog', kind: 'hold', sets: 4, hold: 13, rest: 10, paired: true },
  // object example: single-side hold exercise
  { id: 2, name: 'Curl-up', kind: 'hold', sets: 4, hold: 13, rest: 10, paired: false },
  // object example: rep exercise
  { id: 3, name: 'Glute Bridge', kind: 'rep', sets: 3, reps: 15, rest: 10, paired: false },
];
// generic value example: {}
const read = <T,>(key: string, fallback: T): T => JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
// void example: undefined
const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
// string example: "13s hold"
const summary = (x: Exercise) => `${x.sets} sets • ${x.kind === 'hold' ? `${x.hold}s hold` : `${x.reps} reps`}${x.paired ? ' • L/R' : ''}`;

// JSX element example: <main>...</main>
function App() {
  // array example: seed exercises or locally edited replacements
  const [exercises] = useState<Exercise[]>(() => {
    // string example: "ezpt:exercises"
    const key = 'ezpt:exercises';
    // array example: stored exercises or []
    const stored = read<Exercise[]>(key, []);
    // array example: stored.length ? stored : seed
    const next = stored.length ? stored : seed;
    // side effect example: localStorage["ezpt:exercises"] = "[...]"
    write(key, next);
    // array example: next
    return next;
  });
  // string example: "ezpt:progress:2026-03-31"
  const progressKey = `ezpt:progress:${today()}`;
  // object example: { 1: 4 }
  const [progress, setProgress] = useState<Progress>(() => read<Progress>(progressKey, {}));
  // object|null example: null or { exerciseId: 1, set: 1, side: "left", phase: "work", seconds: 13 }
  const [session, setSession] = useState<Session | null>(null);
  // object|null example: the active exercise or null
  const current = exercises.find((x) => x.id === session?.exerciseId) || null;
  // number example: 2
  const completeCount = Object.values(progress).filter(Boolean).length;

  // side effect example: persist today's progress map
  useEffect(() => {
    // side effect example: localStorage["ezpt:progress:2026-03-31"] = "{\"1\":4}"
    write(progressKey, progress);
    // dependency shape example: [progressKey, progress]
  }, [progressKey, progress]);

  // side effect example: countdown current session once per second
  useEffect(() => {
    // boolean example: true when nothing should tick
    if (!session || session.phase === 'done' || session.seconds < 1) return;
    // number example: 1000
    const id = window.setInterval(() => {
      // updater example: prev => prev ? { ...prev, seconds: prev.seconds - 1 } : prev
      setSession((prev) => (prev ? { ...prev, seconds: prev.seconds - 1 } : prev));
      // interval milliseconds example: 1000
    }, 1000);
    // cleanup example: () => clearInterval(id)
    return () => clearInterval(id);
    // dependency shape example: [session]
  }, [session]);

  // side effect example: move to next step when countdown reaches zero
  useEffect(() => {
    // boolean example: true when the timer just finished
    if (session && session.phase !== 'done' && session.seconds === 0 && current?.kind === 'hold') next();
    // dependency shape example: [session, current]
  }, [session, current]);

  // void example: starts first work block
  const start = (x: Exercise) => setSession({ exerciseId: x.id, set: 1, side: x.paired ? 'left' : 'both', phase: 'work', seconds: x.kind === 'hold' ? x.hold || 0 : 0 });
  // void example: advances work -> rest -> work -> done
  const next = () => {
    // object|null example: current session
    if (!current || !session) return;
    // boolean example: true when another left/right or next set remains
    const hasMore = session.side === 'left' || session.set < current.sets;
    // object example: next session snapshot
    const prepared: Session =
      session.phase === 'work'
        ? hasMore
          ? { ...session, set: session.side === 'right' || session.side === 'both' ? session.set + 1 : session.set, side: current.paired ? (session.side === 'left' ? 'right' : 'left') : 'both', phase: 'rest', seconds: current.rest }
          : { ...session, phase: 'done', seconds: 0 }
        : { ...session, phase: 'work', seconds: current.kind === 'hold' ? current.hold || 0 : 0 };
    // side effect example: mark exercise complete once session ends
    if (prepared.phase === 'done') setProgress((p) => ({ ...p, [current.id]: current.sets }));
    // object example: prepared
    setSession(prepared);
  };

  // JSX element example: app shell with either list or active session
  return (
    // JSX example: <main style={{ fontFamily: 'sans-serif' }}>...</main>
    <main style={{ maxWidth: 560, margin: '0 auto', padding: 24, fontFamily: 'ui-sans-serif, system-ui, sans-serif', lineHeight: 1.4 }}>
      {/* string example: "Rehabber, reduced to one file" */}
      <h1 style={{ margin: 0 }}>Rehabber, reduced to one file</h1>
      {/* string example: "3 / 3 done today" */}
      <p style={{ color: '#666' }}>{completeCount} / {exercises.length} done today</p>

      {/* boolean example: true when an exercise is active */}
      {current && session ? (
        // JSX example: active timer card
        <section style={{ border: '1px solid #ddd', borderRadius: 16, padding: 20 }}>
          {/* string example: "Bird Dog" */}
          <h2 style={{ marginTop: 0 }}>{current.name}</h2>
          {/* string example: "set 1 / 4 • left • work" */}
          <p>set {Math.min(session.set, current.sets)} / {current.sets} • {session.side} • {session.phase}</p>
          {/* string example: "00:13" or "15 reps" or "done" */}
          <div style={{ fontSize: 40, fontWeight: 700, margin: '16px 0' }}>
            {session.phase === 'done' ? 'done' : current.kind === 'hold' ? `00:${String(session.seconds).padStart(2, '0')}` : `${current.reps} reps`}
          </div>
          {/* boolean example: true when hold timers auto-advance and button should be hidden */}
          {!(current.kind === 'hold' && session.phase === 'work') && session.phase !== 'done' ? (
            // JSX example: manual advance button
            <button onClick={next} style={{ padding: '12px 16px', borderRadius: 12, border: 0, background: '#111', color: '#fff' }}>
              {session.phase === 'rest' ? 'start next set' : current.kind === 'rep' ? 'complete set' : 'skip rest'}
            </button>
          ) : null}
          {/* boolean example: true when workout is finished */}
          {session.phase === 'done' ? (
            // JSX example: post-completion actions
            <div style={{ display: 'flex', gap: 12 }}>
              {/* void example: clear active session */}
              <button onClick={() => setSession(null)} style={{ padding: '12px 16px', borderRadius: 12, border: 0, background: '#111', color: '#fff' }}>back</button>
              {/* void example: restart same exercise */}
              <button onClick={() => start(current)} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #ddd', background: '#fff' }}>repeat</button>
            </div>
          ) : null}
        </section>
      ) : (
        // JSX example: exercise list
        <section style={{ display: 'grid', gap: 12 }}>
          {/* object example: { id: 1, name: "Bird Dog", ... } */}
          {exercises.map((x) => (
            // JSX example: exercise card
            <article key={x.id} style={{ border: '1px solid #ddd', borderRadius: 16, padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              {/* JSX example: text content block */}
              <div>
                {/* string example: "Bird Dog" */}
                <strong>{x.name}</strong>
                {/* string example: "4 sets • 13s hold • L/R" */}
                <div style={{ color: '#666', fontSize: 14 }}>{summary(x)}</div>
                {/* number example: 4 */}
                <div style={{ color: '#666', fontSize: 14 }}>today: {progress[x.id] || 0} / {x.sets}</div>
              </div>
              {/* void example: start selected exercise */}
              <button onClick={() => start(x)} style={{ padding: '10px 14px', borderRadius: 12, border: 0, background: '#111', color: '#fff' }}>start</button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

// HTMLElement|null example: <div id="root"></div>
const root = document.getElementById('root');
// side effect example: render the app into #root
if (root) ReactDOM.createRoot(root).render(<App />);
