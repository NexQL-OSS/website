# NexQL site — quick action commands (Astro + Preact islands).
# Static output: `astro build` -> dist/. Backend is a separate Vercel
# project; vercel.json rewrites /api/* there.

PORT ?= 3000
URL  := http://localhost:$(PORT)

.PHONY: help install dev build preview serve vercel open stop clean

# Default target: list available commands.
help:
	@echo "NexQL site — make targets (PORT=$(PORT)):"
	@echo "  make install  Install deps (npm ci)"
	@echo "  make dev      Astro dev server + HMR                    -> $(URL)"
	@echo "  make build    Static build -> dist/"
	@echo "  make preview  Serve the built dist/ via Astro           -> $(URL)"
	@echo "  make serve    Serve dist/ via python3 (no deps)         -> $(URL)"
	@echo "  make vercel   vercel dev: cleanUrls + /api proxy (npx)  -> $(URL)"
	@echo "  make open     Open $(URL) in the default browser"
	@echo "  make stop     Kill whatever is bound to port $(PORT)"
	@echo "  make clean    Remove dist/ and .astro/"
	@echo ""
	@echo "Note: 'make dev' is the normal loop. /api/* only resolves under"
	@echo "      'make vercel'; otherwise it 404s and pricing falls back to"
	@echo "      page defaults."
	@echo "      On low-RAM WSL (~2Gi), 'astro dev' can OOM (exit 137) mid-"
	@echo "      response and look like a truncated page — use"
	@echo "      'make build && make serve' (or 'make preview') instead."

install:
	npm ci

# Primary dev loop: HMR. --force replaces a stale Astro process on the same port.
dev:
	npm run dev -- --port $(PORT) --force

build:
	npm run build

# Serve the built output through Astro's preview server.
preview: build
	npm run preview -- --port $(PORT)

# Dependency-free static serve of an existing build.
serve:
	python3 -m http.server $(PORT) --directory dist

# Vercel-accurate: honors vercel.json (cleanUrls, /api/* rewrite).
vercel:
	npx --yes vercel dev --listen $(PORT)

open:
	python3 -m webbrowser -t "$(URL)"

# Free the port (e.g. a stale server). No-op if nothing is listening.
stop:
	@fuser -k $(PORT)/tcp 2>/dev/null && echo "Stopped listener on port $(PORT)." || echo "Nothing listening on port $(PORT)."

clean:
	rm -rf dist .astro
