import { useEffect, useRef, useState,useCallback } from "react";

interface Callback<T> {
  (value: T): void;
}

interface SetStateWithCallback<T> {
  (newState: T | ((prev: T) => T), callback?: Callback<T>): void;
}

const useStateWithCallback = <T>(initialState: T): [T, SetStateWithCallback<T>] => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef<Callback<T> | null>(null);

  const updateState: SetStateWithCallback<T> = useCallback((newState, callback) => {
    callbackRef.current = callback || null;

    setState(prev => typeof newState === 'function' ? (newState as (prev: T) => T)(prev) : newState);
  }, []);

  useEffect(() => {
    if (!callbackRef.current) return;

    callbackRef.current(state);
    callbackRef.current = null;
  }, [state]);

  return [state, updateState];
}

export default useStateWithCallback;