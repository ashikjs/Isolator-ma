import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { SystemParameters } from '../types';
import { calculateNaturalFrequencies, ModalResults } from '../utils/vibrationAnalysis';

export default function Results({isPaid}: any) {
  const [error, setError] = useState<string>(null);
  const [results, setResults] = useState<ModalResults | null>(null);
  const [parameters, setParameters] = useState<SystemParameters | null>(null);

  useEffect(() => {
    const storedParams = sessionStorage.getItem('systemParameters');
    if (storedParams) {
      let calculatedResults = null
      const params = JSON.parse(storedParams);
      setParameters(params);
      try {
        calculatedResults = calculateNaturalFrequencies(params);
        setError(null)
      } catch (e) {
        console.error("Calculation Error:", e); // Logs full error to console
        setError(e?.message || "An unknown error occurred.");
      }
      setResults(calculatedResults);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center border border-gray-200">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-700 text-lg">{error || "An unexpected error occurred."}</p>

          <Link
            to="/get-started"
            className="mt-6 inline-flex items-center justify-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            <ArrowLeft className="h-5 w-5 mr-2"/>
            Return to Configuration
          </Link>
        </div>
      </div>
    );
  }

  if (!parameters || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No parameters found</h1>
          <Link
            to="/get-started"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2"/>
            Return to configuration
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/get-started" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Configuration
        </Link>

        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
                <p className="text-gray-600">Calculation completed on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="h-5 w-5 mr-2" />
                  Download Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-1">System Mass</h3>
                <p className="text-2xl font-bold text-blue-700">{parameters.mass} kg</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-1">Number of Mounts</h3>
                <p className="text-2xl font-bold text-blue-700">{parameters.mountingLocations?.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-1">Analysis Type</h3>
                <p className="text-2xl font-bold text-blue-700">Basic</p>
              </div>
            </div>
          </div>

          {/* Natural Frequencies */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Natural Frequencies</h2>
            <div className="space-y-4">
              {results.naturalFrequencies?.map((frequency, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-6">
                    <p className="text-lg font-semibold text-gray-900">{frequency?.toFixed(1)} Hz</p>
                    <p className="text-gray-600">{results.modeDescriptions[index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Notice */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Unlock Advanced Analysis</h2>
            <p className="mb-6">
              Upgrade to our Pro plan to access detailed modal analysis, step response simulation, and system optimization recommendations.
            </p>
            <Link 
              to="/#pricing"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
