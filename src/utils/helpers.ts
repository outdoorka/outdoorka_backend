// 檢查是否為 string
export function isString(input: any) {
  return typeof input === 'string' && Object.prototype.toString.call(input) === '[object String]';
}
