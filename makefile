.PHONY: build test help events invoke serverless

.DEFAULT_GOAL := help

help:
	@grep -P '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := dk_npm
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
  # use the rest as arguments for the command
  COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(COMMAND_ARGS):;@:)
endif

install:
	npm install

dk_npm: ## allow to run dockerized npm command eg make dk_npm 'install koa --save'
	docker-compose -f docker-compose.util.yml run --rm npm $(COMMAND_ARGS)

dk_install:
	docker-compose -f docker-compose.util.yml run --rm npm install

dk_setup_smoker_table: ## run serverless lambda
	docker-compose -f docker-compose.util.yml run --rm serverless webpack invoke -f setupTables

dk_run:
	docker-compose up

run-webpack-dev-server:
	BABEL_ENV=browser node node_modules/webpack-dev-server/bin/webpack-dev-server.js --port 3001 --host 0.0.0.0

run-serverless-dev-server:
	BABEL_ENV=node SLS_DEBUG=true node_modules/serverless/bin/serverless webpack serve --port 3000 --host 0.0.0.0

test:
	docker-compose -f docker-compose.test.yml run test

deploy-serverless:
	docker-compose -f docker-compose.util.yml run --rm deploy

deploy-frontend:
	aws --region=eu-west-1 s3 sync --delete build/ "s3://tobbaccobot-frontend"

deploy: build-front-end deploy-frontend deploy-serverless

build-front-end:
	BABEL_ENV=browser ./node_modules/.bin/webpack $(if $(filter production staging test,$(NODE_ENV)),-p -d) -p --progress
