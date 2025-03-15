import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';

const publicKey: string = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';
const priceId: string = import.meta.env.VITE_STRIPE_PRICE_ID || '';

const stripePromise = loadStripe(publicKey);

export default function Checkout() {
  console.log('publicKey::', publicKey)
  console.log('priceId::', priceId)
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed!');
      // Clear the free tier usage count since they've upgraded
      sessionStorage.removeItem('calculationCount');
      navigate('/get-started');
    }
    if (query.get('canceled')) {
      console.log('Order canceled');
      navigate('/');
    }
  }, [navigate]);

  const handleCheckout = async () => {
    try {
      setError(null);
      setIsLoading(true);
  
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
  
      console.log('Making request to create checkout session...');
      
      // Call your backend to create the Checkout Session
      // TODO: For local
      //  http://localhost:8888/.netlify/functions/create-checkout-session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
        }),
      });
      
      console.log('Response status:', response.status);
      
      // Important: First check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        let errorMessage = 'Failed to create checkout session';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text
        }
        
        throw new Error(errorMessage);
      }
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid response from server');
      }
  
      if (!data?.sessionId) {
        console.error('Missing sessionId in response:', data);
        throw new Error('Invalid response from server: missing session ID');
      }
  
      console.log('Redirecting to Stripe checkout...');
      // Redirect to Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
  
      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-12"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-medium">Payment Error</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Upgrade to Essential Plan
            </h1>

            <div className="space-y-6 mb-12">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Unlimited Calculations</h3>
                  <p className="text-gray-600">No more restrictions on frequency predictions</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Advanced Analysis</h3>
                  <p className="text-gray-600">Get detailed system analysis and recommendations</p>
                </div>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-500 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900">Priority Support</h3>
                  <p className="text-gray-600">Access to email support for your questions</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <h2 className="text-2xl font-bold text-gray-900">$3.99</h2>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-8">
                Cancel anytime. No long-term commitment required.
              </p>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full py-4 px-8 rounded-lg font-semibold transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? 'Processing...' : 'Upgrade Now'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Secure payment powered by Stripe</p>
              <p className="mt-1">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
