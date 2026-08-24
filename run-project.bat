@echo off
setlocal

cd /d "%~dp0"

if /i "%~1"=="stop" goto stop
if /i "%~1"=="logs" goto logs

where docker >nul 2>&1
if errorlevel 1 (
    echo Docker was not found.
    echo Install Docker Desktop, start it, then run this file again.
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop is not running.
    echo Start Docker Desktop, wait until it is ready, then run this file again.
    exit /b 1
)

echo Pulling the PostgreSQL image...
docker compose pull postgres
if errorlevel 1 exit /b 1

echo Starting PostgreSQL...
docker compose up -d postgres
if errorlevel 1 (
    echo Project startup failed. Show logs with: run-project.bat logs
    exit /b 1
)

echo Waiting for PostgreSQL to become ready...
set /a attempts=0
:wait_for_postgres
docker compose exec -T postgres pg_isready -U postgres -d localdb >nul 2>&1
if not errorlevel 1 goto database_ready
set /a attempts+=1
if %attempts% GEQ 30 (
    echo PostgreSQL did not become ready in time.
    docker compose logs postgres
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto wait_for_postgres

:database_ready
echo Creating database tables and loading seed data...
docker compose exec -T postgres psql -U postgres -d localdb -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/01-schema.sql
if errorlevel 1 exit /b 1
docker compose exec -T postgres psql -U postgres -d localdb -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/02-seed.sql
if errorlevel 1 exit /b 1

echo Building and starting backend and frontend...
docker compose up --build -d back front
if errorlevel 1 (
    echo Project startup failed. Show logs with: run-project.bat logs
    exit /b 1
)

echo.
echo Project is running:
echo   Frontend: http://localhost:4200
echo   Backend:  http://localhost:8080
echo   Database: localhost:5432
echo.
echo Show live logs with: run-project.bat logs
echo Stop all services with: run-project.bat stop
exit /b 0

:logs
docker compose logs -f back front
exit /b %errorlevel%

:stop
docker compose down
exit /b %errorlevel%
