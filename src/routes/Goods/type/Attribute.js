import React, { Fragment } from 'react';

import { Table, Divider, Popconfirm } from 'antd';

export default (record, handleOpenEditAttrModal, handleAttrRemove) => {
  const columns = [
    { title: '属性名称', dataIndex: 'name' },
    {
      title: '可选值列表',
      render: (val, row) => <Fragment>{row.attrValues.replace(/,/g, '，')}</Fragment>,
    },
    {
      title: '操作',
      render: (val, row) => (
        <Fragment>
          <a onClick={() => handleOpenEditAttrModal(row.id)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title={`确定删除${record.name}吗?`}
            onConfirm={() => handleAttrRemove(row.id)}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <Table rowKey="id" columns={columns} dataSource={record.goodsAttributes} pagination={false} />
  );
};
