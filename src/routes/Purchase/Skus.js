import React, { Component, Fragment } from 'react';

import {connect} from "dva/index";
import { Table, InputNumber, Popconfirm } from 'antd';
import GoodsSkuSelector from '../Goods/GoodsSkuSelector';

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
          skuId: null,
          count: 0,
          price: 0,
          sumPrice: 0,
        },
      ],
      index: index + 1,
    }));
  };

  handerSaveRow = (rowIndex, record) => {
    const { value = [] } = this.state;
    const list = value.map((val, i) => (i === rowIndex ? Object.assign(
      val,
      {
        sumPrice: (record.count || val.count) * (record.price || val.price),
        price: val.price || record.price || 0,
      },
      record
    ) : val));

    if (list[rowIndex].skuId) {
      this.triggerChange(list);
    } else {
      this.setState({ value: list });
    }
  };

  handerSaveSku = (rowIndex, record) => {
    const {
      goods: { list },
    } = this.props;
    const one = list.find(data => data.id === record.skuId);
    this.handerSaveRow(rowIndex, one? Object.assign(record, {price: one.price}): record);
  }

  handleRemove = index => {
    const { value = [] } = this.state;
    value.splice(index, 1);
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const columns = [
      {
        title: '商品',
        dataIndex: 'skuId',
        render: (val, record, index) => (
          <GoodsSkuSelector
            value={val}
            onChange={v => this.handerSaveSku(index, { skuId: v })}
          />
        ),
      },
      {
        title: '数量',
        dataIndex: 'count',
        width: 130,
        align: 'center',
        render: (val, record, index) => (
          <InputNumber
            size="small"
            value={val}
            style={{ width: '100%' }}
            onChange={v => this.handerSaveRow(index, { count: v })}
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
        title: '金额',
        dataIndex: 'sumPrice',
        width: 130,
        align: 'center',
        render: (val) => `￥ ${val}`,
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
