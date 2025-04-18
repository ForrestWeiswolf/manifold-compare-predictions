export const formatProb = (prob: number) => `${Math.round(prob * 100)}%`;

export const memoize = <T extends (...args: unknown[]) => ReturnType<T>>(fn: T) => {
  const calls = new Map<string, ReturnType<T>>();
  return async (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (!calls.has(key)) {
      calls.set(key, fn(...args));
    }
    return calls.get(key) as ReturnType<T>;
  };
};