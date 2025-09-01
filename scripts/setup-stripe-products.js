#!/usr/bin/env node

/**
 * Stripe Products Setup Script
 * Creates products and prices in Stripe for PromptOps billing
 * Run this script to set up your Stripe products and get the price IDs
 *
 * Usage: node scripts/setup-stripe-products.js
 */

import 'dotenv/config';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products for PromptOps...\n');

  try {
    // Create Pro Plan Product
    console.log('📦 Creating Pro Plan product...');
    const proProduct = await stripe.products.create({
      name: 'PromptOps Pro Plan',
      description: '1000 prompts, 150 AI enhancements per month',
      metadata: {
        plan: 'pro',
        prompts_limit: '1000',
        enhancements_limit: '150'
      }
    });

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1900, // $19.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'pro'
      }
    });

    console.log(`✅ Pro Plan created: ${proPrice.id}`);

    // Create Team Plan Product
    console.log('📦 Creating Team Plan product...');
    const teamProduct = await stripe.products.create({
      name: 'PromptOps Team Plan',
      description: '7500 prompts, 2000 AI enhancements per month',
      metadata: {
        plan: 'team',
        prompts_limit: '7500',
        enhancements_limit: '2000'
      }
    });

    const teamPrice = await stripe.prices.create({
      product: teamProduct.id,
      unit_amount: 4900, // $49.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'team'
      }
    });

    console.log(`✅ Team Plan created: ${teamPrice.id}`);

    // Create Enterprise Plan Product
    console.log('📦 Creating Enterprise Plan product...');
    const enterpriseProduct = await stripe.products.create({
      name: 'PromptOps Enterprise Plan',
      description: 'Unlimited prompts and AI enhancements',
      metadata: {
        plan: 'enterprise',
        prompts_limit: 'unlimited',
        enhancements_limit: 'unlimited'
      }
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 9900, // $99.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'enterprise'
      }
    });

    console.log(`✅ Enterprise Plan created: ${enterprisePrice.id}`);

    // Display results
    console.log('\n🎉 Stripe products created successfully!\n');
    console.log('📋 Add these Price IDs to your .env file:\n');
    console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`);
    console.log(`STRIPE_TEAM_PRICE_ID=${teamPrice.id}`);
    console.log(`STRIPE_ENTERPRISE_PRICE_ID=${enterprisePrice.id}\n`);

    console.log('🔗 Product URLs in Stripe Dashboard:');
    console.log(`Pro: https://dashboard.stripe.com/products/${proProduct.id}`);
    console.log(`Team: https://dashboard.stripe.com/products/${teamProduct.id}`);
    console.log(`Enterprise: https://dashboard.stripe.com/products/${enterpriseProduct.id}\n`);

    console.log('⚠️  Next steps:');
    console.log('1. Update your .env file with the price IDs above');
    console.log('2. Set up a webhook endpoint in Stripe Dashboard');
    console.log('3. Add the webhook secret to STRIPE_WEBHOOK_SECRET in .env');
    console.log('4. Test the billing flow');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();
