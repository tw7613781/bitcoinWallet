export function isHexString(data: any): boolean {
  if (!data || !isString(data)) return false;
  for (const s of data) {
    if (!isHex(s)) return false;
  }
  return true;
}

function isHex(str: string): boolean {
  const code = str.charCodeAt(0);
  return (code >= 97 /* a */ && code <= 102) /* f */ || (code >= 65 /* A */ && code <= 70) /* F */ || (code >= 48 /* 0 */ && code <= 57) /* 9 */;
}

function isString(data: any): boolean {
  if (typeof data === 'string' || data instanceof String) return true;
  else return false;
}

export function isBip32Path(data: any): boolean {
  if (!data || !isString(data)) return false;
  const big32PathRexExp = /^m\/(\d+'?\/)*(\d+'?)$/;
  if (data.match(big32PathRexExp)) return true;
  else return false;
}

export function isPositiveNum(data: any): boolean {
  if (!data || typeof data !== 'number') return false;
  if (data < 0) return false;
  return true;
}

export function isCompressedPubKey(data: any): boolean {
  if (!data || !isHexString(data)) return false;
  if (data.length !== 66) return false;
  return true;
}
