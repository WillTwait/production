import { useCallback, useEffect, useRef, useState } from "react";

interface Options<T> {
  debounceMs?: number;
  initialValue: T;
}

export function useDebounce<T>(
  callback: (value: T) => void,
  { debounceMs = 100, initialValue }: Options<T>,
) {
  const changed = useRef(false);
  const ref = useRef(initialValue);
  const [value, setValue] = useState(initialValue);

  const resetValue = useCallback(() => {
    setValue(ref.current);
  }, []);

  useEffect(() => {
    // Note that this also prevents firing the callback on initial render, but
    // also precludes the usage of setValue to "reset" the value. This is why we
    // return an explicit `resetValue` updater.
    if (ref.current !== value || changed.current) {
      const t = setTimeout(() => {
        callback(value);
        changed.current = ref.current !== value;
      }, debounceMs);
      return () => clearTimeout(t);
    }
  }, [callback, debounceMs, value]);

  return { value, resetValue, setValue };
}
