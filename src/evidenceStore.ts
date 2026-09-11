export type EvidenceEntry = {
  id: string
  createdAt: string
  routeId: string
  routeName: string
  stageTitle: string
  practiceTitle: string
  notes: string
  materials: string
  errors: string
  corrections: string
  attempt: number
  result: string
  mastery: number
  photo?: Blob
}

const DB = 'oficioslab-evidence'
const STORE = 'entries'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveEvidence(entry: EvidenceEntry) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

export async function listEvidence(): Promise<EvidenceEntry[]> {
  const db = await openDb()
  const rows = await new Promise<EvidenceEntry[]>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
  db.close()
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function deleteEvidence(id: string) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}
