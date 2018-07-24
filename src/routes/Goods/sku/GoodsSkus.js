import React, { Component } from 'react';

import { Input, InputNumber } from 'antd';
import PropTypes from 'prop-types';

import GoodsSkuTable from './GoodsSkuTable';

export default class GoodsSkus extends Component {
  static propTypes = {
    goodsTypeAttributes: PropTypes.array.isRequired,
    goodsAttributes: PropTypes.array,
  };

  static defaultProps = {
    goodsAttributes: [],
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) onChange(changedValue);
  };

  render() {
    const { goodsTypeAttributes, value, goodsAttributes } = this.props;

    const columns = currentDataSource => [
      {
        title: '条码',
        dataIndex: 'barcode',
        align: 'center',
        render: (rowValue, record, index) => (
          <Input
            size="small"
            value={rowValue}
            onChange={e => {
              const dataSource = currentDataSource;
              dataSource[index].barcode = e.target.value;
              this.triggerChange(dataSource);
            }}
            style={{ width: '150px' }}
          />
        ),
      },
      {
        title: '进货价',
        dataIndex: 'lastPurchasePrice',
        align: 'center',
        render: (rowValue, record, index) => (
          <InputNumber
            size="small"
            value={rowValue}
            onChange={val => {
              const dataSource = currentDataSource;
              dataSource[index].lastPurchasePrice = val;
              this.triggerChange(dataSource);
            }}
            style={{ width: '150px' }}
          />
        ),
      },
      {
        title: '库存数量',
        dataIndex: 'stockNumber',
        align: 'center',
        render: (rowValue, record, index) => (
          <InputNumber
            size="small"
            value={rowValue}
            onChange={val => {
              const dataSource = currentDataSource;
              dataSource[index].stockNumber = val;
              this.triggerChange(dataSource);
            }}
            style={{ width: '150px' }}
          />
        ),
      },
    ];

    return (
      <div>
        <GoodsSkuTable
          value={value}
          goodsAttributes={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          columns={columns}
          size="small"
          pagination={false}
          onChange={this.triggerChange}
        />
      </div>
    );
  }
}
