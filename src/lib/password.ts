import bcrypt from "bcryptjs";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

export function generateProjectPassword(length = 8): string {
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i]! % CHARSET.length];
  }
  return result;
}

export async function hashProjectPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyProjectPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret || secret.length < 16) {
    throw new Error("ENCRYPTION_KEY must be set (min 16 characters)");
  }
  return scryptSync(secret, "progress-salt", 32);
}

export function encryptPassword(plain: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptPassword(encrypted: string): string {
  const key = getEncryptionKey();
  const [ivHex, dataHex] = encrypted.split(":");
  if (!ivHex || !dataHex) throw new Error("Invalid encrypted password");
  const iv = Buffer.from(ivHex, "hex");
  const data = Buffer.from(dataHex, "hex");
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
