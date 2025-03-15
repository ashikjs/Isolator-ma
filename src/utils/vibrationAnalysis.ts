import { Matrix, EigenvalueDecomposition, inverse } from 'ml-matrix';
import { SystemParameters } from '../types';

export interface ModalResults {
  naturalFrequencies: number[];
  modeDescriptions: string[];
}

export function calculateNaturalFrequencies(params: SystemParameters): ModalResults {
  if (!params.mass || !params.mountingLocations || params.mountingLocations.length === 0) {
    throw new Error("Invalid input: mass and mounting locations are required.");
  }

  const mass = parseFloat(params.mass as unknown as string);
  if (isNaN(mass) || mass <= 0) {
    throw new Error("Mass must be a positive number.");
  }

  const numDOF = 6;
  const stiffnessMatrix = Matrix.zeros(numDOF, numDOF);

  params.mountingLocations.forEach(loc => {
    const stiffness = [
      loc.stiffness_x ? Number(loc.stiffness_x) : 0,
      loc.stiffness_y ? Number(loc.stiffness_y) : 0,
      loc.stiffness_z ? Number(loc.stiffness_z) : 0
    ];

    for (let i = 0; i < 3; i++) {
      stiffnessMatrix.set(i, i, stiffnessMatrix.get(i, i) + stiffness[i]);
    }
  });

  // Use Inertia Matrix for rotational modes
  let inertiaMatrix: Matrix;
  try {
    inertiaMatrix = new Matrix(params.inertiaMatrix);
  } catch (error) {
    throw new Error("Invalid inertia matrix format.");
  }

  // Apply inertia values to rotational stiffness
  for (let i = 0; i < 3; i++) {
    stiffnessMatrix.set(i + 3, i + 3, inertiaMatrix.get(i, i));
  }

  // Create mass matrix (translations) and inertia matrix (rotations)
  const massMatrix = Matrix.eye(numDOF).mul(mass);
  for (let i = 3; i < 6; i++) {
    massMatrix.set(i, i, inertiaMatrix.get(i - 3, i - 3));
  }

  try {
    const invMassMatrix = inverse(massMatrix);
    const systemMatrix = invMassMatrix.mmul(stiffnessMatrix);

    const eigen = new EigenvalueDecomposition(systemMatrix);
    const eigenvalues = eigen.realEigenvalues;

    const naturalFrequencies = eigenvalues.map(lambda =>
      lambda > 0 ? Math.sqrt(lambda) / (2 * Math.PI) : 0
    );

    const modeDescriptions = [
      "Vertical Translation",
      "Lateral Translation",
      "Longitudinal Translation",
      "Roll",
      "Pitch",
      "Yaw"
    ];

    return { naturalFrequencies, modeDescriptions };
  } catch (error) {
    throw new Error("Error computing natural frequencies: " + error.message);
  }
}
