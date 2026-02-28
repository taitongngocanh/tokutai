# Habit Quest

A gamified habit tracking system where users level up like in a game. Built with React, Spring Boot, and PostgreSQL.

![Habit Quest](https://img.shields.io/badge/Stack-React%20%7C%20Spring%20Boot%20%7C%20PostgreSQL-blue)

## Features

- **XP Rank System**: Bronze (0-999 XP) → Gold (1000-2999 XP) → Diamond (3000+ XP)
- **Good Habits**: Create habits, gain XP on completion, daily reset to prevent double completion
- **Bad Habits**: Track violations, lose XP
- **Reward Shop**: Create custom rewards, spend XP to "buy" them
- **JWT Authentication**: Secure register/login
- **Game-like UI**: Dark theme, animated XP bar, confetti on rank up

## Tech Stack

| Layer    | Technology   |
|----------|--------------|
| Frontend | React 19 + Vite + TailwindCSS |
| Backend  | Java 21 + Spring Boot 4 |
| Database | PostgreSQL |
| Auth     | JWT (JSON Web Tokens) |

## Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ (21 recommended) — ensure `JAVA_HOME` points to JDK 17+
- **Maven** 3.8+ (or use included `mvnw`)
- **PostgreSQL** 14+

## Setup Instructions

### 1. Clone & Navigate

```bash
cd tokutai-app
```

### 2. Database Setup

Create a PostgreSQL database named `habitquest`:

```sql
CREATE DATABASE habitquest;
```

Or using `psql`:

```bash
psql -U postgres -c "CREATE DATABASE habitquest;"
```

### 3. Backend Configuration

Create `backend/demo/src/main/resources/application-local.properties` (or use environment variables):

```properties
# Optional overrides - defaults work with local PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/habitquest
spring.datasource.username=postgres
spring.datasource.password=your_password
jwt.secret=your-super-secret-key-at-least-256-bits-long-for-security
```

**Environment variables** (recommended for production):

| Variable        | Description                    | Default              |
|-----------------|--------------------------------|----------------------|
| `DATABASE_URL`  | PostgreSQL JDBC URL            | `jdbc:postgresql://localhost:5432/habitquest` |
| `DATABASE_USERNAME` | DB username               | `postgres`           |
| `DATABASE_PASSWORD` | DB password               | `postgres`           |
| `JWT_SECRET`    | Secret for JWT signing        | (see application.properties) |
| `PORT`          | Server port                    | `8080`               |

### 4. Run the Backend

**Important**: Set `JAVA_HOME` to Java 17+ (e.g. `C:\Program Files\Java\jdk-21` on Windows) if you have multiple JDKs.

```bash
cd backend/demo
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend\demo
.\mvnw.cmd spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 5. Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 6. Configure API URL (Optional)

If the backend runs on a different host/port, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
tokutai-app/
├── backend/
│   └── demo/
│       ├── src/main/java/com/habitquest/
│       │   ├── config/          # Security, CORS
│       │   ├── controller/     # REST API
│       │   ├── dto/            # Request/Response DTOs
│       │   ├── entity/         # JPA entities
│       │   ├── exception/      # Global exception handler
│       │   ├── repository/     # Spring Data JPA
│       │   ├── security/       # JWT filter, UserDetails
│       │   ├── service/        # Business logic
│       │   └── util/           # RankUtil
│       └── src/main/resources/
│           └── application.properties
├── frontend/
│   └── src/
│       ├── api/                # Axios API client
│       ├── components/         # React components
│       ├── context/             # Auth context
│       └── pages/              # Login, Register, Dashboard
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/dashboard` | Get user stats (auth required) |
| GET | `/api/habits/good` | List good habits |
| POST | `/api/habits/good` | Create good habit |
| PUT | `/api/habits/good/{id}` | Update good habit |
| DELETE | `/api/habits/good/{id}` | Delete good habit |
| POST | `/api/habits/good/{id}/complete` | Complete today |
| GET | `/api/habits/bad` | List bad habits |
| POST | `/api/habits/bad` | Create bad habit |
| PUT | `/api/habits/bad/{id}` | Update bad habit |
| DELETE | `/api/habits/bad/{id}` | Delete bad habit |
| POST | `/api/habits/bad/{id}/violate` | Record violation |
| GET | `/api/rewards` | List rewards |
| POST | `/api/rewards` | Create reward |
| PUT | `/api/rewards/{id}` | Update reward |
| DELETE | `/api/rewards/{id}` | Delete reward |
| POST | `/api/rewards/{id}/purchase` | Purchase reward |
| GET | `/api/rewards/history` | Purchase history |
| GET | `/api/xp/history` | XP gain/loss log |

## XP Rules

- XP cannot go below 0
- Rank updates automatically based on total XP
- Good habits: default +50 XP per completion, once per day
- Bad habits: default -30 XP per violation
- Rewards: deduct XP when purchased (no purchase if insufficient XP)

## License

MIT
