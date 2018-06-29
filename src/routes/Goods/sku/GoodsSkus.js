import React, { Component } from 'react';

import { Table, Input, InputNumber } from 'antd';
import PropTypes from "prop-types";

import GoodsSkuTable from './GoodsSkuTable';

export default class GoodsSkus extends Component {
  static defaultProps = {
    goodsAttributes: [],
  };

  static propTypes = {
    goodsTypeAttributes: PropTypes.array.isRequired,
    goodsAttributes: PropTypes.array,
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) onChange(changedValue);
  };

  render() {
    const { goodsTypeAttributes, value, goodsAttributes } = this.props;

    return (
      <div>
        <GoodsSkuTable
          value={value}
          goodsAttributes={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          columns={currentDataSource => {
            const dataSource = currentDataSource;

            return [
              {
                title: '条码',
                dataIndex: 'barcode',
                align: 'center',
                render: (rowValue, record, index) => (
                  <Input
                    size="small"
                    value={rowValue}
                    onChange={e => {
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
                      dataSource[index].stockNumber = val;
                      this.triggerChange(dataSource);
                    }}
                    style={{ width: '150px' }}
                  />
                ),
              },
            ];
          }}
          size="small"
          pagination={false}
        />
      </div>
    );
  }
}
