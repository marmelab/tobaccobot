.PHONY: build test help
.DEFAULT_GOAL := help

help:
	@grep -P '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

migrate: ## Migrate the database defined in the configuration (you may define the NODE_ENV)
	@docker-compose run serverless-dev-server node ./node_modules/.bin/db-migrate \
        --migrations-dir=./src/serverless/migrations \
        --config=config/database.js \
        up

create-migration: ## Create a new migration (you may define the NODE_ENV to select a specific configuration)
	@./node_modules/.bin/db-migrate \
        --migrations-dir=./src/serverless/migrations \
        --config=config/database.js \
        create migration
