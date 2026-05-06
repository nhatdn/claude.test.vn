import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert code reviewer specializing in React, TypeScript, and modern frontend development.

Review the provided code for:
- Bugs and potential runtime errors
- TypeScript type safety and strict mode compliance
- React best practices (hooks rules, component design, memoization)
- Performance issues (unnecessary renders, large bundles, memory leaks)
- Security vulnerabilities (XSS, injection, unsafe patterns)
- Code quality (readability, naming, single responsibility)
- Accessibility (ARIA, semantic HTML)

Structure your review as:
## Summary
Brief overall assessment (1-2 sentences).

## Critical Issues
Bugs or security problems that must be fixed. Skip section if none.

## Suggestions
Improvements ranked by impact. Include code snippets where helpful.

## Positives
What's done well.

Be concise and actionable. Reference specific line numbers when possible.`;

async function getTarget(arg: string): Promise<{ code: string; label: string }> {
  if (arg === "--diff") {
    const code = execSync("git diff HEAD", { encoding: "utf-8" });
    return { code, label: "git diff HEAD" };
  }
  if (arg === "--staged") {
    const code = execSync("git diff --staged", { encoding: "utf-8" });
    return { code, label: "staged changes" };
  }
  if (existsSync(arg)) {
    const code = readFileSync(arg, "utf-8");
    return { code, label: `file: ${arg}` };
  }
  throw new Error(`"${arg}" is not a valid file path or option (--diff, --staged)`);
}

async function main() {
  const arg = process.argv[2] ?? "--diff";

  const { code, label } = await getTarget(arg);

  if (!code.trim()) {
    console.log("Nothing to review.");
    return;
  }

  console.log(`\nReviewing ${label}...\n`);

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
    messages: [
      {
        role: "user",
        content: `Review the following code (${label}):\n\n\`\`\`\n${code}\n\`\`\``,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";

  console.log("=".repeat(60));
  console.log("CODE REVIEW");
  console.log("=".repeat(60));
  console.log(text);
  console.log("=".repeat(60));
  console.log(
    `Tokens used: ${response.usage.input_tokens} in / ${response.usage.output_tokens} out` +
      (response.usage.cache_read_input_tokens
        ? ` (${response.usage.cache_read_input_tokens} cached)`
        : "")
  );
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
