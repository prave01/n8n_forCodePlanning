import JSZip from "jszip";

export async function parseZip(arrayBuffer: ArrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const files: { name: string; dir: boolean; path: string }[] = [];

  zip.forEach((relativePath, file) => {
    files.push({
      name: file.name.split("/").filter(Boolean).pop() || "",
      path: relativePath,
      dir: file.dir,
    });
  });

  return files;
}

export function buildTree(
  files: { name: string; dir: boolean; path: string }[],
) {
  const root: Record<string, any> = {};

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, idx) => {
      if (!current[part]) {
        current[part] = idx === parts.length - 1 && !file.dir ? null : {};
      }
      current = current[part];
    });
  }

  return root;
}
