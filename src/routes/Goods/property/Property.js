import React, { Fragment } from 'react';

import { Table } from 'antd';

export default (record) => {

  const columns = [
    { title: '属性名称', dataIndex: 'name' },
    {
      title: '可选值列表',
      render: (val, row) => (
        <Fragment>
          {row.goodsPropertyValueResults.map(value => (
            value.name
          )).join('，')}
        </Fragment>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={record.goodsPropertyResults}
      pagination={false}
    />
  );
}
