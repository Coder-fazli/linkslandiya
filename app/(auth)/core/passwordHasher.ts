import crypto, { scrypt } from "crypto"
import { promisify } from "util"

// Turn scrypt into a Promise-based function
const scrypAsync = promisify(scrypt);

// Generating  a random salt
 export function generateSalt(): string {
   return crypto.randomBytes(26).toString("hex").normalize();
 }

// Hash a password using async/await
export async function hashPassword(password: string, salt: string): Promise<string> {
   const hash = await scrypAsync(password.normalize(), salt, 64);
   return (hash as Buffer).toString("hex").normalize(); 
}