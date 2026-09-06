/** True while an IME composition is in progress (ignore Enter). */
export function composingKey(event: { nativeEvent: { isComposing?: boolean }; key: string }): boolean {
  return Boolean(event.nativeEvent.isComposing) || event.key === "Process";
}
