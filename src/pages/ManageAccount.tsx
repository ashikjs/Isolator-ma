import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CreditCard, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ManageAccount({ isPaid }: any) {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCancelSubscription = async () => {
    if (!user || !isPaid) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/.netlify/functions/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.subscription_id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      // Update subscription status in database
      const { error: dbError } = await supabase
        .from('user_subscriptions')
        .update({
          is_subscribed: false,
          subscription_id: null,
          free_tier_usage: 0 // Reset free tier usage when cancelling
        })
        .eq('user_id', user.id);

      if (dbError) {
        throw dbError;
      }

      setSuccess('Your subscription has been cancelled successfully.');

      // Refresh the page after a short delay to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Sign in Required</h2>
          <p className="text-gray-600 text-center mb-6">
            Please sign in to access your account settings.
          </p>
          <Link
            to="/signin"
            className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              <p className="text-gray-600">Email: {user.email}</p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {!subscription?.is_subscribed ? 'Essential Plan' : 'Free Plan'}
                    </h3>
                    <p className="text-gray-600">
                      {!subscription?.is_subscribed
                        ? '$3.99/month'
                        : `${3 - (subscription?.free_tier_usage || 0)} calculations remaining`}
                    </p>
                  </div>
                </div>

                {subscription?.is_subscribed && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                )}

                {!subscription?.is_subscribed && (
                  <Link
                    to="/checkout"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade to Essential Plan
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
