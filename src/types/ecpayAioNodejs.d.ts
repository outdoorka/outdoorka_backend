/* eslint-disable @typescript-eslint/naming-convention */
// TypeScript Type Definition for ECPay AIO SDK
// Ref: https://www.npmjs.com/package/ecpay_aio_nodejs
declare module 'ecpay_aio_nodejs' {
  export default class ECPayPayment {
    version: any;
    payment_client: any;
    query_client: any;
    exec_grant_refund: any;
    constructor(options: any);
  }
}
