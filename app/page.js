"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "prooflist.tasks";

function sortTasks(tasks) {
  return [...tasks].sort((left, right) => {
    if (left.completedAt && right.completedAt) {
      return right.completedAt - left.completedAt;
    }

    if (!left.completedAt && !right.completedAt) {
      return right.createdAt - left.createdAt;
    }

    return left.completedAt ? 1 : -1;
  });
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(sortTasks(parsedTasks));
      }
    } catch (error) {
      console.error("Could not load saved tasks.", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [hydrated, tasks]);

  function handleSubmit(event) {
    event.preventDefault();

    const text = draft.trim();

    if (!text) {
      return;
    }

    const nextTask = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      completedAt: null,
    };

    setTasks((currentTasks) => sortTasks([nextTask, ...currentTasks]));
    setDraft("");
    setPendingDeleteId(null);
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      sortTasks(
        currentTasks.map((task) => {
          if (task.id !== taskId) {
            return task;
          }

          return {
            ...task,
            completedAt: task.completedAt ? null : Date.now(),
          };
        }),
      ),
    );

    setPendingDeleteId((currentId) => (currentId === taskId ? null : currentId));
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
    setPendingDeleteId(null);
  }

  const activeTasks = tasks.filter((task) => !task.completedAt);
  const completedTasks = tasks.filter((task) => task.completedAt);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.2),_transparent_32%),linear-gradient(180deg,_#fff8f1_0%,_#fffdf8_44%,_#f8fbff_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4">
            <p
              className="text-xs uppercase tracking-[0.28em] text-rose-500"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Next.js + Tailwind proof of concept
            </p>
            <div className="space-y-3">
              <h1
                className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A tiny to-do app that feels ready to demo.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Add tasks, complete them, and keep everything saved in your
                browser. No auth, no backend, no extra ceremony.
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em] text-rose-300"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Snapshot
                </p>
                <h2
                  className="mt-2 text-2xl font-medium"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {activeTasks.length} active, {completedTasks.length} done
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-right">
                <p
                  className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-300"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Storage
                </p>
                <p className="mt-1 text-sm text-white">localStorage</p>
              </div>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Add a task
                </span>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none ring-0 placeholder:text-slate-400 focus:border-rose-300"
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Finish the landing page copy"
                />
              </label>
              <button
                className="inline-flex items-center justify-center rounded-full bg-rose-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                type="submit"
              >
                Add task
              </button>
            </form>
          </div>
        </section>

        <section className="grid flex-1 gap-6 lg:grid-cols-2">
          <TaskColumn
            title="Active"
            eyebrow="Do next"
            emptyMessage={
              hydrated
                ? "No active tasks yet. Add one above to get started."
                : "Loading your saved tasks..."
            }
            tasks={activeTasks}
            pendingDeleteId={pendingDeleteId}
            onToggle={toggleTask}
            onStartDelete={setPendingDeleteId}
            onCancelDelete={() => setPendingDeleteId(null)}
            onDelete={deleteTask}
          />

          <TaskColumn
            title="Completed"
            eyebrow="Wrapped"
            emptyMessage={
              hydrated
                ? "Completed tasks will land here."
                : "Loading your completed tasks..."
            }
            tasks={completedTasks}
            pendingDeleteId={pendingDeleteId}
            onToggle={toggleTask}
            onStartDelete={setPendingDeleteId}
            onCancelDelete={() => setPendingDeleteId(null)}
            onDelete={deleteTask}
            completed
          />
        </section>
      </div>
    </main>
  );
}

function TaskColumn({
  title,
  eyebrow,
  emptyMessage,
  tasks,
  pendingDeleteId,
  onToggle,
  onStartDelete,
  onCancelDelete,
  onDelete,
  completed = false,
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p
            className="text-xs uppercase tracking-[0.22em] text-slate-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {eyebrow}
          </p>
          <h2
            className="mt-2 text-2xl font-medium text-slate-950"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          {tasks.length} task{tasks.length === 1 ? "" : "s"}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm leading-6 text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => {
            const isConfirmingDelete = pendingDeleteId === task.id;

            return (
              <li
                key={task.id}
                className={`rounded-[1.5rem] border px-4 py-4 transition ${
                  completed
                    ? "border-emerald-100 bg-emerald-50/70"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="pr-2">
                    <p
                      className={`text-base leading-7 ${
                        completed ? "text-slate-500 line-through" : "text-slate-800"
                      }`}
                    >
                      {task.text}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 ${
                        completed
                          ? "bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-300"
                          : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 focus:ring-emerald-200"
                      }`}
                      type="button"
                      onClick={() => onToggle(task.id)}
                    >
                      {completed ? "Move back" : "Complete"}
                    </button>

                    {isConfirmingDelete ? (
                      <>
                        <span className="px-2 text-sm text-slate-500">
                          Delete?
                        </span>
                        <button
                          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          type="button"
                          onClick={() => onDelete(task.id)}
                        >
                          Yes
                        </button>
                        <button
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          type="button"
                          onClick={onCancelDelete}
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <button
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        type="button"
                        onClick={() => onStartDelete(task.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
