import {KintoneRestAPIClient} from '@kintone/rest-api-client';
import constant from './constant';

export default async (event) => {
  const record = event.record;
  const fieldCode = constant.fieldCode;
  const appID = kintone.app.getId() || kintone.mobile.app.getId();
  const client = new KintoneRestAPIClient({});
  return client.record
    .getRecords({
      app: appID,
      fields: ['ID'],
      query: 'order by ID desc limit 1',
      totalCount: false
    })
    .then((resp) => {
      record[fieldCode.id].value = Number(resp.records[0].ID.value) + 1;
      return event;
    })
    .catch((error) => {
      console.error(error);
      alert('自動採番に失敗しました管理者に問い合わせてください');
      return event;
    });
};
