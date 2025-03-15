export type Matrix3x3 = [
  [number | '', number | '', number | ''],
  [number | '', number | '', number | ''],
  [number | '', number | '', number | ''],
];

export type MountingLocation = {
  x: string;
  y: string;
  z: string;
  stiffness_x: string;
  stiffness_y: string;
  stiffness_z: string;
};

export type SystemParameters = {
  mass: string;
  inertiaMatrix: Matrix3x3;
  centerOfMass: {
    x: string;
    y: string;
    z: string;
  };
  mountingLocations: MountingLocation[];
};
