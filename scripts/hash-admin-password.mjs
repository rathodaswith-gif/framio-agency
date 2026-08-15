import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 12) {
  console.error("Provide an admin password with at least 12 characters.");
  process.exit(1);
}

const cost = 16384;
const blockSize = 8;
const parallelization = 1;
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64, {
  N: cost,
  r: blockSize,
  p: parallelization,
  maxmem: 64 * 1024 * 1024
}).toString("hex");

console.log(`scrypt$${cost}$${blockSize}$${parallelization}$${salt}$${hash}`);
