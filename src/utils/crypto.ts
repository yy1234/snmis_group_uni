import JSEncrypt from 'jsencrypt'

export function encryptPassword(password: string, publicKey: string): string {
  const enc = new JSEncrypt()
  enc.setPublicKey(publicKey)
  return enc.encrypt(password) || ''
}
