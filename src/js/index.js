// import '../style/style.scss';
import constant from './constant';
import disableAutoInputFields from './disableAutoInputFields';
import setAddressFromPostalCode from './setAddressFromPostalCode';
import setID from './setID';

(() => {
  'use strict';
  const fieldCode = constant.fieldCode;

  // 自動入力される住所欄の手動編集を不可へ
  kintone.events.on(
    [
      'app.record.create.show',
      'mobile.app.record.create.show',
      'app.record.edit.show',
      'mobile.app.record.edit.show'
    ],
    (event) => {
      return disableAutoInputFields(event);
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
      return setAddressFromPostalCode(event);
    }
  );

  // ID自動採番
  kintone.events.on(
    ['app.record.create.submit', 'mobile.app.record.create.submit'],
    (event) => {
      return setID(event);
    }
  );
})();
