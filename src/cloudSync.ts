import type { User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from './lib/supabase'

export type CloudSyncState = 'local' | 'signed-out' | 'syncing' | 'synced' | 'error'

export type OficiosLabState = {
  version: 1
  libraryDone: string[]
  masteryMap: Record<string, number>
  stagePracticeDone: string[]
  tradeSkillDone: string[]
  tradePracticeDone: string[]
  checked: string[]
  lessonDone: boolean
  ohmDone: boolean
  powerDone: boolean
  polarityDone: boolean
  seriesDone: boolean
  diagramsDone: boolean
  practiceDone: boolean
}

export type CloudStateRow = {
  state: OficiosLabState
  updated_at: string
}

export function readLocalProgress(): OficiosLabState {
  const readArray = (key: string) => {
    try { return JSON.parse(localStorage.getItem(key) || '[]') as string[] } catch { return [] }
  }
  const readObject = (key: string) => {
    try { return JSON.parse(localStorage.getItem(key) || '{}') as Record<string, number> } catch { return {} }
  }
  const done = (key: string) => localStorage.getItem(key) === 'done'
  return {
    version: 1,
    libraryDone: readArray('oficioslab-electricity-library-done'),
    masteryMap: readObject('oficioslab-mastery-map'),
    stagePracticeDone: readArray('oficioslab-stage-practice-done'),
    tradeSkillDone: readArray('oficioslab-trade-skill-done'),
    tradePracticeDone: readArray('oficioslab-trade-practice-done'),
    checked: readArray('oficioslab-materials'),
    lessonDone: done('oficioslab-lesson-1'),
    ohmDone: done('oficioslab-ohm'),
    powerDone: done('oficioslab-power'),
    polarityDone: done('oficioslab-polarity'),
    seriesDone: done('oficioslab-series'),
    diagramsDone: done('oficioslab-diagrams'),
    practiceDone: done('oficioslab-practice-1'),
  }
}


export function mergeProgress(local: OficiosLabState, remote: OficiosLabState): OficiosLabState {
  const union = (a: string[] = [], b: string[] = []) => Array.from(new Set([...(a || []), ...(b || [])]))
  const mastery: Record<string, number> = { ...(remote.masteryMap || {}) }
  for (const [key, value] of Object.entries(local.masteryMap || {})) {
    mastery[key] = Math.max(Number(mastery[key] || 0), Number(value || 0))
  }
  return {
    version: 1,
    libraryDone: union(local.libraryDone, remote.libraryDone),
    masteryMap: mastery,
    stagePracticeDone: union(local.stagePracticeDone, remote.stagePracticeDone),
    tradeSkillDone: union(local.tradeSkillDone, remote.tradeSkillDone),
    tradePracticeDone: union(local.tradePracticeDone, remote.tradePracticeDone),
    checked: union(local.checked, remote.checked),
    lessonDone: Boolean(local.lessonDone || remote.lessonDone),
    ohmDone: Boolean(local.ohmDone || remote.ohmDone),
    powerDone: Boolean(local.powerDone || remote.powerDone),
    polarityDone: Boolean(local.polarityDone || remote.polarityDone),
    seriesDone: Boolean(local.seriesDone || remote.seriesDone),
    diagramsDone: Boolean(local.diagramsDone || remote.diagramsDone),
    practiceDone: Boolean(local.practiceDone || remote.practiceDone),
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!supabase) return () => undefined
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session?.user || null))
  return () => data.subscription.unsubscribe()
}

export async function sendEmailOtp(email: string) {
  if (!supabase) throw new Error('Supabase no está configurado.')
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  })
  if (error) throw error
}

export async function verifyEmailOtp(email: string, token: string) {
  if (!supabase) throw new Error('Supabase no está configurado.')
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  if (error) throw error
  return data.user
}

export async function signOutCloud() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function loadCloudState(userId: string): Promise<CloudStateRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('oficioslab_user_state')
    .select('state, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data as CloudStateRow | null
}

export async function saveCloudState(userId: string, state: OficiosLabState) {
  if (!supabase) return
  const { error } = await supabase
    .from('oficioslab_user_state')
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function saveAssessmentAttempt(input: {
  routeId: string
  stageNumber: number
  answers: string[]
  feedback: string
}) {
  if (!supabase) return
  const user = await getCurrentUser()
  if (!user) return
  const { error } = await supabase.from('oficioslab_assessments').insert({
    user_id: user.id,
    route_id: input.routeId,
    stage_number: input.stageNumber,
    answers: input.answers,
    feedback: input.feedback,
  })
  if (error) throw error
}

export { supabaseConfigured }
