// import '../style/style.scss';

(() => {
  'use strict';
  const fieldCode = {
    postalCode: '郵便番号',
    address1: '都道府県',
    address2: '市区町村',
    address3: '番地以下',
    address4: '建物名_部屋番号'
  };

  const postalCodeReg = /\d{7}/;

  // 自動入力される住所欄の手動編集を不可へ
  kintone.events.on(
    ['app.record.edit.show', 'mobile.app.record.edit.show'],
    (event) => {
      event.record[fieldCode.address1].disabled = true;
      event.record[fieldCode.address2].disabled = true;

      return event;
    }
  );

  // 郵便番号を入力したタイミングで住所を取得
  kintone.events.on(
    [
      `app.record.crete.change.${fieldCode.postalCode}`,
      `mobile.app.record.crate.change.${fieldCode.postalCode}`,
      `app.record.edit.change.${fieldCode.postalCode}`,
      `mobile.app.record.edit.change.${fieldCode.postalCode}`
    ],
    (event) => {
      const record = event.record;
      const postalCode = event.changes.field.value;
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
    }
  );
})();
