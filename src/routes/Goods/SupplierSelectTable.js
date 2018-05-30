import React, { Component, Fragment } from 'react';

import { Table, InputNumber, Popconfirm } from 'antd';
import SupplierSelector from '../Supplier/SupplierSelector';

export default class GoodsTypeSelector extends Component {
  state = {
    value: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  handleAddRow = () => {
    this.setState(({ value = [], index = 0 }) => ({
      value: [
        ...value,
        {
          key: index,
          businessRelatedUnitId: null,
          minimumCount: 0,
          price: 0,
        },
      ],
      index: index + 1,
    }));
  };

  handerSaveRow = (rowIndex, record) => {
    const { value = [] } = this.state;
    const list = value.map((val, i) => (i === rowIndex ? Object.assign(val, record) : val));

    if (list[rowIndex].businessRelatedUnitId) {
      this.triggerChange(list);
    } else {
      this.setState({ value: list });
    }
  };

  handleRemove = index => {
    const { value = [] } = this.state;
    value.splice(index, 1);
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const columns = [
      {
        title: '供应商',
        dataIndex: 'businessRelatedUnitId',
        render: (val, record, index) => (
          <SupplierSelector
            size="small"
            value={val}
            onChange={v => this.handerSaveRow(index, { businessRelatedUnitId: v })}
          />
        ),
      },
      {
        title: '最少数量',
        dataIndex: 'minimumCount',
        width: 130,
        align: 'center',
        render: (val, record, index) => (
          <InputNumber
            size="small"
            value={val}
            style={{ width: '100%' }}
            onChange={v => this.handerSaveRow(index, { minimumCount: v })}
          />
        ),
      },
      {
        title: '单价',
        dataIndex: 'price',
        width: 130,
        align: 'center',
        render: (val, record, index) => (
          <InputNumber
            size="small"
            value={val}
            style={{ width: '100%' }}
            onChange={v => this.handerSaveRow(index, { price: v })}
          />
        ),
      },
      {
        title: '操作',
        width: 120,
        align: 'center',
        render: (val, record, index) => (
          <Fragment>
            <Popconfirm
              title={`确定删除${record.name}吗?`}
              onConfirm={() => this.handleRemove(index)}
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
          rowKey={record => record.businessRelatedUnitId || record.key}
          dataSource={value}
          pagination={false}
          columns={columns}
          size="small"
        />
        <a onClick={this.handleAddRow}>添加供应商</a>
      </Fragment>
    );
  }
}
