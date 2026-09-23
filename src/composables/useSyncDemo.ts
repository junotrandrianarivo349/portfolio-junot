import { computed, onBeforeUnmount, ref } from 'vue'

/**
 * State machine behind the hero demo: an offline-first enrollment form.
 * - Online: a saved record is sent right away (short "syncing" step, then "synced").
 * - Offline: records pile up in a local queue ("pending").
 * - Back online: the queue drains one record at a time, then the status is "synced".
 * All data is fictional. Delays drop to 0 when the visitor prefers reduced motion.
 */

export interface DemoRecord {
  id: number
  name: string
  commune: string
}

export type SyncStatus = 'synced' | 'syncing' | 'pending'

// Fictional members: common Malagasy first names and real towns, no real person.
const MEMBERS: Omit<DemoRecord, 'id'>[] = [
  { name: 'Rasoa H.', commune: 'Ambositra' },
  { name: 'Njaka R.', commune: 'Moramanga' },
  { name: 'Lalao V.', commune: 'Antsirabe' },
  { name: 'Fidy A.', commune: 'Ambatolampy' },
  { name: 'Miora S.', commune: 'Fianarantsoa' },
  { name: 'Mamy T.', commune: 'Mahajanga' },
]

const MAX_SYNCED_SHOWN = 3
const MAX_QUEUE = 6

export function useSyncDemo(options: { reducedMotion?: () => boolean } = {}) {
  const online = ref(true)
  const queue = ref<DemoRecord[]>([])
  const synced = ref<DemoRecord[]>([])
  const inFlight = ref<DemoRecord | null>(null)
  const totalSynced = ref(0)

  const nextId = ref(0) // reactive: the form shows the next fictional member after each save
  let timer: ReturnType<typeof setTimeout> | undefined

  const delay = (ms: number) => (options.reducedMotion?.() ? 0 : ms)

  const nextMember = computed(() => MEMBERS[nextId.value % MEMBERS.length]!)
  const queueFull = computed(() => queue.value.length >= MAX_QUEUE)

  const status = computed<SyncStatus>(() => {
    if (inFlight.value) return 'syncing'
    if (queue.value.length > 0) return 'pending'
    return 'synced'
  })

  function markSynced(record: DemoRecord) {
    synced.value = [record, ...synced.value].slice(0, MAX_SYNCED_SHOWN)
    totalSynced.value++
  }

  /** Sends queued records one by one while online. */
  function drain() {
    if (!online.value || inFlight.value || queue.value.length === 0) return
    const [first, ...rest] = queue.value
    queue.value = rest
    inFlight.value = first!
    timer = setTimeout(() => {
      markSynced(first!)
      inFlight.value = null
      drain()
    }, delay(450))
  }

  function save() {
    if (queueFull.value) return
    const record: DemoRecord = { ...nextMember.value, id: nextId.value++ } // copy the shown member before advancing
    queue.value = [...queue.value, record]
    drain()
  }

  function setOnline(value: boolean) {
    online.value = value
    if (value) return drain()
    // Network cut mid-request: the record was not confirmed, it goes back to the head of the queue.
    if (inFlight.value) {
      clearTimeout(timer)
      queue.value = [inFlight.value, ...queue.value]
      inFlight.value = null
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { online, queue, synced, inFlight, totalSynced, status, nextMember, queueFull, save, setOnline }
}
