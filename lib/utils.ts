import { useFileStore } from "@/store/store";
import { type ClassValue, clsx } from "clsx";
import { debug } from "console";
import JSZip from "jszip";
import { parse } from "path";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseZip(arrayBuffer: ArrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);

  const files = await Promise.all(
    Object.values(zip.files).map(async (file) => {
      const data = file.dir ? "" : await zip.files[file.name].async("string");
      return {
        name: file.name.split("/").filter(Boolean).pop() || "",
        path: file.name,
        dir: file.dir,
        data,
      };
    }),
  );

  return files;
}

export function buildTree(
  files: { name: string; dir: boolean; path: string; data: string }[],
) {
  const root: Record<string, any> = {};

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1 && !file.dir;

      if (!current[part]) {
        current[part] = isFile ? { data: file.data, dir: file.dir } : {};
      }

      current = current[part];
    });
  }

  return root;
}

export function replaceData(
  files: { name: string; dir: boolean; path: string; data: string }[],
  newData: string,
  targetFile: string,
) {
  const updatedFiles = files.map((file) => {
    if (!file.dir && file.path.endsWith(targetFile)) {
      return { ...file, data: newData };
    }
    return file;
  });

  return updatedFiles;
}

export const traverse = (tree: Record<string, any>, results: string[] = []) => {
  Object.entries(tree).forEach(([key, value]) => {
    const isFolder = value && typeof value === "object" && !("data" in value);
    if (isFolder) traverse(value, results);
    else results.push(key);
  });
  return results;
};

export function findDataByKey(
  tree: Record<string, any>,
  key: string,
): string | null {
  for (const [k, value] of Object.entries(tree)) {
    const isFolder = value && typeof value === "object" && !("data" in value);

    if (k === key && !isFolder) {
      return value.data;
    }

    if (isFolder) {
      const result = findDataByKey(value, key);
      if (result !== null) return result;
    }
  }
  return null;
}
