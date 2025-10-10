import { readFileSync } from "node:fs";
import path from "node:path";

export async function getComponentCode(componentPath: string) {
  try {
    // Adjust the path to your components directory
    const fullPath = path.join(process.cwd(), "components", componentPath);
    const code = readFileSync(fullPath, "utf8");
    return code;
  } catch (error) {
    console.error(`Error reading file ${componentPath}:`, error);
    return null;
  }
}
