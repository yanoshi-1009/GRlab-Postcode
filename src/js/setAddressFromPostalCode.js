import constant from './constant';

export default (event) => {
  const fieldCode = constant.fieldCode;
  const record = event.record;
  const postalCode = event.changes.field.value;
  const postalCodeReg = /\d{7}/;

  // フィールドエラーの初期化
  record[fieldCode.postalCode].error = null;

  // 入力値チェック
  if (!postalCodeReg.test(postalCode)) {
    record[fieldCode.postalCode].error =
      '郵便番号はハイフン無しの半角数値7文字で入力してください';
    return event;
  }

  kintone.proxy(
    `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`,
    'GET',
    {},
    {},
    (resp) => {
      const tmpRecord = kintone.app.record.get();
      const result = JSON.parse(resp).results[0];
      tmpRecord.record[fieldCode.address1].value = result.address1;
      tmpRecord.record[fieldCode.address2].value = result.address2;
      tmpRecord.record[fieldCode.address3].value = result.address3;
      tmpRecord.record[fieldCode.address4].value = '';
      kintone.app.record.set(tmpRecord);
    },
    (error) => {
      console.log(error);
    }
  );

  return event;
};
