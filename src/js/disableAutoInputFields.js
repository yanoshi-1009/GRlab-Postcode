import constant from './constant';

// レコード内の自動入力対象の住所フィールドを編集不可へ
export default (event) => {
  const fieldCode = constant.fieldCode;
  event.record[fieldCode.address1].disabled = true;
  event.record[fieldCode.address2].disabled = true;
  event.record[fieldCode.id].disabled = true;

  return event;
};
