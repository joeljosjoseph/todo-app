import assert from "node:assert/strict";

import { addTask } from "../lib/tasks.mjs";

function test(name, callback) {
  try {
    callback();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test("addTask trims text, rejects blank input, and keeps active tasks newest-first", () => {
  const now = 2000;
  const existingTask = {
    id: "existing-task",
    text: "Existing task",
    createdAt: 1000,
    completedAt: null,
  };

  const { tasks, task } = addTask({
    tasks: [existingTask],
    draft: "  New task  ",
    now,
    createId: () => "new-task",
  });

  assert.equal(task.text, "New task");
  assert.deepEqual(tasks.map((currentTask) => currentTask.id), [
    "new-task",
    "existing-task",
  ]);

  assert.equal(
    addTask({
      tasks,
      draft: "   ",
      now: 3000,
      createId: () => "ignored-task",
    }),
    null,
  );
});
