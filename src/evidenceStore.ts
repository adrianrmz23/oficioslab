import { getCurrentUser } from './cloudSync'
import { supabase } from './lib/supabase'

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
  photoUrl?: string
  cloudSynced?: boolean
}

const DB = 'oficioslab-evidence'
const STORE = 'entries'
const BUCKET = 'oficioslab-evidence'

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

async function saveLocal(entry: EvidenceEntry) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

async function listLocal(): Promise<EvidenceEntry[]> {
  const db = await openDb()
  const rows = await new Promise<EvidenceEntry[]>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
  db.close()
  return rows
}

async function deleteLocal(id: string) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

function extensionFor(blob?: Blob) {
  if (!blob) return 'jpg'
  if (blob.type === 'image/png') return 'png'
  if (blob.type === 'image/webp') return 'webp'
  return 'jpg'
}

async function syncEvidenceEntry(entry: EvidenceEntry): Promise<string | null> {
  if (!supabase) return null
  const user = await getCurrentUser()
  if (!user) return null

  let photoPath: string | null = null
  if (entry.photo) {
    photoPath = `${user.id}/${entry.id}.${extensionFor(entry.photo)}`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(photoPath, entry.photo, {
      upsert: true,
      contentType: entry.photo.type || 'image/jpeg',
      cacheControl: '3600',
    })
    if (uploadError) throw uploadError
  }

  const { error } = await supabase.from('oficioslab_evidence').upsert({
    id: entry.id,
    user_id: user.id,
    created_at: entry.createdAt,
    updated_at: new Date().toISOString(),
    route_id: entry.routeId,
    route_name: entry.routeName,
    stage_title: entry.stageTitle,
    practice_title: entry.practiceTitle,
    notes: entry.notes,
    materials: entry.materials,
    errors: entry.errors,
    corrections: entry.corrections,
    attempt: entry.attempt,
    result: entry.result,
    mastery: entry.mastery,
    photo_path: photoPath,
  }, { onConflict: 'id' })
  if (error) throw error
  return photoPath
}

export async function saveEvidence(entry: EvidenceEntry) {
  await saveLocal({ ...entry, cloudSynced: false })
  try {
    const synced = await syncEvidenceEntry(entry)
    if (synced !== null || !entry.photo) await saveLocal({ ...entry, cloudSynced: true })
  } catch {
    // Local-first: la evidencia queda en IndexedDB y se reintentará al abrir el portafolio.
  }
}

export async function listEvidence(): Promise<EvidenceEntry[]> {
  const localRows = await listLocal()
  const client = supabase
  if (!client) return localRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const user = await getCurrentUser()
  if (!user) return localRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  // Migra evidencias locales previas a Supabase cuando sea posible.
  await Promise.allSettled(localRows.filter(row => !row.cloudSynced).map(row => syncEvidenceEntry(row)))

  const { data, error } = await client
    .from('oficioslab_evidence')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return localRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const remoteRows = await Promise.all((data || []).map(async (row: any): Promise<EvidenceEntry> => {
    let photoUrl = ''
    if (row.photo_path) {
      const { data: signed } = await client.storage.from(BUCKET).createSignedUrl(row.photo_path, 3600)
      photoUrl = signed?.signedUrl || ''
    }
    const local = localRows.find(item => item.id === row.id)
    return {
      id: row.id,
      createdAt: row.created_at,
      routeId: row.route_id,
      routeName: row.route_name,
      stageTitle: row.stage_title,
      practiceTitle: row.practice_title,
      notes: row.notes || '',
      materials: row.materials || '',
      errors: row.errors || '',
      corrections: row.corrections || '',
      attempt: row.attempt || 1,
      result: row.result || '',
      mastery: row.mastery || 0,
      photo: local?.photo,
      photoUrl: photoUrl || local?.photoUrl,
      cloudSynced: true,
    }
  }))

  const merged = new Map<string, EvidenceEntry>()
  localRows.forEach(row => merged.set(row.id, row))
  remoteRows.forEach(row => merged.set(row.id, row))
  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function deleteEvidence(id: string) {
  await deleteLocal(id)
  if (!supabase) return
  try {
    const user = await getCurrentUser()
    if (!user) return
    const { data } = await supabase
      .from('oficioslab_evidence')
      .select('photo_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (data?.photo_path) await supabase.storage.from(BUCKET).remove([data.photo_path])
    await supabase.from('oficioslab_evidence').delete().eq('id', id).eq('user_id', user.id)
  } catch {
    // La eliminación local no se bloquea si no hay conexión.
  }
}
