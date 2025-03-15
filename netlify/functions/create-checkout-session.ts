import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler: Handler = async (event) => {
  // Handle OPTIONS request (for CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: 'Method not allowed'
      })
    };
  }

  try {
    // Log for debugging
    console.log('Function called with event:', JSON.stringify(event));
    
    // Ensure we have a body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Request body is required'
        })
      };
    }

    // Parse the body and validate priceId
    let priceId;
    try {
      const parsedBody = JSON.parse(event.body);
      priceId = parsedBody.priceId;
      console.log('Received priceId:', priceId);
    } catch (e) {
      console.error('JSON parsing error:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON in request body'
        })
      };
    }

    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Price ID is required'
        })
      };
    }

    console.log('Creating Stripe session with price:', priceId);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.URL || 'http://localhost:8888'}?success=true`,
      cancel_url: `${process.env.URL || 'http://localhost:8888'}?canceled=true`,
    });

    console.log('Session created:', session.id);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};

export { handler };