// Test Stripe Connection
const Stripe = require('stripe')
require('dotenv').config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

async function testStripeConnection() {
  console.log('🔍 Testing Stripe Connection...\n')

  try {
    // 1. Test API Key Validity
    console.log('1️⃣ Testing API Key Validity...')
    const balance = await stripe.balance.retrieve()
    console.log('✅ API Key Valid!')
    console.log(`   Available Balance: ${balance.available[0]?.amount || 0} ${balance.available[0]?.currency || 'N/A'}`)
    console.log(`   Pending Balance: ${balance.pending[0]?.amount || 0} ${balance.pending[0]?.currency || 'N/A'}\n`)

    // 2. Check if we're in Test or Live mode
    console.log('2️⃣ Checking Mode...')
    const keyType = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST'
    console.log(`✅ Mode: ${keyType} MODE`)
    if (keyType === 'LIVE') {
      console.log('⚠️  WARNING: You are using LIVE keys! Real charges will be made.\n')
    } else {
      console.log('✅ Safe: Test mode enabled\n')
    }

    // 3. Fetch PRO Monthly Price Details
    console.log('3️⃣ Fetching PRO Monthly Price...')
    if (process.env.STRIPE_PRICE_PRO_MONTHLY && !process.env.STRIPE_PRICE_PRO_MONTHLY.includes('...')) {
      try {
        const monthlyPrice = await stripe.prices.retrieve(process.env.STRIPE_PRICE_PRO_MONTHLY)
        console.log('✅ PRO Monthly Price Found!')
        console.log(`   Price ID: ${monthlyPrice.id}`)
        console.log(`   Amount: ${monthlyPrice.unit_amount / 100} ${monthlyPrice.currency.toUpperCase()}`)
        console.log(`   Interval: ${monthlyPrice.recurring?.interval || 'N/A'}`)
        console.log(`   Active: ${monthlyPrice.active}`)

        // Fetch product details
        const product = await stripe.products.retrieve(monthlyPrice.product)
        console.log(`   Product: ${product.name}`)
        console.log(`   Description: ${product.description || 'N/A'}\n`)
      } catch (err) {
        console.log(`❌ Error fetching monthly price: ${err.message}\n`)
      }
    } else {
      console.log('⚠️  PRO Monthly Price ID not configured (still placeholder)\n')
    }

    // 4. Fetch PRO Yearly Price Details
    console.log('4️⃣ Fetching PRO Yearly Price...')
    if (process.env.STRIPE_PRICE_PRO_YEARLY && !process.env.STRIPE_PRICE_PRO_YEARLY.includes('...')) {
      try {
        const yearlyPrice = await stripe.prices.retrieve(process.env.STRIPE_PRICE_PRO_YEARLY)
        console.log('✅ PRO Yearly Price Found!')
        console.log(`   Price ID: ${yearlyPrice.id}`)
        console.log(`   Amount: ${yearlyPrice.unit_amount / 100} ${yearlyPrice.currency.toUpperCase()}`)
        console.log(`   Interval: ${yearlyPrice.recurring?.interval || 'N/A'}`)
        console.log(`   Active: ${yearlyPrice.active}\n`)
      } catch (err) {
        console.log(`❌ Error fetching yearly price: ${err.message}\n`)
      }
    } else {
      console.log('⚠️  PRO Yearly Price ID not configured (still placeholder)\n')
    }

    // 5. Check Webhook Secret
    console.log('5️⃣ Checking Webhook Secret...')
    if (process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('...')) {
      console.log('✅ Webhook Secret configured')
      console.log(`   Secret: whsec_****${process.env.STRIPE_WEBHOOK_SECRET.slice(-4)}\n`)
    } else {
      console.log('⚠️  Webhook Secret not configured (still placeholder)')
      console.log('   You need to set up webhook endpoint in Stripe Dashboard\n')
    }

    // 6. List recent customers (to verify DB integration)
    console.log('6️⃣ Checking Recent Customers...')
    const customers = await stripe.customers.list({ limit: 5 })
    console.log(`✅ Found ${customers.data.length} recent customers`)
    if (customers.data.length > 0) {
      customers.data.forEach((customer, i) => {
        console.log(`   ${i + 1}. ${customer.email || 'No email'} (ID: ${customer.id})`)
      })
    } else {
      console.log('   No customers yet (fresh account)')
    }
    console.log('')

    // 7. List products
    console.log('7️⃣ Checking Products...')
    const products = await stripe.products.list({ limit: 5, active: true })
    console.log(`✅ Found ${products.data.length} active products`)
    products.data.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.name} (ID: ${product.id})`)
    })
    console.log('')

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 SUMMARY:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Stripe Connection: WORKING`)
    console.log(`✅ API Keys: VALID (${keyType} MODE)`)
    console.log(`${process.env.STRIPE_PRICE_PRO_MONTHLY && !process.env.STRIPE_PRICE_PRO_MONTHLY.includes('...') ? '✅' : '⚠️ '} Monthly Price: ${process.env.STRIPE_PRICE_PRO_MONTHLY && !process.env.STRIPE_PRICE_PRO_MONTHLY.includes('...') ? 'Configured' : 'Missing'}`)
    console.log(`${process.env.STRIPE_PRICE_PRO_YEARLY && !process.env.STRIPE_PRICE_PRO_YEARLY.includes('...') ? '✅' : '⚠️ '} Yearly Price: ${process.env.STRIPE_PRICE_PRO_YEARLY && !process.env.STRIPE_PRICE_PRO_YEARLY.includes('...') ? 'Configured' : 'Missing'}`)
    console.log(`${process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('...') ? '✅' : '⚠️ '} Webhook Secret: ${process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('...') ? 'Configured' : 'Missing'}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Next steps
    console.log('📝 NEXT STEPS:')
    if (!process.env.STRIPE_PRICE_PRO_YEARLY || process.env.STRIPE_PRICE_PRO_YEARLY.includes('...')) {
      console.log('   1. Create PRO Yearly price in Stripe Dashboard')
      console.log('      → Amount: €119 (11900 cents)')
      console.log('      → Interval: Yearly')
      console.log('      → Copy Price ID to .env')
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET.includes('...')) {
      console.log('   2. Set up Webhook Endpoint:')
      console.log('      → URL: https://yourdomain.com/api/stripe/webhooks')
      console.log('      → Events: checkout.session.completed, customer.subscription.*')
      console.log('      → Copy Webhook Secret to .env')
    }
    if (keyType === 'LIVE') {
      console.log('   3. ⚠️  Consider using TEST mode during development!')
      console.log('      → Use sk_test_... and pk_test_... keys')
    }

  } catch (error) {
    console.error('❌ Error testing Stripe connection:')
    console.error(`   ${error.message}`)

    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  Your API key is invalid or missing!')
      console.error('   Check STRIPE_SECRET_KEY in .env file')
    }
  }
}

testStripeConnection()
