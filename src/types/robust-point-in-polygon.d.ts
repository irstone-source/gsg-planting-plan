declare module 'robust-point-in-polygon' {
  export default function classifyPoint(
    polygon: number[][],
    point: number[]
  ): -1 | 0 | 1;
}
