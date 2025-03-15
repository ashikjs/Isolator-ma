import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SystemParameters } from '../types';
import * as numeric from 'numeric';

const emptyMatrix: Matrix3x3 = [
  ['1', '', ''],
  ['', '1', ''],
  ['', '', '1']
];

const emptyLocation = { x: '0', y: '0', z: '0', stiffness_x: '1', stiffness_y: '1', stiffness_z: '1' };

export default function GetStarted() {
  const navigate = useNavigate();
  const [usageCount, setUsageCount] = useState(0);
  const [parameters, setParameters] = useState<SystemParameters>({
    mass: '1',
    inertiaMatrix: [...emptyMatrix],
    centerOfMass: { x: '0', y: '0', z: '0' },
    mountingLocations: [{ ...emptyLocation }]
  });

  useEffect(() => {
    const count = parseInt(sessionStorage.getItem('calculationCount') || '0');
    setUsageCount(count);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usageCount >= 3) {
      return; // Don't proceed if limit reached
    }

    // Increment usage count
    const newCount = usageCount + 1;
    sessionStorage.setItem('calculationCount', newCount.toString());
    setUsageCount(newCount);

    // Store parameters and navigate
    sessionStorage.setItem('systemParameters', JSON.stringify(parameters));
    navigate('/results');
  };

  const updateInertiaMatrix = (row: number, col: number, value: string) => {
    const newMatrix = [...parameters.inertiaMatrix];
    newMatrix[row][col] = value === '' ? '' : Number(value);
    setParameters({ ...parameters, inertiaMatrix: newMatrix });
  };

  const updateCenterOfMass = (axis: 'x' | 'y' | 'z', value: string) => {
    setParameters({
      ...parameters,
      centerOfMass: { ...parameters.centerOfMass, [axis]: value }
    });
  };

  const updateMountingLocation = (index: number, field: keyof MountingLocation, value: string) => {
    const newLocations = [...parameters.mountingLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setParameters({ ...parameters, mountingLocations: newLocations });
  };

  const addMountingLocation = () => {
    if (parameters.mountingLocations.length < 10) {
      setParameters({
        ...parameters,
        mountingLocations: [...parameters.mountingLocations, { ...emptyLocation }]
      });
    }
  };

  const removeMountingLocation = (index: number) => {
    const newLocations = parameters.mountingLocations.filter((_, i) => i !== index);
    setParameters({ ...parameters, mountingLocations: newLocations });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Configuration</h1>
          <p className="text-gray-600 mb-8">
            Enter your system parameters to calculate optimal isolator characteristics.
          </p>

          {usageCount >= 3 && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-800 font-medium">Free Tier Limit Reached</h3>
                <p className="text-yellow-700 mt-1">
                  You've reached the limit of 3 calculations for the free tier. 
                  <Link to="/#pricing" className="text-blue-600 hover:text-blue-700 ml-1">
                    Upgrade your plan
                  </Link> to continue using the calculator.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* System Mass */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                System Mass (ton)
              </label>
              <input
                type="number"
                value={parameters.mass}
                onChange={(e) => setParameters({ ...parameters, mass: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.09851"
                required
              />
            </div>

            {/* Mass Moment of Inertia Matrix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Mass Moment of Inertia Matrix (ton⋅mm²) - Optional
              </label>
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="contents">
                    {[0, 1, 2].map((col) => (
                      <input
                        key={`${row}-${col}`}
                        type="number"
                        value={parameters.inertiaMatrix[row][col]}
                        onChange={(e) => updateInertiaMatrix(row, col, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        placeholder="0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Center of Mass Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Center of Mass Location (mm)
              </label>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X-coordinate</label>
                  <input
                    type="number"
                    value={parameters.centerOfMass.x}
                    onChange={(e) => updateCenterOfMass('x', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3689"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y-coordinate</label>
                  <input
                    type="number"
                    value={parameters.centerOfMass.y}
                    onChange={(e) => updateCenterOfMass('y', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="42.72"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Z-coordinate</label>
                  <input
                    type="number"
                    value={parameters.centerOfMass.z}
                    onChange={(e) => updateCenterOfMass('z', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="425.3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mounting Locations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mounting Locations (m) and Stiffness (N/m)
                </label>
                {parameters.mountingLocations.length < 10 && (
                  <button
                    type="button"
                    onClick={addMountingLocation}
                    className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Location
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {parameters.mountingLocations.map((location, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">X-coordinate</label>
                        <input
                          type="number"
                          value={location.x}
                          onChange={(e) => updateMountingLocation(index, 'x', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Y-coordinate</label>
                        <input
                          type="number"
                          value={location.y}
                          onChange={(e) => updateMountingLocation(index, 'y', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Z-coordinate</label>
                        <input
                          type="number"
                          value={location.z}
                          onChange={(e) => updateMountingLocation(index, 'z', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Stiffness_x</label>
                        <input
                          type="number"
                          value={location.stiffness_x}
                          onChange={(e) => updateMountingLocation(index, 'stiffness_x', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Stiffness_y</label>
                        <input
                          type="number"
                          value={location.stiffness_y}
                          onChange={(e) => updateMountingLocation(index, 'stiffness_y', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Stiffness_z</label>
                        <input
                          type="number"
                          value={location.stiffness_z}
                          onChange={(e) => updateMountingLocation(index, 'stiffness_z', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {parameters.mountingLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMountingLocation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={usageCount >= 3}
                className={`inline-flex items-center px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  usageCount >= 3 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save className="h-5 w-5 mr-2" />
                Calculate Results
                {usageCount < 3 && <span className="ml-2 text-sm">({3 - usageCount} remaining)</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}