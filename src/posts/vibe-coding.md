---
title: "I Vibe-coded a Full-Stack App for $2.96"
date: 2026-08-04
layout: post
tags: posts
description: "How I built a production full-stack app — Rust backend, React frontend, deployed on Render — entirely through agentic engineering with DeepSeek, for less than three dollars."
---

> _Or: how I built a real app from scratch to production with agentic engineering — in two days._

<div class="vibe-note">
🤖 <em>This post was entirely vibe-edited with DeepSeek. The AI wrote, restructured, and polished it — I just told it what I wanted.</em>
</div>

A few weeks ago I had an idea: a cashless betting app for my friends' group. No real money — just points, bragging rights, and a leaderboard. Everyone puts 100 points on Flamengo. Someone wins big, someone goes broke. You get the idea.

I had two constraints:
1. I wanted to ship it before the next Brasileirão matchday
2. I wanted to try building it entirely through "vibe coding"

**Vibe coding** is a term that's been going around. The idea is simple: you describe what you want to an AI coding agent, it writes the code, you iterate, and you never touch the actual source.

What I actually did is closer to **agentic engineering** — a term that captures the same workflow but with an important distinction. Vibe coding implies a hands-off, "let the AI figure it out" approach where you trust the output blindly. Agentic engineering is more deliberate: you act as the architect, making high-level decisions (which API to use, how to structure the database, when to refactor), while the agent handles the implementation details. You review every change, test the results, and course-correct when needed.

In practice, I used "vibe coding" casually to describe the experience — it felt like vibing with the agent. But the methodology was agentic engineering: I never stopped being the one in control.

