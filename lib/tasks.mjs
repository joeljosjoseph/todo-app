export function sortTasks(tasks) {
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

export function addTask({ tasks, draft, now = Date.now(), createId = crypto.randomUUID }) {
  const text = draft.trim();

  if (!text) {
    return null;
  }

  const task = {
    id: createId(),
    text,
    createdAt: now,
    completedAt: null,
  };

  return {
    task,
    tasks: sortTasks([task, ...tasks]),
  };
}
