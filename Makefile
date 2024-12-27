# Make this makefile self-documented with target `help`
.PHONY: help
.DEFAULT_GOAL := help
help: ## Show help
	@grep -Eh '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Run in local development mode
	hugo -D -F --gc -w server

.PHONY: clean
clean: ## Remove build artifacts
	rm -r ./public

.PHONY: build
build: clean ## Build the website
	hugo build

.PHONY: lint
lint: build ## Lint the website
	lychee ./public/ --base 'https://dzx.cz' --remap 'dzx.com ./public' --exclude 'linkedin.com' --require-https
