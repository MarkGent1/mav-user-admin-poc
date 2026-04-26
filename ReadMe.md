# Overview

A small PoC to build a simple User Management service that allows administrators to view, create, update, and delete user accounts.

The system will expose a clean API, a minimal frontend UI, and deploy automatically to Azure using Terraform and GitHub Actions.

This PoC demonstrates a full SDLC workflow (outer-loop → inner-loop) using Claude and OpenCode across planning, development, infrastructure, and CI/CD.

A simple but realistic slice:

* List users
* Create user
* Update user
* Delete user

This gives us:

* Backend API
* Frontend UI
* Validation
* Persistence
* Terraform infra
* CI/CD
* Stories
* PRs
* Code reviews
* Architecture decisions

# Goals

* Provide a minimal but complete CRUD workflow
* Demonstrate full SDLC: stories → code → PRs → infra → deploy
* Use .NET + Next.js + Terraform + Azure
* Use Claude for planning, reviews, and architecture
* Use OpenCode for scaffolding and implementation

# Non‑Goals

* Authentication/authorization
* Complex domain logic
* UI polish
* Multi‑environment promotion
* Production‑grade security

# Workflow

## Workflow: dev‑outer → dev‑inner

### Outer loop (Claude)

* Vision
* Epics
* Stories
* Acceptance criteria
* Architecture
* Repo structure
* CI/CD design
* IaC design
* PR descriptions
* Documentation

### Inner loop (OpenCode + Claude Code)

* Generate scaffolding
* Generate .NET controllers, services, EF models
* Generate Next.js pages, forms, API clients
* Generate Terraform modules
* Generate GitHub Actions workflows
* Refactor code
* Fix errors
* Write tests

## Workflow SDLC in practice

How your SDLC will run from the stories (end‑to‑end).

Below is the clean, SDLC loop I will follow for each story in your sprint. The sprint is managed via a Jira board.

![Backlog is managed via Jira](/docs/screenshots/jira-backlog.png "Backlog is managed via Jira")

### 1. Pick a Jira story

**Example:**
`MUAP-10: Display list of users`

Manually move it to In Progress.

### 2. Outer loop (Claude) — Expand the story into a PR plan

Claude (VS Code) and give it:

```
"Here is my Jira story: [paste story].
Generate:
* a technical plan
* file changes
* API interactions
* edge cases
* test plan
* PR description
* commit message summary."
```

Claude outputs something like:

```
* Files to create/update
* API endpoints to call
* UI components
* Error states
* Test cases
* A ready‑to‑paste PR description
* A commit message like:
feature(frontend): implement user list page with API integration
```

This is the crux of the **outer‑loop design**.

### 3. Inner loop (OpenCode) — Generate the actual code

Using **OpenCode Desktop** or the **VS Code extension** and paste:

```
"Implement the plan below.
Here is the story and the PR plan: [paste Claude output].
Generate the code changes exactly as described."
```

OpenCode will:

```
* Create the files
* Generate the components
* Generate API clients
* Generate tests
* Update imports
* Ensure everything compiles
```

This is the crux of the **inner‑loop implementation**.

### 4. Run locally

e.g. Verify the story works.

```
Run:
* dotnet run for backend
* npm run dev for frontend
* docker compose up for local DB
```

OR all via `docker compose`.

### 5. Commit + PR

Manually create a commit using the message Claude generated.

Manually create a PR with:

```
* The PR description Claude generated
* A link to the Jira story
* Screenshots (if UI)
```

### 6. Claude Code review (optional)

In VS Code:

```
"Review this PR diff.
Identify bugs, missing tests, security issues, and improvements."
```

Claude gives you review comments.

You apply fixes using OpenCode.

### 7. CI/CD runs

The GitHub Actions pipeline:

* Builds backend
* Builds frontend
* Runs tests
* Validates Terraform
* Deploys to dev on merge

### 8. Move story to Done

Once merged, manually move the Jira story to Done.

This completes the SDLC loop.

# The complete SDLC engine for this PoC

* Jira = source of truth
* Claude = architect, reviewer, planner
* OpenCode = implementer, generator, refactorer
* GitHub = version control + PR workflow
* Terraform = infra
* Azure = runtime
* GitHub Actions = CI/CD
* DX scripts = local dev

# Model‑Selection Guide

## Use Sonnet for 80–90% of the SDLC

Sonnet is perfect for:

* PR descriptions
* Commit messages
* Technical plans
* Story expansions
* Test plans
* Reviewing diffs
* Documentation
* Day‑to‑day coding help
* Architecture for CRUD‑level features
* Terraform module outlines
* CI/CD workflow outlines

**Why:**

```
It’s fast, cheap, and powerful enough for almost everything you’re doing right now.
```

## Use Opus only for deep reasoning

Examples where Opus is worth it:

* Designing the entire system architecture
* Multi‑service or distributed system planning
* Database partitioning / sharding strategies
* Terraform module architecture across environments
* Reviewing very large PRs
* Refactoring thousands of lines across multiple files
* Performance tuning analysis
* Security reviews
* Complex concurrency or async design
* Anything involving long chains of reasoning

**Why:**

```
Opus is the “big brain” model — but it consumes your quota faster.
```

## Use Haiku for quick, low‑stakes tasks

Examples:

* “Rewrite this sentence”
* “Summarise this error message”
* “Explain this log output”
* “Give me 5 branch name ideas”
* “What does this exception mean?”

**Why:**

```
It’s extremely fast and barely uses any quota.
```

## Model‑Selection Guide: Summary

# SDLC Model Strategy — Claude Model Selection Guide

| SDLC Task                                   | Model |
|---------------------------------------------|-------------------|
| PR descriptions                             | **Sonnet**        |
| Commit messages                             | **Sonnet**        |
| Technical plans                             | **Sonnet**        |
| Story expansions                            | **Sonnet**        |
| Test plans                                  | **Sonnet**        |
| Reviewing diffs (normal size)               | **Sonnet**        |
| Documentation                               | **Sonnet**        |
| CRUD‑level architecture                     | **Sonnet**        |
| Terraform module outlines                   | **Sonnet**        |
| CI/CD workflow outlines                     | **Sonnet**        |
| Deep system architecture                    | **Opus**          |
| Multi‑file refactors                        | **Opus**          |
| Large PR reviews                            | **Opus**          |
| Database design (partitioning/sharding)     | **Opus**          |
| Performance tuning analysis                 | **Opus**          |
| Security reviews                             | **Opus**          |
| Quick rewrites                              | **Haiku**         |
| Error explanations                           | **Haiku**         |
| Log/message summarisation                   | **Haiku**         |
