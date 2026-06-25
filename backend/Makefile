setup:
	docker-compose up -d
	docker-compose exec app composer install
	docker-compose exec app cp .env.example .env
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate --seed

test:
	docker-compose exec app php artisan test

lint:
	docker-compose exec app ./vendor/bin/pint

analyse:
	docker-compose exec app ./vendor/bin/phpstan analyse

fresh:
	docker-compose exec app php artisan migrate:fresh --seed
