import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zodiacly.com' },
    update: {},
    create: {
      email: 'admin@zodiacly.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      plan: 'PRO', // Admin gets PRO plan
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create Regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@zodiacly.com' },
    update: {},
    create: {
      email: 'user@zodiacly.com',
      passwordHash: userPassword,
      role: 'USER',
      plan: 'FREE',
    },
  })

  console.log('✅ Regular user created:', user.email)

  // Create usage records
  await prisma.usage.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      aiCallsThisMonth: 0,
      lastResetAt: new Date(),
    },
  })

  await prisma.usage.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      aiCallsThisMonth: 0,
      lastResetAt: new Date(),
    },
  })

  console.log('✅ Usage records created')
  console.log('\n📋 Login Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👑 ADMIN:')
  console.log('   Email: admin@zodiacly.com')
  console.log('   Password: admin123')
  console.log('   Access: /admin dashboard')
  console.log('\n👤 USER:')
  console.log('   Email: user@zodiacly.com')
  console.log('   Password: user123')
  console.log('   Plan: FREE')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
