export function debounce<T>(fn: (args: T) => void, debounceMs = 250) {
  let t: Timer;
  return (args: T) => {
    clearTimeout(t);
    t = setTimeout(() => fn(args), debounceMs);
  };
}
