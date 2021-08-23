declare module 'tiny-secp256k1' {
  export function isPoint(data: Buffer): boolean;
  export function isPointCompressed(data: Buffer): boolean;
}
