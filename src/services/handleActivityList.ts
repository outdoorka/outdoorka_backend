import { Types } from 'mongoose';
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

function stringToObjectId(value: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error(`Cannot convert "${value}" to an ObjectId`);
  }
  return new Types.ObjectId(value);
}

function stringToNumber(value: string): number {
  const number = Number(value);
  if (isNaN(number)) {
    throw new Error(`Cannot convert "${value}" to a number`);
  }
  return number;
}

function stringToDate(value: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Cannot convert "${value}" to a date`);
  }
  return date;
}

export const transformedCursor = (field: string, cursorId: string) => {
  const [cursorId1, cursorId2] = cursorId.split('_');
  let cursorValue;
  if (field === 'date') {
    cursorValue = stringToDate(cursorId1);
  } else {
    cursorValue = stringToNumber(cursorId1);
  }
  const cursorObjectId = stringToObjectId(cursorId2);
  return { cursorValue, cursorObjectId };
};
