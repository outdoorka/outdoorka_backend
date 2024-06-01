export function mapCapacityScaleToRange(capacityScale: number): {
  $gte: number;
  $lte?: number;
} | null {
  switch (capacityScale) {
    case 1:
      return { $gte: 0, $lte: 10 };
    case 2:
      return { $gte: 11, $lte: 30 };
    case 3:
      return { $gte: 31, $lte: 50 };
    case 4:
      return { $gte: 51, $lte: 100 };
    case 5:
      return { $gte: 101 };
    default:
      return null;
  }
}
