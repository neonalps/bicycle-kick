export async function mapAsyncSeq<T, U>(array: readonly T[], fn: (value: T, index: number) => Promise<U>): Promise<U[]> {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(await fn(array[i], i));
  }
  return result;
}

export async function processInChunksSequentially<T>(allData: ReadonlyArray<T>, batchSize: number, chunkOperation: (items: T[]) => Promise<void>): Promise<void> {
  const chunks = splitIntoChunks(allData, batchSize);

  await mapAsyncSeq(chunks, (batch) => chunkOperation(batch));
}
export function splitIntoChunks<T>(array: ReadonlyArray<T>, size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}