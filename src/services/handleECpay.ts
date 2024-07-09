import ecpay_payment from 'ecpay_aio_nodejs';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { MERCHANTID, HASHKEY, HASHIV, HOST, FRONTEND_URL } = process.env;

export const options = {
  OperationMode: 'Test', // Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV
  },
  IgnorePayment: 'ATM#CVS#BARCODE#BNPL',
  IsProjectContractor: false
};

export function generatePayment(
  paymentId: string,
  totalPrice: number,
  tradeDesc: string = '測試交易描述',
  itemName: string = '測試商品等'
) {
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
    TradeDesc: tradeDesc,
    ItemName: itemName,
    ReturnURL: `${HOST}/payments/result`,
    ClientBackURL: `${FRONTEND_URL}/check/success?paymentId=${paymentId}&totalPrice=${totalPrice}` // 前端返回頁面
  };
  try {
    // eslint-disable-next-line new-cap
    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(baseParam);
    return { html, MerchantTradeNo };
  } catch (error) {
    console.error(error);
    return { html: '', MerchantTradeNo: '' };
  }
}

function generateShortUuid() {
  const uuid = uuidv4();
  const shortUuid = uuid.replace(/-/g, '').substring(0, 20);
  return shortUuid;
}

export function getPaymentResult(body: any): { checkMac: boolean; data: any } {
  if (body) {
    const { CheckMacValue = '', RtnCode = '' } = body;
    console.log('CheckMacValue', CheckMacValue);
    console.log('RtnCode', RtnCode);
    const data: any = { ...body };
    delete data.CheckMacValue;
    // eslint-disable-next-line new-cap
    const create = new ecpay_payment(options);
    const decryptedCheckMacValue = create.payment_client.helper.gen_chk_mac_value(data);
    if (CheckMacValue === decryptedCheckMacValue) {
      return { checkMac: true, data };
    } else {
      return { checkMac: false, data: null };
    }
  } else {
    return { checkMac: false, data: null };
  }
}
