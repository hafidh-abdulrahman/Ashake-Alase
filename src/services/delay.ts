/** Small artificial delay so loading states are visible in the prototype. Remove once Supabase is connected. */
export const simulateLatency = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms))
