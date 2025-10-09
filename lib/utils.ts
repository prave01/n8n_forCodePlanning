import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import JSZip from 'jszip'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function parseZip(arrayBuffer: ArrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer)

  const files = await Promise.all(
    Object.values(zip.files).map(async (file) => {
      const data = file.dir ? '' : await zip.files[file.name].async('string')
      return {
        name: file.name.split('/').filter(Boolean).pop() || '',
        path: file.name,
        dir: file.dir,
        data,
      }
    })
  )

  return files
}

export function buildTree(
  files: { name: string; dir: boolean; path: string; data: string }[]
) {
  const root: Record<string, any> = {}

  for (const file of files) {
    const parts = file.path.split('/').filter(Boolean)
    let current = root

    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1 && !file.dir

      if (!current[part]) {
        current[part] = isFile ? { data: file.data, dir: file.dir } : {}
      }

      current = current[part]
    })
  }

  return root
}
