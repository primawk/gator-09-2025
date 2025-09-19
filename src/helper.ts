import os from "os";

export function getConfigFilePath(): string {
  return os.homedir();
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function convertKeysToCamel<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToCamel(v)) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = snakeToCamel(key);
      (acc as any)[camelKey] = convertKeysToCamel(value);
      return acc;
    }, {} as any);
  }
  return obj;
}