I used [Zed](https://zed.dev) as the editor. It has a built-in agent panel where you can plug in any LLM that exposes an OpenAI-compatible API. I pointed it at DeepSeek — specifically DeepSeek V4, which at the time of writing costs a fraction of what GPT-4 or Claude charge per token. The agent runs directly inside the editor: it reads your entire project, searches across files, writes and edits code inline, and shows you diffs before applying changes. No copy-pasting between a chat window and your IDE. No context switching.

The workflow is simple: type what you want in the agent panel, hit enter, watch it work. It might read five files, edit three of them, and write a new one — all in one response. If something breaks, paste the error. If the result looks wrong, say "undo that" or "try a different approach." The agent has full context of your codebase, so you don't waste tokens re-explaining your project structure on every message.

I didn't write a single line of Rust, TypeScript, SQL, or CSS. I didn't write a Dockerfile. I didn't configure CORS. The AI did all of it. I just told it what I wanted, reviewed the output, and kept the conversation going. My actual prompts were things like:

- _"Add a CI pipeline (just build for now)"_
- _"Change the scroll style for something more fitting"_
- _"Remove the manual actions on bets"_
- _"Let's make this responsive now"_
- _"I want to ship this app to render"_

Here's how it went.

## The pitch

I opened a fresh project and told the agent:

> _"I want to bootstrap a fullstack application with a Rust backend, choose some frontend stack that is compatible and easy to work with the Rust backend"_

The agent came back with React + TypeScript + Vite for the frontend, Axum for the HTTP framework, and SQLx for Postgres.

## The plan

Before writing any feature code, I described the whole vision to the agent — cashless betting, private groups with invite codes, per-group balances, real football data. Then:

> _"Don't implement anything for now, add a structured PLAN.md with the next possible tasks based on what I just said."_

It wrote a roadmap: Phase 1 through Phase 6, with checkboxes, schema diagrams, and API endpoint tables. This file became the shared brain between me and the agent. Every time we finished something, I'd say:

> _"Update the PLAN.md"_

And it would check off completed items and add new ones. When I changed direction — like switching football APIs four times — I'd say:

> _"The plan still mentions the old api"_

And it would scrub every reference.

Over time, the plan grew from a simple checklist into a living document: current schema, full API endpoint table, Render deployment env vars, and phases for future work like internationalization and SPA polish. Most of the time, I'd just say "update the PLAN.md" after a session and the agent would sync everything — checked boxes, new features, schema changes, all reflected in one commit.

## Auth and core betting

The agent scaffolded the project and hit its first roadblock immediately:

> _"Getting this during the build — error[E0433]: cannot find `EnvFilter` in `tracing_subscriber`"_

Missing a Cargo feature flag. Fixed in one line. Then came the database:

> _"That's a good start, let's add a database, I want to use Postgres. Can you add a docker-compose file that spins it up?"_

The agent wrote `docker-compose.yml`, set up SQLx with connection pooling and auto-migrations, and wired everything together. Next: authentication.

> _"Let's add users to our database, how about a google sign-up?"_

The agent integrated Google OAuth — but nothing's ever that simple. First it was a missing npm package. Then:

> _"Updated the envs but still getting a 401: invalid_client in the google popup"_

I had to add `http://localhost:5173` to the Authorized JavaScript Origins in the Google Cloud Console — not a code problem, a configuration one. Once fixed, authentication worked. But then:

> _"The user avatar doesn't show up, any setup required on GCP maybe?"_

The Google token payload includes `picture` — the agent just needed to store `avatar_url` on the user record and display it.

With auth working, the agent added the bets table, create/resolve endpoints, and a shared bet list. At this point I stepped back and thought about production:

> _"I want to deploy this product to a production environment afterwards, make sure we don't expose any technical data to the user."_

The agent hardened error handling — `AppError::Internal` now logs the full detail but returns only "Internal server error" to the client. It added a custom panic hook, configured CORS, and set up structured logging with `tracing`.

Then I created the plan — Phase 1 was done, and the roadmap was set.

![The app after authentication and core betting](/assets/images/vibe-phase1.png)

## Groups and leaderboards

Before writing any code, I laid out the requirements — these went straight into the plan:

> _"This will be a closed beta, I will only allow a small list of e-mails to be able to sign-up initially. Users can be invited to a group via a unique invite link, only the group admin (the creator) can do that. The balance per-user is scoped by the group."_

Then, referencing the plan's phase numbers:

> _"Implement phase 2."_

The agent destroyed the schema and rebuilt it. This was the biggest migration: `groups`, `group_members`, dropping the global `balance` column from `users`, adding `group_id` to bets. The group invite system generated random 8-character codes with regenerate support. The leaderboard query ranked members by balance with 🥇🥈🥉 podium rows.

I also wanted a quick way to test without going through Google OAuth every time:

> _"I want a button that will only be enabled in the development env, just for testing. This button will create a random user and login."_

The agent added `POST /api/dev/login` — creates a random test user, seeds the beta allowlist, returns a JWT. Gated behind `ENVIRONMENT != "production"` so it can never ship to prod.

Once the core was working, the UX polish started:

> _"Two small changes: both Join/Create group actions should be separate buttons, take them out of the dropdown. The dropdown arrow is too far to the right."_
> _"Add a Cancel button to both actions too."_

Later, when the invite feature went live:

> _"The 'Invite button' shows the URL, but we can't close it."_

The agent added a dismiss button to the invite bar. These tiny UX fixes piled up — each one took 30 seconds to request and about the same to implement.

I remember thinking: _this would have taken me a week by hand._

![Groups, invite system, and leaderboard](/assets/images/vibe-groups.png)

## Real match data

Until now, bets were just a placeholder form — you'd type in odds and an amount, no teams, no matches. I needed real Brasileirão fixtures.

The agent tried **api-futebol.com.br**. No matches for the free tier.

> _"Change of plans, we're using https://footballdata.io now"_

The agent rewired the sync function. I hit the endpoint. Nothing happened — zero matches, zero odds. The API returned completely irrelevant European leagues.

> _"You have to filter for country=Brazil"_

Still nothing. The free tier didn't cover South American football.

> _"Change of plans, the current API doesn't support our leagues, let's use this one instead. Keep the features intact, change just the API interaction, report back any incompatibility with me. Good luck."_

I sent the agent to **api-football.com**. It found the Brasileirão league ID. Synced. Zero matches. The free tier had no recent data.

> _"This API also doesn't have recent data for the free tier. Let's switch to this one. Do the same changes, make sure everything works. Good luck."_

Fourth attempt: **the-odds-api.com**. The agent rewrote everything one more time — new URL structure, new JSON shape, new odds extraction logic.

> _"Neat! it works"_

Finally. Real matches. Real odds. The agent had switched APIs four times without breaking anything else.

If I had spent five minutes reading each API's pricing page before diving in, I would've skipped the first three and saved some tokens. But this is the tradeoff with agentic engineering — the iteration speed is so fast that "just try it" is often cheaper than "research it first." Sometimes you burn some cents figuring that out.
At this point I had this user flow: open the app → see upcoming matches with real odds → pick a match → pick a prediction → place a bet → see it in the shared bet list.

## The admin backdoor

I needed a way to sync match data without exposing it to users.

> _"Let's expose administrative endpoints inside admin/ which can be only accessed using a super secret token, this is our little backdoor. Add the sync action there."_

The agent:
- Created an `AdminAuth` extractor in Rust that checks an `X-Admin-Token` header
- Moved the sync endpoint to `POST /admin/events/sync`
- Removed the old public sync route and the frontend button
- Added `ADMIN_TOKEN` to the environment variables

This was a deliberate shortcut. The plan had a whole phase for background workers — a Tokio task that would auto-sync events and resolve bets on a loop. But Render's free tier spins down after 15 minutes of inactivity, which kills any long-running process. Until I upgrade or set up cron jobs, a `curl` one-liner does the job. The endpoint is ready to be called by anything — a cron job, a Render Cron Job, or just me hitting it manually before matchday.

![Syncing events via the admin endpoint](/assets/images/vibe-events.jpeg)

## Polish that matters

This is where vibe coding really shines. Instead of spending hours tweaking CSS, I just said things like:

- _"Make the event listing buttons white (or near white), change the inner element styles accordingly"_
- _"The icon crests are showing inside a circle, this breaks the visual for some of them"_
- _"Make the team crests slightly bigger"_
- _"Let's make the team crests even bigger, maybe 48px?"_
- _"Change the '(crest) Team A vs (crest) Team B' layout to 'Team A (crest) vs (crest) Team B', the VS should be aligned"_
- _"The VS should be equidistant between the crests"_
- _"Make the crest shadow a little bit smoother"_
- _"Is it possible to add a white border to the PNG images? I want the border to be on the actual crest, not in the image square itself"_
- _"Now change the match cards to dark again"_
- _"Let's make this responsive now: use an ellipsis when the team name is too long, show just the crests when the screen is too narrow"_
- _"In the 'your pick' buttons, put the odds in the next line, style it differently"_
- _"Use a pill to encapsulate the odds value inside the prediction button"_
- _"As an user, the matches I already betted should be blocked in some way, and I should see that"_

Each request took about 30 seconds. The agent refactored the CSS grid, added `drop-shadow()` filters, created responsive breakpoints, and restructured the entire event card layout — all while I watched.

Some of these were genuinely hard CSS problems. The vertical alignment of "vs" across cards required switching from flexbox to CSS grid with explicit `grid-column` placement. The crest border required `drop-shadow()` calls that follow the PNG's alpha channel. And then there was the yellow button bug:

> _"The .bet-form button has a yellow background, and .team-name which lives inside it, has a white color, it's ugly"_
> _"The yellow is coming from .bet-form button"_

A CSS specificity leak — the bet form's button styles were bleeding into the event cards. The agent added overrides to lock the event cards to their own theme. I wouldn't have caught that specificity bug without scrolling through computed styles for 20 minutes.

The crests themselves came from a raw HTML table I pasted:

> _"Download all the crests, it's better to have them locally"_
> _"Here are the actual logos"_

(followed by a massive HTML table with 75 team logos)

The agent extracted every `<img>` src, downloaded them, but there was a problem:

> _"Now for the actual crest files, they are all different sizes, formats and some of them are missing the transparent background, how can we solve that? I have imagemagick"_
> _"Most of the crests have white as part of the crest, I just want to remove their background"_

The agent wrote ImageMagick commands to floodfill the background to transparent, normalize every crest to a consistent size, and convert them all to PNG. Seventy-five team logos, batch-processed, with the white parts of the crest preserved.

![Placing a bet with prediction bar](/assets/images/vibe-bet-desktop.png)

![Mobile responsive view](/assets/images/vibe-bet-mobile.png)

## Shipping to production

Then, jumping straight to the plan's last phase:

> _"Let's jump to phase 8, I want to ship this app to render. Let's make both the frontend and backend live in the same container, once started, both will behave as one."_

The agent:
- Wrote a multi-stage Dockerfile: Node builds the frontend, Rust builds the backend, Debian slim runs both
- Added `VITE_GOOGLE_CLIENT_ID` as a Docker build arg
- Created a `.dockerignore`
- Set up `ENVIRONMENT=production` and `CORS_ALLOWED_ORIGINS`

The first deploy failed. I pasted the error:

> _"Got this on render: error: rustc 1.86.0 is not supported by the following packages..."_

The agent bumped the Rust image to `1.88` and it worked.

Then the app exited with no logs — just "Application exited early." I told it:

> _"There are no logs, it just says the application exited early"_

Turned out the binary was crashing because `libssl3` was missing from the runtime image. The agent added it and the deploy went green.

Within a few iterations, the app was live at [sobrounadapro.bet](https://sobrounadapro.bet). (I registered the domain myself and pointed it at Render — the agent doesn't have a credit card.)

![Full app in production](/assets/images/vibe-prod.png)

## What vibe coding cost

I used DeepSeek through its API, billed per token. Across all sessions — from scaffolding the project to deploying on Render, and yes, including writing this blog post — the total was **$2.96 USD**.

That's two dollars and ninety-six cents. For a full-stack app, in production, plus the blog post you're reading right now.

To put that in perspective: the domain was the most expensive line item. The AI that built everything cost less than a coffee.

![DeepSeek API billing dashboard](/assets/images/vibe-deepseek.png)

## What vibe coding felt like

The conversation with the agent was continuous. I'd describe a feature, it would read my codebase, make changes across multiple files, and tell me what it did. I'd test it, find an issue, and say "this is broken because X." It would fix it. We went back and forth for about 16 hours total across several sessions in two days.

The hardest parts weren't technical — they were communication problems. Sometimes I described something poorly and the agent implemented the wrong thing. Sometimes it would fix one bug but introduce another. But the iteration speed was so fast that it rarely mattered. I could say "undo that" or "try a different approach" and it would pivot immediately.

The agent was especially good at:
- Boilerplate: scaffolding entire components, wiring up routes, writing migrations
- CSS: complex layouts, responsive design, subtle visual effects
- Debugging: reading error messages and fixing root causes
- Documentation: keeping PLAN.md and AGENTS.md in sync as we built

It struggled most with:
- Understanding nuanced UI behavior ("the VS should be vertically aligned" took 5 iterations)
- CSS specificity conflicts from earlier changes ("the yellow is coming from .bet-form button")
- Knowing when to refactor instead of patching

## This is just how we build now

Six months ago, building a full-stack app meant weeks of solo work — scaffolding, debugging, styling, deploying. Today it's a conversation.

The agent isn't replacing developers. It's changing what "development" means. You don't spend hours writing CSS grid layouts — you describe the behavior you want and iterate in 30-second loops. You don't memorize Cargo feature flags or SQLx query syntax — you paste the error and the agent fixes it. You don't read API docs end-to-end — you throw the agent at them and see what sticks.

But you still need to be the one making decisions. The agent doesn't know that the third football API has real odds on the free tier, or that you should harden error handling before shipping to production, or that $2.96 is the price of a full-stack app plus a blog post.

Agentic engineering isn't about replacing developers — it's about removing the busywork so you can focus on the choices that matter. The agent writes the code. You make the calls.

## What's next

The MVP is done — you can log in, join a group, bet on real Brasileirão matches, and climb the leaderboard. But there's more in the plan.

Auto-resolve is already built. The endpoint (`POST /admin/bets/resolve`) fetches scores from the-odds-api.com and resolves every pending bet — comparing predictions against actual results, updating statuses, crediting payouts. The catch: it hasn't been tested yet. The Brasileirão season starts August 8th. Once games start finishing, a single `curl` command will tell me if it works.

The original plan called for a background worker — a Tokio task that syncs events and resolves bets on a daily loop. But Render's free tier spins down after 15 minutes of inactivity, which kills any long-running process. Instead, I'm using admin endpoints triggered manually or via cron. It's less elegant, but it's practical — and it costs nothing.

Beyond auto-resolve: email notifications when bets settle, a proper activity feed, bet history with win/loss streaks, and i18n support for Brazilian Portuguese. The plan has it all mapped out. The agent is waiting.

The full source is on [GitHub](https://github.com/cuchi/sobrou-nada-pro-bet) under Apache 2.0.

---

_Written by DeepSeek V4 Pro, curated and vibe-edited by Paulo Henrique Cuchi_
