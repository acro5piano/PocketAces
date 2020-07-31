install:
	yarn install
	yarn lerna bootstrap

test: install
	yarn lerna exec tsc
	mkdir coverage || true
	yarn lerna run test:coverage
	test -n "$$CODECOV_TOKEN"
	cd packages/core && bash <(curl -s https://codecov.io/bash)

prepublish:
	test -n "$$NPM_TOKEN"
	echo "//registry.npmjs.org/:_authToken=$$NPM_TOKEN" > ~/.npmrc

publish: install prepublish
	cd packages/core && npm publish

.DEFAULT_GOAL := install
