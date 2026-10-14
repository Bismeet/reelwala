export function sequenceFrameIndex(progress: number, count: number) {
  return Math.round(
    Math.max(0, Math.min(1, progress)) * Math.max(0, count - 1),
  );
}

export type SequenceImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

/** Download progressively, retain small compressed files, and bound decoded pixels. */
export class SequenceFrameCache {
  private blobs = new Map<number, Blob>();
  private images = new Map<number, SequenceImage>();
  private fetching = new Set<number>();
  private decoding = new Set<number>();
  private failed = new Set<number>();
  private decodeFailed = new Set<number>();
  private controller = new AbortController();
  private target = 0;
  private disposed = false;
  private compressedBytes = 0;
  private decodedBytes = 0;

  constructor(
    private count: number,
    private load: (index: number, signal: AbortSignal) => Promise<Blob>,
    private decode: (blob: Blob) => Promise<SequenceImage>,
    private changed: () => void,
    private onError: (index: number) => void,
    private memoryLimit = 64 * 1024 * 1024,
    private compressedLimit = 32 * 1024 * 1024,
    private progressive = true,
  ) {}

  setProgressive(enabled: boolean) {
    this.progressive = enabled;
    this.pump();
  }

  setTarget(index: number) {
    this.target = Math.max(0, Math.min(this.count - 1, index));
    this.pump();
  }

  nearest(index = this.target) {
    let result: { index: number; image: SequenceImage } | undefined;
    for (const [candidate, image] of this.images) {
      if (
        !result ||
        Math.abs(candidate - index) < Math.abs(result.index - index)
      )
        result = { index: candidate, image };
    }
    return result;
  }

  get(index: number) {
    const image = this.images.get(index);
    return image ? { index, image } : undefined;
  }

  get stats() {
    return {
      decodedBytes: this.decodedBytes,
      decodedFrames: this.images.size,
      compressedBytes: this.compressedBytes,
      downloading: this.fetching.size,
    };
  }

  private order() {
    if (!this.progressive) return [this.target];
    return Array.from({ length: this.count }, (_, i) => i).sort(
      (a, b) => Math.abs(a - this.target) - Math.abs(b - this.target),
    );
  }

  private pump() {
    if (this.disposed) return;
    const order = this.order();
    // Download the requested frame first; the remaining queue adapts on every scroll.
    for (const index of order) {
      if (this.fetching.size >= 4) break;
      if (
        this.blobs.has(index) ||
        this.fetching.has(index) ||
        this.failed.has(index)
      )
        continue;
      // Once the compressed budget fills, only fetch frames in the active window.
      if (
        this.compressedBytes >= this.compressedLimit &&
        Math.abs(index - this.target) > 4
      )
        continue;
      this.fetching.add(index);
      void this.load(index, this.controller.signal)
        .then((blob) => {
          if (this.disposed) return;
          this.blobs.set(index, blob);
          this.compressedBytes += blob.size;
          while (
            this.compressedBytes > this.compressedLimit &&
            this.blobs.size > 1
          ) {
            const farthest = [...this.blobs.keys()].sort(
              (a, b) => Math.abs(b - this.target) - Math.abs(a - this.target),
            )[0];
            this.compressedBytes -= this.blobs.get(farthest)!.size;
            this.blobs.delete(farthest);
          }
        })
        .catch(() => {
          if (!this.disposed) {
            this.failed.add(index);
            this.onError(index);
          }
        })
        .finally(() => {
          this.fetching.delete(index);
          this.pump();
        });
    }
    const firstImage = this.images.values().next().value as
      SequenceImage | undefined;
    const radius = firstImage
      ? Math.max(
          0,
          Math.min(
            2,
            Math.floor(
              (this.memoryLimit / (firstImage.width * firstImage.height * 4) -
                1) /
                2,
            ),
          ),
        )
      : 2;
    for (const index of order) {
      if (this.decoding.size >= 2) break;
      if (Math.abs(index - this.target) > radius) break;
      if (
        this.images.has(index) ||
        this.decoding.has(index) ||
        this.decodeFailed.has(index)
      )
        continue;
      const blob = this.blobs.get(index);
      if (!blob) continue;
      this.decoding.add(index);
      void this.decode(blob)
        .then((image) => {
          if (this.disposed || Math.abs(index - this.target) > radius) {
            image.close();
            return;
          }
          this.images.set(index, image);
          this.decodedBytes += image.width * image.height * 4;
          while (this.decodedBytes > this.memoryLimit && this.images.size > 1) {
            const farthest = [...this.images.keys()].sort(
              (a, b) => Math.abs(b - this.target) - Math.abs(a - this.target),
            )[0];
            const old = this.images.get(farthest)!;
            this.decodedBytes -= old.width * old.height * 4;
            old.close();
            this.images.delete(farthest);
          }
          this.changed();
        })
        .catch(() => {
          if (!this.disposed) {
            this.decodeFailed.add(index);
            this.onError(index);
          }
        })
        .finally(() => {
          this.decoding.delete(index);
          this.pump();
        });
    }
  }

  dispose() {
    this.disposed = true;
    this.controller.abort();
    this.images.forEach((image) => image.close());
    this.images.clear();
    this.blobs.clear();
    this.decodedBytes = this.compressedBytes = 0;
  }
}
