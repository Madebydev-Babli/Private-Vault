import argon2 from "argon2";
import { MongoClient } from "mongodb";

const accessId = "private-access";

function requireMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is required. Ensure .env.local exists and contains it.",
    );
  }
  return uri;
}

function readPassword(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (!stdin.isTTY) {
      reject(new Error("Interactive password input requires a TTY terminal."));
      return;
    }

    let entered = "";
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);

    function onData(chunk: Buffer | string) {
      const key = chunk.toString();

      if (key === "\r" || key === "\n") {
        stdout.write("\n");
        cleanup();
        const password = entered.trim();
        if (!password) {
          reject(new Error("A password is required."));
          return;
        }
        resolve(password);
        return;
      }

      if (key === "\u0003") {
        cleanup();
        reject(new Error("Password entry canceled."));
        return;
      }

      if (key === "\b" || key === "\u007f") {
        if (entered.length > 0) {
          entered = entered.slice(0, -1);
          stdout.write("\b \b");
        }
        return;
      }

      if (key.length === 1 && key !== "\x1b") {
        entered += key;
        stdout.write("*");
      }
    }

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    }
  });
}

function readInput(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (!stdin.isTTY) {
      reject(new Error("Interactive input requires a TTY terminal."));
      return;
    }

    let entered = "";
    stdout.write(prompt);
    stdin.resume();
    stdin.on("data", onData);

    function onData(chunk: Buffer | string) {
      const key = chunk.toString();

      if (key === "\r" || key === "\n") {
        stdout.write("\n");
        cleanup();
        const value = entered.trim();
        if (!value) {
          reject(new Error("A value is required."));
          return;
        }
        resolve(value);
        return;
      }

      if (key === "\u0003") {
        cleanup();
        reject(new Error("Input canceled."));
        return;
      }

      if (key === "\b" || key === "\u007f") {
        if (entered.length > 0) {
          entered = entered.slice(0, -1);
          stdout.write("\b \b");
        }
        return;
      }

      if (key.length === 1 && key !== "\x1b") {
        entered += key;
        stdout.write(key);
      }
    }

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.pause();
    }
  });
}

async function main() {
  const uri = requireMongoUri();
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const email =
      process.env.VAULT_EMAIL?.trim() ||
      (await readInput("Enter the private vault email: "));
    const password = await readPassword("Create the private vault password: ");
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const now = new Date();
    await client
      .db()
      .collection<{
        _id: string;
        email?: string;
        passwordHash: string;
        createdAt?: Date;
        updatedAt: Date;
      }>("privateAccess")
      .updateOne(
        { _id: accessId },
        {
          $set: {
            email,
            passwordHash,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true },
      );

    console.log("Private access credentials provisioned.");
  } catch (error) {
    console.error("Failed to provision access credentials.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
