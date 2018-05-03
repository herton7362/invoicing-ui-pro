import React, { Fragment } from 'react';

import { Table } from 'antd';

export default (record) => {

  const columns = [
    { title: '属性名称', dataIndex: 'name' },
    {
      title: '可选值列表',
      render: (val, row) => (
        <Fragment>
          {row.attrValues}
        </Fragment>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={record.goodsAttributes}
      pagination={false}
    />
  );
}
