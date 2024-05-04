/**
 * 使用範例
 * GET Value： status400Codes.MISSING_FIELD
 * Get Name ： status400Codes[status400Codes.MISSING_FIELD]
 */

/**
 * @description 400 用戶端錯誤代碼
 */
export enum status400Codes {
  /**
   * 未提供必要標頭、查詢參數或內容
   */
  'MISSING_FIELD' = '未提供必要標頭、查詢參數或內容' as any,
  /**
   * 必填欄位未填
   */
  'REQUIRED_FIELD' = '必填欄位未填' as any,
  /**
   * 錯誤輸入
   */
  'INVALID_VALUE' = '錯誤輸入' as any,
  'UNKNOWN_FIELD' = '提供不明查詢參數或內容時使用' as any,
  'INVALID_TIME' = ' 時間設定異常' as any,
  'INVALID_INPUT' = '輸入資料異常' as any,
  'INVALID_FILTER_OR_SORTING' = '篩選或排序條件異常' as any,
  'INVALID_CREDENTIALS' = '用戶名稱或密碼不正確' as any,
  'INVALID_REQEST' = '請求失敗' as any,
  'ACCOUNT_NOT_VERIFIED' = '帳號尚未完成驗證' as any,
  'QUERY_FAILED' = 'QS 參數錯誤' as any,
  'ACCOUNT_LOCKED' = '帳號已被鎖定，請聯繫客服' as any
}

/**
 * @description 401 用戶端錯誤代碼
 */
export enum status401Codes {
  'UNAUTHORIZED' = '缺少所請求資源的有效身份驗證憑證' as any,
  'EXPIRED_TOKEN' = '令牌已過期' as any,
  'INVALID_TOKEN' = '無效令牌' as any
}

/**
 * @description 403 用戶端錯誤代碼
 */
export enum status403Codes {
  'FORBIDDEN' = '沒有權限' as any,
  'ACCESS_DENIED' = '拒絕請求' as any
}

/**
 * @description 405 用戶端錯誤代碼
 */
export enum status405Codes {
  'METHOD_NOT_ALLOWED' = '請求的方法（GET, POST, PUT, DELETE等）不被允許' as any,
  'UNSUPPORTED_RESPONSE_TYPE' = '不支持的回應類型' as any
}

/**
 * @description 409 用戶端錯誤代碼
 */
export enum status409Codes {
  'ALREADY_EXISTS' = '資料已存在' as any
}

/**
 * @description 422 用戶端錯誤代碼
 */
export enum status422Codes {
  'UNPROCESSABLE_CONTENT' = '格式不正確' as any,
  'INVALID_FORMAT' = '無效格式' as any,
  'UNPROCESSABLE_ENTITY' = '請求的格式錯誤，伺服器無法處理所包含的指令' as any,
  'WORDS_EXCEEDS' = '字數超過限制' as any
}

/**
 * @description 500 用戶端錯誤代碼
 */
export enum status500Codes {
  'SERVER_ERROR' = '後端程式錯誤 或 db處理中錯誤, 例外錯誤' as any,
  'CREATE_FAILED' = '建立失敗' as any,
  'FETCH_FAILED' = '活動取得失敗' as any,
  'UPDATE_FAILED' = '編輯失敗' as any,
  'INVALID_PUBLISH' = '發佈異常' as any
}
