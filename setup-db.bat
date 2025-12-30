@echo off
echo.
echo 🚀 Zodiacly Database Setup
echo ==========================
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please create .env file from .env.example
    exit /b 1
)

REM Check if DATABASE_URL is set
findstr /C:"postgresql://user:password@localhost:5432/zodiacly" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  WARNING: DATABASE_URL still has placeholder values!
    echo.
    echo Please update DATABASE_URL in .env with your actual database connection string.
    echo.
    echo Options:
    echo 1. Neon.tech (free cloud PostgreSQL^)
    echo 2. Local PostgreSQL installation
    echo 3. Docker PostgreSQL container
    echo.
    echo See DATABASE_SETUP.md for detailed instructions.
    exit /b 1
)

echo ✅ .env file found
echo ✅ DATABASE_URL configured
echo.

REM Run Prisma migrations
echo 📦 Running Prisma migrations...
call npx prisma migrate dev --name init

if %errorlevel% neq 0 (
    echo ❌ Migration failed!
    exit /b 1
)

echo ✅ Migrations completed successfully
echo.

REM Generate Prisma Client
echo 🔧 Generating Prisma Client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed!
    exit /b 1
)

echo ✅ Prisma Client generated
echo.
echo 🎉 Database setup complete!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Visit http://localhost:3000
echo 3. Register your first account
echo 4. Open Prisma Studio to make your account ADMIN:
echo    npx prisma studio
echo.
pause
