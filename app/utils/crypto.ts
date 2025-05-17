import { RSA, RSAKeychain } from 'react-native-rsa-native';

/**
 * Signs a base64-encoded message using the private key associated with the keyTag.
 * @param base64Message The base64-encoded string (e.g., image).
 * @param keyTag The key tag used to identify the private key in the keychain.
 * @returns The cryptographic signature string.
 */
export async function signMessage(base64Message: string, keyTag: string): Promise<string> {
  return await RSAKeychain.sign(base64Message, keyTag);
}

/**
 * Verifies a signature using a raw public key.
 * @param signature The digital signature.
 * @param base64Message The original base64-encoded content.
 * @param publicKey The public key to use for verification.
 */
export async function verifySignature(signature: string, base64Message: string, publicKey: string): Promise<boolean> {
  return await RSA.verify(signature, base64Message, publicKey);
}