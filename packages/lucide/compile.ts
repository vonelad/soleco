import { resolve } from "path";
import fs from "fs/promises";
// @ts-ignore
import lucideIcons from "lucide-static";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractName(content: string) {
  const match = content.match(/class="lucide lucide-([\w-]+)"/);
  if (!match) return null;
  return match[1];
}

function toSolid(name: string, content: string) {
  const updated = content
    .replace(/<!--.+-->/g, "")
    .replace(`width="24"`, `width="1em"`)
    .replace(`height="24"`, `height="1em"`)
    .replace(/class="[\w-\s]+"/, "")
    .replace(">", "{...props}>");
  return `
  import type { JSX } from "solid-js"; export default function ${name}(props: JSX.SvgSVGAttributes<SVGSVGElement>) { return (${updated}) };
  `.trim();
}

async function main() {
  const outputDir = resolve(__dirname, "src");
  const barrel: string[] = [];
  const iconsWrites: Promise<void>[] = [];

  // Clear output directory
  await fs.rm(outputDir, { recursive: true, force: true });

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Add .gitkeep
  await fs.writeFile(resolve(outputDir, ".gitkeep"), "");

  const icons = Object.entries(lucideIcons) as [string, string][];

  for (const [name, content] of icons) {
    const casedName = extractName(content);
    if (!casedName) throw new Error(`Could not extract name from ${name}`);
    if (casedName === "index") throw new Error(`Name cannot be "index"`);
    const solidContent = toSolid(capitalize(name), content);
    iconsWrites.push(
      fs.writeFile(resolve(outputDir, `${casedName}.tsx`), solidContent)
    );

    barrel.push(
      `export { default as ${capitalize(name)} } from "./${casedName}";`
    );
  }

  iconsWrites.push(
    fs.writeFile(resolve(outputDir, "index.ts"), barrel.join("\n"))
  );

  await Promise.all(iconsWrites);
}

main();
