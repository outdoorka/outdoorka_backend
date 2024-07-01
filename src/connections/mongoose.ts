import mongoose from 'mongoose';
import { config } from '../config';

// import { UserModel } from '../models/user';

if (!config.DATABASE_URL) {
  throw new Error('資料庫連接資訊錯誤');
}

// 資料庫連接資訊
const DB = config.DATABASE_URL.replace('<password>', config.DATABASE_PASSWORD ?? '');

export default () => {
  // 連接資料庫
  const connect = () => {
    console.info('等待，資料庫連接中...');
    mongoose
      .connect(DB)
      .then(async () => {
        console.log('資料庫連接成功');

        // 重建索引
        // await UserModel.collection.dropIndexes();
        // console.log('Indexes dropped : 重建索引成功');
        // process.exit(0);
      })
      .catch((err) => {
        console.error('資料庫連接失敗: ', err.message);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
