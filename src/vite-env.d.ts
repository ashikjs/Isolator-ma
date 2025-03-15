/// <reference types="vite/client" />

declare module 'numeric' {
  const numeric: {
    identity: (n: number) => number[][];
    rep: (shape: number[], val: number) => number[][];
    sub: (a: number[], b: number[]) => number[];
    transpose: (a: number[][]) => number[][];
    dot: (a: number[][] | number[], b: number[][] | number[]) => number[][] | number[];
    inv: (a: number[][]) => number[][];
    eig: (a: number[][]) => { lambda: { x: number[] } };
  };
  export default numeric;
}