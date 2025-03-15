import { Matrix, inverse, EigenvalueDecomposition } from 'ml-matrix';
import { SystemParameters } from '../types';

export interface ModalResults {
  naturalFrequencies: number[];
  modeDescriptions: string[];
}

export function calculateNaturalFrequencies(params: SystemParameters): ModalResults {
  // Convert string inputs to numbers
  const mass = Number(params.mass);
  const mountingPoints = params.mountingLocations.map(loc => ({
    position: [Number(loc.x), Number(loc.y), Number(loc.z)],
    stiffness: [Number(loc.stiffness_x), Number(loc.stiffness_y), Number(loc.stiffness_z)]
  }));
  // Calculate natural frequencies (in Hz)
  const naturalFrequencies = Matrix.zeros(6, 1);

  // Mode descriptions
  const modeDescriptions = [
    "Vertical Translation",
    "Lateral Translation",
    "Longitudinal Translation",
    "Roll",
    "Pitch",
    "Yaw"
  ];

  return {
    naturalFrequencies,
    modeDescriptions
  };
}