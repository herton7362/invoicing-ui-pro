import React, { Component, Fragment } from 'react';

import { Table, Input, InputNumber, Divider, Popconfirm } from 'antd';
import SupplierSelector from '../Supplier/SupplierSelector';

export default class GoodsTypeSelector extends Component {
  state = {
    value: null,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props))
      this.setState({ value: changedValue });
    if (onChange)
      onChange(changedValue);
  };

  render() {
    const { value } = this.state;
    const columns = [
      {
        title: '供应商',
        render: (val, record) =>
          <SupplierSelector value={record.businessRelatedUnitId} />,
      },
      {
        title: '最少数量',
        render: (val, record) =>
          <Input value={record.minimumCount} />,
      },
      {
        title: '单价',
        render: (val, record) =>
          <InputNumber value={record.price} />,
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a onClick={() => this.handleOpenEditModal(record.id)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleOpenAddAttrModal(record.id)}>添加属性</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定删除${record.name}吗?`}
              onConfirm={() => this.handleRemove(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <Table
          dataSource={value}
          pagination={false}
          columns={columns}
          size="small"
        />
        <a onClick={this.handleOpenAddModal}>添加供应商</a>
      </Fragment>
    );
  }
}
