import base_api from './api'

// Anonymous research-evaluation telemetry (proposal section 6.1): a random
// session id, event names and durations. No account identifiers are sent.
const SESSION_KEY = 'metrics-session'

function sessionId(): string {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem(SESSION_KEY, id)
    }
    return id
}

export function logEvent(event: string, value_ms?: number, meta?: object) {
    base_api
        .post('/metrics', {
            session: sessionId(),
            event,
            value_ms: value_ms !== undefined ? Math.round(value_ms) : undefined,
            meta: meta ? JSON.stringify(meta) : undefined,
        })
        .catch(() => {
            /* metrics must never break the flow */
        })
}

export function startTimer(): () => number {
    const start = performance.now()
    return () => performance.now() - start
}
