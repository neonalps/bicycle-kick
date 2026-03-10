export function unawaited(promise: Promise<unknown>, traceInfo?: string): void {
  promise.catch((err) => {
    console.error([traceInfo ?? `Unawaited promise`, err].join(': '));
  });
}