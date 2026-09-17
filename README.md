# Project Adda — Functional Beta v0.3

Functional multi-user validation build for Project Adda.

This repository contains the mobile-first beta, Netlify Function API, persistent Crew/Drop/chat state using Netlify Blobs, and the internal research console.

## Test objective
Validate the core loop with real users:

Create Crew → invite friends → create Drop → answer across devices → shared threshold unlocks → Reveal → next Drop / Crew Chat.

## Deployment
Designed for Netlify. `netlify.toml` publishes the repository root and Netlify automatically builds the function under `netlify/functions/`.
