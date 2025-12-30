#!/bin/bash

echo "🚀 Zodiacly Database Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Check if DATABASE_URL is set
if grep -q "postgresql://user:password@localhost:5432/zodiacly" .env; then
    echo "⚠️  WARNING: DATABASE_URL still has placeholder values!"
    echo ""
    echo "Please update DATABASE_URL in .env with your actual database connection string."
    echo ""
    echo "Options:"
    echo "1. Neon.tech (free cloud PostgreSQL)"
    echo "2. Local PostgreSQL installation"
    echo "3. Docker PostgreSQL container"
    echo ""
    echo "See DATABASE_SETUP.md for detailed instructions."
    exit 1
fi

echo "✅ .env file found"
echo "✅ DATABASE_URL configured"
echo ""

# Run Prisma migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed!"
    exit 1
fi

echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated"
else
    echo "❌ Prisma generate failed!"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000"
echo "3. Register your first account"
echo "4. Open Prisma Studio to make your account ADMIN:"
echo "   npx prisma studio"
echo ""
