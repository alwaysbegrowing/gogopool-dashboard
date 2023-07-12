type DebounceFunction = (...args: any[]) => void;

export function debounce(
  fn: DebounceFunction,
  delay: number
): DebounceFunction {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  function debouncedFunction(...args: any[]): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }

  return debouncedFunction;
}
