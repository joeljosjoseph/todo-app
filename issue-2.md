## Parent PRD

#1

## What to build

Extract the task behavior into a dedicated domain module that owns task creation, completion, reopening, deletion, and ordering rules. This slice should keep the current end-to-end user behavior intact while moving the core logic behind a simple interface that can be reused and tested independently, as described in the parent PRD's Solution, Implementation Decisions, and Testing Decisions sections.

## Acceptance criteria

- [ ] Task creation, completion, reopening, deletion, and ordering behavior are handled through a dedicated task domain module
- [ ] The app still shows active tasks newest-first and completed tasks most recently completed first
- [ ] The UI continues to work end to end with no regression in current task behavior

## Blocked by

None - can start immediately

## User stories addressed

Reference by number from the parent PRD:

- User story 7
- User story 9
- User story 10
- User story 11
- User story 24
- User story 26
- User story 27
