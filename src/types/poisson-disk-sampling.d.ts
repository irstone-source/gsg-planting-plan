declare module 'poisson-disk-sampling' {
  export default class PoissonDiskSampling {
    constructor(options: {
      shape: [number, number];
      minDistance: number;
      maxDistance?: number;
      tries?: number;
      distanceFunction?: (p: number[]) => number;
      bias?: (p: number[]) => number;
      rng?: () => number;
    });
    fill(): number[][];
  }
}
