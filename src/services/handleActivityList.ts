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

// Convert a Date object to a string in ISO 8601 format
function dateToString(date: Date) {
  return date.toISOString();
}

// Convert a number to a string
function numberToString(number: number) {
  return number.toString();
}

// Convert an ObjectId to a string
function objectIdToString(objectId: Types.ObjectId) {
  return objectId.toString();
}

export const generateCursor = (item: any, mappedField: string) => {
  let cursorId1;
  if (mappedField === 'activityStartTime') {
    cursorId1 = dateToString(item[mappedField]);
  } else {
    cursorId1 = numberToString(item[mappedField]);
  }
  const cursorId2 = objectIdToString(item._id);
  return `${cursorId1}_${cursorId2}`;
};
