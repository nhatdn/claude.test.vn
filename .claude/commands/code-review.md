Run the code review agent on the specified target using Claude's API.

Usage:
- `/code-review` → reviews all uncommitted changes (`git diff HEAD`)
- `/code-review --staged` → reviews only staged changes
- `/code-review <file>` → reviews a specific file (e.g. `/code-review src/App.tsx`)

Steps:
1. Make sure `ANTHROPIC_API_KEY` is set in the environment. If not, tell the user to set it with `export ANTHROPIC_API_KEY=<key>`.
2. Run the agent: `npx tsx scripts/review-agent.ts $ARGUMENTS`
3. Display the review output clearly to the user.
4. If the review contains Critical Issues, ask the user if they'd like you to fix them.
