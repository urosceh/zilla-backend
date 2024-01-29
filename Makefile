prepare-test:
	docker-compose -f ./test/docker-compose.test.yml up -d postgres-test
	docker-compose -f ./test/docker-compose.test.yml up --build --no-deps migrations-test

down-test:
	docker-compose -f ./test/docker-compose.test.yml stop && docker-compose -f ./test/docker-compose.test.yml down

kill-test: 
	docker-compose -f ./test/docker-compose.test.yml stop && docker-compose -f ./test/docker-compose.test.yml down -v