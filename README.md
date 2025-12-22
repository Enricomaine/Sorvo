# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)
# Sorvo

## Background Jobs & Email
- Jobs: Uses Sidekiq with Redis via ActiveJob (`:sidekiq`).
- Parallel delivery: Mailers enqueue to Redis and are processed concurrently by Sidekiq workers.

### Environment Variables
- **Redis**: `REDIS_URL` (default `redis://localhost:6379/0`).
- **SMTP (App account)**:
	- `SMTP_ADDRESS` (e.g. `smtp.gmail.com`)
	- `SMTP_PORT` (default `587`)
	- `SMTP_USER`
	- `SMTP_PASSWORD`
	- `SMTP_AUTH` (default `plain`)
	- `SMTP_STARTTLS` (default `true`)
	- `SMTP_FROM` (default `no-reply@example.com`)

You can also use Rails credentials under `smtp/*` for production.

### Running Locally
```bash
# Install deps
bundle install

# Start Redis (if not already running)
sudo apt-get update && sudo apt-get install -y redis-server
sudo systemctl enable --now redis-server

# Start Rails API
bin/dev

# Start Sidekiq workers (in another terminal)
bundle exec sidekiq -q default -q mailers
```

### Sending Emails
- App account: `EmailSenderService.send_email(account: :app, to: "dest@example.com", subject: "Hello", text_body: "Hi!")`
- User account: ensure the `User` has SMTP fields filled, then:
	`EmailSenderService.send_email(account: :user, user: current_user, to: "dest@example.com", subject: "Hello", text_body: "Hi!")`

### Migrations
Run migrations to add user SMTP fields:
```bash
rails db:migrate
```
