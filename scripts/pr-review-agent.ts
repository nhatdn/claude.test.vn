/**
 * PR Review Agent - reviews a GitHub PR using Claude API
 *
 * Usage:
 *   npx tsx scripts/pr-review-agent.ts https://github.com/owner/repo/pull/1
 *   npx tsx scripts/pr-review-agent.ts owner/repo 1
 *   npx tsx scripts/pr-review-agent.ts 1                  (uses current repo)
 *   npx tsx scripts/pr-review-agent.ts <url> --post       (post review to GitHub)
 */

import Anthropic from "@anthropic-ai/sdk";
import { execSync } from "child_process";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the provided GitHub Pull Request diff and metadata.

Review for:
- Bugs and potential runtime errors
- TypeScript type safety
- React/frontend best practices (hooks, component design, performance)
- Security vulnerabilities
- Code quality (readability, naming, single responsibility)
- Accessibility (ARIA, semantic HTML)
- Whether the PR description matches the actual changes

Output format (GitHub Markdown):
## Summary
One paragraph overall assessment.

## 🔴 Critical Issues
Bugs or security problems that MUST be fixed before merge. Omit section if none.

## 🟡 Suggestions
Improvements ranked by impact. Reference specific filenames and line numbers.

## ✅ Positives
What's done well in this PR.

## Verdict
**Approve** / **Request Changes** / **Comment** — one sentence justification.

Be concise, specific, and actionable.`;

interface PRInfo {
  repo: string;
  prNumber: string;
  title: string;
  body: string;
  author: string;
  additions: number;
  deletions: number;
  files: string[];
  diff: string;
}

function parsePRArgs(args: string[]): { repo: string; prNumber: string } {
  const urlArg = args.find((a) => a.startsWith("https://github.com"));
  if (urlArg) {
    const match = urlArg.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (match) return { repo: `${match[1]}/${match[2]}`, prNumber: match[3] };
    throw new Error(`Cannot parse GitHub PR URL: ${urlArg}`);
  }

  const repoArg = args.find((a) => a.includes("/"));
  const numArg = args.find((a) => /^\d+$/.test(a));

  if (repoArg && numArg) return { repo: repoArg, prNumber: numArg };
  if (numArg) return { repo: "", prNumber: numArg };

  throw new Error(
    "Usage: pr-review-agent.ts <PR URL> | <owner/repo> <number> | <number>"
  );
}

function gh(cmd: string): string {
  return execSync(`gh ${cmd}`, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
}

function fetchPR(repo: string, prNumber: string): PRInfo {
  const repoFlag = repo ? `--repo ${repo}` : "";

  const meta = JSON.parse(
    gh(`pr view ${prNumber} ${repoFlag} --json title,body,author,additions,deletions,files,headRepository`)
  );

  const resolvedRepo = repo || `${meta.headRepository.owner.login}/${meta.headRepository.name}`;
  const diff = gh(`pr diff ${prNumber} ${repo ? `--repo ${repo}` : ""}`);

  return {
    repo: resolvedRepo,
    prNumber,
    title: meta.title,
    body: meta.body ?? "",
    author: meta.author.login,
    additions: meta.additions,
    deletions: meta.deletions,
    files: (meta.files as Array<{ path: string }>).map((f) => f.path),
    diff,
  };
}

async function reviewPR(pr: PRInfo): Promise<string> {
  const userMessage = `**PR #${pr.prNumber}: ${pr.title}**
Repository: ${pr.repo}
Author: @${pr.author}
Changes: +${pr.additions} / -${pr.deletions} across ${pr.files.length} file(s): ${pr.files.join(", ")}

**PR Description:**
${pr.body || "(no description)"}

**Diff:**
\`\`\`diff
${pr.diff}
\`\`\``;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";

  const cached = response.usage.cache_read_input_tokens ?? 0;
  console.error(
    `[tokens] in=${response.usage.input_tokens} out=${response.usage.output_tokens}${cached ? ` cached=${cached}` : ""}`
  );

  return text;
}

function postReview(repo: string, prNumber: string, body: string) {
  const escaped = body.replace(/'/g, "'\\''");
  gh(`pr comment ${prNumber} --repo ${repo} --body '${escaped}'`);
  console.log(`\nPosted review comment to https://github.com/${repo}/pull/${prNumber}`);
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const shouldPost = rawArgs.includes("--post");
  const args = rawArgs.filter((a) => a !== "--post");

  if (args.length === 0) {
    console.error("Usage: pr-review-agent.ts <PR URL | owner/repo number | number> [--post]");
    process.exit(1);
  }

  const { repo, prNumber } = parsePRArgs(args);

  console.log(`Fetching PR #${prNumber}${repo ? ` from ${repo}` : ""}...`);
  const pr = fetchPR(repo, prNumber);

  console.log(`Reviewing "${pr.title}" by @${pr.author}...\n`);
  const review = await reviewPR(pr);

  console.log("=".repeat(60));
  console.log(review);
  console.log("=".repeat(60));

  if (shouldPost) {
    postReview(pr.repo, prNumber, review);
  } else {
    console.log("\nTip: add --post to submit this review as a GitHub comment.");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
