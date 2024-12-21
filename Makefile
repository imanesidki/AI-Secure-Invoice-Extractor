all: build

build:
	docker-compose -f compose.yml build
	docker-compose -f compose.yml up -d

down:
	docker stop $(shell docker ps -aq)

clean:
	docker-compose -f compose.yml down
	docker container prune -f
	docker system prune -f
	docker image prune -af
	docker network prune -f
	docker volume prune -f

purge: clean
	rm -rf ./frontend/node_modules
	rm -rf ./frontend/.next
	rm -rf ./backend/fastapi/__pycache__

logs:
	docker-compose -f compose.yml logs -f

re : down all