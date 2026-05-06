# pr-review

Trigger the pr-reviewer subagent to review a GitHub Pull Request in-session.

Usage:

- `/pr-review https://github.com/owner/repo/pull/1`
- `/pr-review owner/repo 1`
- `/pr-review 1` (uses current repo from git remote)

## Steps

1. **Parse arguments** from: $ARGUMENTS
   - Extract repo and PR number from URL, or use `owner/repo number`, or just number.
   - If no arguments: show usage and stop.

2. **Fetch PR context** using Bash (read-only):

   ```bash
   gh pr view <number> --repo <repo> \
     --json title,body,author,additions,deletions,files,headRefName,baseRefName
   gh pr diff <number> --repo <repo>
   ```

3. **Construct a `<pr-context>` block** with the fetched data:

   ```xml
   <pr-context>
   <title>...</title>
   <author>...</author>
   <additions>N</additions>
   <deletions>N</deletions>
   <files_changed>file1.tsx, file2.ts</files_changed>
   <description>
   (full PR body)
   </description>
   <diff>
   (full git diff output)
   </diff>
   </pr-context>
   ```

4. **Invoke the pr-reviewer subagent** with the `<pr-context>` block above as the prompt. The subagent will perform the 4-step review and return a structured markdown report.

5. **Display the review** to the user.

6. **Ask**: "Would you like me to post this review as a comment on the PR?"
   - If yes: run `gh pr comment <number> --repo <repo> --body '<review>'`
