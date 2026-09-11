# Dragon Spark

Dragon Spark is an XVIII Airborne Corps mission intake dashboard for Soldier-led problems and digital capability visibility. It helps users submit operational problems quickly, route them to the right Corps or division innovation cell, track status, and give Corps staff a single triage view across subordinate units.

## Current Capabilities

- Mission problem submission with a manual path or optional Gemini-assisted drafting.
- Required-field validation and post-submit confirmation.
- Automatic routing by unit/division, with an ODS lane for Corps-level software, data, AI, automation, and network/communications problems.
- Manual Corps staff routing from the admin view.
- Status dashboard by echelon across Submitted, Scoped, Assigned, In Prototype, Testing, and Delivered.
- Corps staff admin view with search, filters, urgency/status sorting, summary metrics, and POC/last-updated visibility.
- Digital capability catalog to reduce duplicated software, dashboards, spreadsheets, AI tools, and related efforts.

## Requirements

- Java 17
- Node 20
- Docker
- Yarn or npm

## Local Setup

Start Postgres:

```shell
docker-compose up -d
```

Configure Gemini AI if you want AI-assisted drafting:

```shell
export GEMINI_API_KEY="your-google-ai-studio-api-key"
export GEMINI_MODEL="gemini-3.5-flash"
```

You can also put those values in a local `.env` file at the project root:

```shell
GEMINI_API_KEY=your-google-ai-studio-api-key
GEMINI_MODEL=gemini-3.5-flash
```

Do not commit API keys or local secrets.

Apply database migrations:

```shell
./gradlew flywayMigrate
```

Start the backend:

```shell
./gradlew bootRun
```

The backend runs at [http://localhost:8080](http://localhost:8080).

Start the frontend development server:

```shell
cd frontend
yarn start
```

The frontend runs at [http://localhost:3000](http://localhost:3000).

## Useful Commands

Run backend tests:

```shell
./gradlew test
```

Compile the frontend:

```shell
cd frontend
npm run compile
```

Build the frontend:

```shell
cd frontend
npm run build
```

## Notes

The app currently records `lastUpdated` for submissions and assignment changes. It does not yet track separate created, scoped, tested, or delivered dates, so quarterly delivery reporting will require additional timestamp fields.
