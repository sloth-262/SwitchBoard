# Project Structure

This repository was scaffolded as a Laravel 10 API skeleton. The existing `.git/` directory was preserved and not re-initialized.

## Files And Folders Created

The Laravel scaffold created the standard application files and folders. I also added or updated the hackathon-specific API setup:

- `app/Http/Controllers/Api/.gitkeep`
- `app/Services/.gitkeep`
- `database/database.sqlite`
- `routes/api.php`
- `.env`
- `.env.example`
- `README.md`
- `PROJECT_STRUCTURE.md`

Composer also created `vendor/`, which is required locally but ignored by git.

## Tree

```text
SwitchBoard/
|-- .editorconfig
|-- .env
|-- .env.example
|-- .gitattributes
|-- .gitignore
|-- README.md
|-- PROJECT_STRUCTURE.md
|-- artisan
|-- composer.json
|-- composer.lock
|-- package.json
|-- phpunit.xml
|-- vite.config.js
|-- app/
|   |-- Console/
|   |   `-- Kernel.php
|   |-- Exceptions/
|   |   `-- Handler.php
|   |-- Http/
|   |   |-- Controllers/
|   |   |   |-- Api/
|   |   |   |   `-- .gitkeep
|   |   |   `-- Controller.php
|   |   |-- Kernel.php
|   |   `-- Middleware/
|   |-- Models/
|   |   `-- User.php
|   |-- Providers/
|   |   |-- AppServiceProvider.php
|   |   |-- AuthServiceProvider.php
|   |   |-- BroadcastServiceProvider.php
|   |   |-- EventServiceProvider.php
|   |   `-- RouteServiceProvider.php
|   `-- Services/
|       `-- .gitkeep
|-- bootstrap/
|   |-- app.php
|   `-- cache/
|-- config/
|   |-- app.php
|   |-- auth.php
|   |-- broadcasting.php
|   |-- cache.php
|   |-- cors.php
|   |-- database.php
|   |-- filesystems.php
|   |-- hashing.php
|   |-- logging.php
|   |-- mail.php
|   |-- queue.php
|   |-- sanctum.php
|   |-- services.php
|   |-- session.php
|   `-- view.php
|-- database/
|   |-- database.sqlite
|   |-- factories/
|   |   `-- UserFactory.php
|   |-- migrations/
|   |   |-- 2014_10_12_000000_create_users_table.php
|   |   |-- 2014_10_12_100000_create_password_reset_tokens_table.php
|   |   |-- 2019_08_19_000000_create_failed_jobs_table.php
|   |   `-- 2019_12_14_000001_create_personal_access_tokens_table.php
|   `-- seeders/
|       `-- DatabaseSeeder.php
|-- public/
|   |-- .htaccess
|   |-- favicon.ico
|   |-- index.php
|   `-- robots.txt
|-- resources/
|   |-- css/
|   |   `-- app.css
|   |-- js/
|   |   |-- app.js
|   |   `-- bootstrap.js
|   `-- views/
|       `-- welcome.blade.php
|-- routes/
|   |-- api.php
|   |-- channels.php
|   |-- console.php
|   `-- web.php
|-- storage/
|   |-- app/
|   |-- framework/
|   `-- logs/
|-- tests/
|   |-- CreatesApplication.php
|   |-- Feature/
|   |   `-- ExampleTest.php
|   |-- TestCase.php
|   `-- Unit/
|       `-- ExampleTest.php
`-- vendor/
    `-- Composer dependencies, ignored by git
```

## Git Ignore Check

The Laravel `.gitignore` excludes:

- `vendor/`
- `.env`
- `node_modules/`

