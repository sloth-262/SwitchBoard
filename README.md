# Project Name

Laravel 10 REST API skeleton for hackathon development.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The default environment is configured for SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Create the SQLite database file before running migrations if it does not already exist:

```bash
touch database/database.sqlite
```

## API

- `GET /api/health` returns `{"status":"ok"}`.

Sanctum is installed for API authentication. Add business-specific models, migrations, services, and controllers as features are defined.
