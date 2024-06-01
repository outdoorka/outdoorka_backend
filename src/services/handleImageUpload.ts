import dayjs from 'dayjs';
import { firebaseAdmin } from '../connections/firebase';
import sharp from 'sharp';
import { type GetSignedUrlConfig } from '@google-cloud/storage';

const bucket = firebaseAdmin.storage().bucket();

/**
 * 圖片上傳處理
 * @param file
 * @param fileName
 * @returns
 */
export const handleImageUpload = async (file: Express.Multer.File, fileName: string) => {
  return await new Promise((resolve, reject) => {
    imageOptimize(file)
      .then((bufferFile) => {
        // 建立一個 blob 物件
        const blob = bucket.file(fileName);
        // 建立一個可以寫入 blob 的物件
        const blobStream = blob.createWriteStream();

        // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
        blobStream.on('finish', () => {
          // 有效期限如： 12-31-2024
          const imgExpiresDate = dayjs().add(6, 'month').format('MM-DD-YYYY');

          // 設定檔案的存取權限
          const config: GetSignedUrlConfig = {
            action: 'read', // 權限
            expires: imgExpiresDate // 網址的有效期限
          };

          // 取得檔案的網址
          blob
            .getSignedUrl(config)
            .then((url) => {
              // handleResponse(res, { url }, '上傳成功');
              resolve({
                message: '上傳成功',
                url: url[0]
              });
            })
            .catch((err) => {
              const message = err.message || '上傳失敗';
              reject(new Error(message));
            });
        });

        // 如果上傳過程中發生錯誤，會觸發 error 事件
        blobStream.on('error', (err) => {
          const message = err.message || '上傳失敗';
          reject(new Error(message));
        });

        // 將檔案的 buffer 寫入 blobStream
        blobStream.end(bufferFile);
      })
      .catch((err) => {
        reject(new Error(err.message || '圖片上傳失敗'));
      });
  });
};

/**
 * 圖片刪除處理
 * @param fileName
 * @returns
 */
export const handleImageDelete = async (fileName: string) => {
  return await new Promise((resolve, reject) => {
    const blob = bucket.file(fileName);
    blob
      .delete()
      .then(() => {
        resolve('刪除成功');
      })
      .catch((err) => {
        reject(new Error(err.message || '刪除失敗'));
      });
  });
};

/**
 * 圖片檔案處理
 * @param file Express.Multer.File
 * @returns Promise<Buffer>
 */
export const imageOptimize = async (file: Express.Multer.File): Promise<Buffer> => {
  return await new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('請選擇圖片'));
    } else {
      sharp(file.buffer)
        .jpeg({ mozjpeg: true })
        .toBuffer()
        .then((bufferData) => {
          resolve(bufferData);
        })
        .catch(() => {
          reject(new Error('圖片處理失敗'));
        });
    }
  });
};
