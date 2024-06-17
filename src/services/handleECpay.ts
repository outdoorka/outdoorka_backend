import ecpay_payment from 'ecpay_aio_nodejs';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/naming-convention

export function generatePayment(totalPrice: number) {
  const { MERCHANTID, HASHKEY, HASHIV, HOST, FRONTEND_URL } = process.env;
  const date = new Date();

  const formattedDate = date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const formattedTime = date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const MerchantTradeDate = `${formattedDate} ${formattedTime}`;
  console.log(MerchantTradeDate);
  const MerchantTradeNo = generateShortUuid();
  const baseParam = {
    MerchantTradeNo, // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate, // ex: 2017/02/13 15:45:30
    TotalAmount: totalPrice.toString(),
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: `${HOST}/return`,
    ClientBackURL: `${FRONTEND_URL}/index.html`
  };

  const options = {
    OperationMode: 'Test', // Test or Production
    MercProfile: {
      MerchantID: MERCHANTID,
      HashKey: HASHKEY,
      HashIV: HASHIV
    },
    IgnorePayment: [
      //    "Credit",
      //    "WebATM",
      //    "ATM",
      //    "CVS",
      //    "BARCODE",
      //    "AndroidPay"
    ],
    IsProjectContractor: false
  };
  try {
    // eslint-disable-next-line new-cap
    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(baseParam);
    return html;
  } catch (error) {
    console.error(error);
  }
}

function generateShortUuid() {
  const uuid = uuidv4();
  const shortUuid = uuid.replace(/-/g, '').substring(0, 20);
  return shortUuid;
}
