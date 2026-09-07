type ToastPayload = { message: string; durationMs: number };
type ToastListener = (payload: ToastPayload) => void;

const listeners = new Set<ToastListener>();

export function toast(message: string, durationMs = 2400) {
  const text = message.trim();
  if (!text) return;
  const payload = { message: text, durationMs };
  listeners.forEach((listener) => listener(payload));
}

export function subscribeToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
