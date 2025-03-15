import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight,
  Waves,
  Ruler,
  Vibrate,
  Check
} from 'lucide-react';
import GetStarted from './pages/GetStarted';
import Results from './pages/Results';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

function Navigation() {
  const { user } = useAuth();
  const calculationCount = parseInt(sessionStorage.getItem('calculationCount') || '0');
  const isFreeTier = calculationCount < 3;

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <>
          {!isFreeTier && (
            <Link 
              to="/signin"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
          )}
          <Link 
            to="/get-started"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/get-started" element={
          <ProtectedRoute requireAuth={false}>
            <GetStarted />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute requireAuth={false}>
            <Results />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Vibrate className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Isolator Modal Analysis</span>
                  </div>
                  <Navigation />
                </div>
              </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                  Optimize Your Vibration Isolation Design
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Advanced isolator modal analysis tool for mechanical engineers. 
                  Get precise system characteristics and performance metrics in seconds.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    to="/get-started"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* How It Works */}
              <div className="mt-32">
                <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                      <Ruler className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">1. Input Parameters</h3>
                    <p className="text-gray-600">Enter your system specifications and requirements.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                      <Waves className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">2. Analysis</h3>
                    <p className="text-gray-600">Our algorithm calculates optimal isolator characteristics.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                      <CheckCircle2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">3. Results</h3>
                    <p className="text-gray-600">Get comprehensive reports and recommendations.</p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div id="pricing" className="mt-32">
                <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
                <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                  Choose the plan that best fits your needs. All plans include access to our core calculation engine.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4">Free</h3>
                    <p className="text-gray-600 mb-6">Perfect for trying out our platform</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        3 natural frequency calculations
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        No sign up required
                      </li>
                    </ul>
                    <Link 
                      to="/get-started"
                      className="block w-full py-3 px-6 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-center"
                    >
                      Get Started
                    </Link>
                  </div>

                  {/* Essential Plan */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-600 relative">
                    <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      Popular
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Essential</h3>
                    <p className="text-gray-600 mb-6">For regular optimization needs</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">$3.99</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Unlimited frequency predictions
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Email support
                      </li>
                    </ul>
                    <Link 
                      to="/checkout"
                      className="block w-full py-3 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                    >
                      Subscribe Now
                    </Link>
                  </div>

                  {/* Pro Plan */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4">Pro</h3>
                    <p className="text-gray-600 mb-6">For advanced engineering needs</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">$9.99</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Everything in Essential
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Modal decoupling analysis
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Step response simulation
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        System optimization
                      </li>
                      <li className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Priority support
                      </li>
                    </ul>
                    <Link 
                      to="/get-started"
                      className="block w-full py-3 px-6 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-center"
                    >
                      Coming Soon!
                    </Link>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-32 bg-blue-600 rounded-2xl p-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Optimize Your Isolation System?
                </h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of engineers who trust our platform for their vibration isolation design needs.
                </p>
                <Link 
                  to="/get-started"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Get Started Now
                </Link>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 mt-32 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center text-white mb-4">
                      <Vibrate className="h-6 w-6" />
                      <span className="ml-2 font-bold">Isolator Modal Analysis</span>
                    </div>
                    <p className="text-sm">Advanced vibration isolation design tools for mechanical engineers.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#features" className="hover:text-white">Features</a></li>
                      <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                      <li><a href="#" className="hover:text-white">Documentation</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-white">About</a></li>
                      <li><a href="#" className="hover:text-white">Blog</a></li>
                      <li><a href="#" className="hover:text-white">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-white">Privacy</a></li>
                      <li><a href="#" className="hover:text-white">Terms</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
                  © 2025 Isolator Modal Analysis. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;