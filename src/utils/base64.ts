const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

function utf8ToBytes(input: string): number[] {
  if (typeof TextEncoder !== 'undefined') {
    return Array.from(new TextEncoder().encode(input))
  }
  const encoded = unescape(encodeURIComponent(input))
  const bytes = Array.from({ length: encoded.length })
  for (let i = 0; i < encoded.length; i += 1) {
    bytes[i] = encoded.charCodeAt(i)
  }
  return bytes
}

function base64FromBytes(bytes: number[]) {
  let output = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i]
    const b2 = bytes[i + 1]
    const b3 = bytes[i + 2]
    const hasB2 = typeof b2 === 'number'
    const hasB3 = typeof b3 === 'number'
    const enc1 = b1 >> 2
    const enc2 = ((b1 & 0x03) << 4) | (hasB2 ? (b2 >> 4) : 0)
    const enc3 = hasB2
      ? (((b2 & 0x0F) << 2) | (hasB3 ? (b3 >> 6) : 0))
      : 64
    const enc4 = hasB3 ? (b3 & 0x3F) : 64
    output += BASE64_ALPHABET.charAt(enc1)
      + BASE64_ALPHABET.charAt(enc2)
      + BASE64_ALPHABET.charAt(enc3)
      + BASE64_ALPHABET.charAt(enc4)
  }
  return output
}

export function encodeBase64(input: string): string {
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(input)))
  }
  return base64FromBytes(utf8ToBytes(input))
}
