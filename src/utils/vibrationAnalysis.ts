import {Matrix, EigenvalueDecomposition, inverse} from 'ml-matrix';
import {SystemParameters} from '../types';

export interface ModalResults {
  naturalFrequencies: number[];
  modeDescriptions: string[];
}

/**
 * Calculates the natural frequencies of a system using mass and stiffness matrices.
 */
export function calculateNaturalFrequencies(params: SystemParameters): ModalResults {
  if (!params.mass || !params.mountingLocations || params.mountingLocations.length === 0) {
    throw new Error("Invalid input: mass and mounting locations are required.");
  }

  // Convert mass input to a number and ensure it's positive
  const mass = parseFloat(params.mass as unknown as string);
  if (isNaN(mass) || mass <= 0) {
    throw new Error("Mass must be a positive number.");
  }

  // Extract stiffness values from mounting locations
  const numDOF = 6; // 6 Degrees of Freedom (3 translational, 3 rotational)
  const stiffnessMatrix = Matrix.zeros(numDOF, numDOF);

  params.mountingLocations.forEach(loc => {
    const stiffness = [
      parseFloat(loc.stiffness_x as unknown as string) || 0,
      parseFloat(loc.stiffness_y as unknown as string) || 0,
      parseFloat(loc.stiffness_z as unknown as string) || 0
    ];

    for (let i = 0; i < 3; i++) {
      stiffnessMatrix.set(i, i, stiffnessMatrix.get(i, i) + stiffness[i]);
    }
  });

  // Create mass matrix as a diagonal matrix
  const massMatrix = Matrix.eye(numDOF).mul(mass);

  try {
    // Compute the inverse of the mass matrix
    const invMassMatrix = inverse(massMatrix);

    // Compute the system matrix (M⁻¹ * K)
    const systemMatrix = invMassMatrix.mmul(stiffnessMatrix);

    // Eigenvalue decomposition to find natural frequencies
    const eigen = new EigenvalueDecomposition(systemMatrix);
    const eigenvalues = eigen.realEigenvalues;

    // Compute natural frequencies (f = sqrt(λ) / (2π))
    const naturalFrequencies = eigenvalues.map(lambda =>
      lambda > 0 ? Math.sqrt(lambda) / (2 * Math.PI) : 0
    );

    // Mode descriptions
    const modeDescriptions = [
      "Vertical Translation",
      "Lateral Translation",
      "Longitudinal Translation",
      "Roll",
      "Pitch",
      "Yaw"
    ];

    return {naturalFrequencies, modeDescriptions};
  } catch (error) {
    throw new Error("Error computing natural frequencies: " + error.message);
  }
}
