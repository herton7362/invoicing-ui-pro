import React, { Component } from 'react';

import { Table } from 'antd';

export default class GoodsSkus extends Component {
  state = {
    value: null,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  getGoodsAttrCombo = attrs => {
    const attrColumnsLength = [];
    attrs.forEach(r => {
      attrColumnsLength.push(r.length);
    });
    if (attrColumnsLength.length > 0) {
      const matrix = this.generateComboMatrix(attrColumnsLength);
      return matrix.map(row => row.map((index, colIndex) => attrs[colIndex][index]));
    }
    return [];
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  // 接受一个数组参数，例[2,3]，代表当前有两组，第一组长度为2，第二组长度为3
  // 输出两组的所有组合，例 [0, 0] [1, 0] [0, 1] [1, 1] [0, 2] [1, 2]
  generateComboMatrix = columnsLength => {
    const getColumn = length => {
      let num = 0;

      const isLast = () => {
        return num >= length - 1;
      };

      return {
        next: () => {
          if (isLast()) {
            num = 0;
            return true;
          } else {
            num += 1;
            return false;
          }
        },
        length,
        get: () => num,
      };
    };

    const getRow = colsLength => {
      const numbers = [];
      colsLength.forEach(length => {
        numbers.push(getColumn(length));
      });

      const isLast = index => {
        return index >= colsLength.length - 1;
      };

      const next = (index = 0) => {
        if (numbers[index].next() && numbers[index].length > 1) {
          if (isLast(index)) {
            next();
          } else {
            next(index + 1);
          }
        }
      };

      return {
        next: () => {
          const result = numbers.map(num => num.get());
          next();
          return result;
        },
      };
    };
    const length = columnsLength.reduce((x, y) => x * y);
    const matrix = new Array(length).fill([]);
    const row = getRow(columnsLength);
    return matrix.map(() => row.next());
  };

  render() {
    const { goodsTypeAttributes } = this.props;
    const { value } = this.state;
    const columns = [
      {
        title: '条码',
        dataIndex: 'barcode',
      },
      {
        title: '进货价',
        dataIndex: 'lastPurchasePrice',
      },
      {
        title: '库存数量',
        dataIndex: 'stockNumber',
      },
    ];

    columns.unshift(
      goodsTypeAttributes.map(attr => ({
        title: attr.name,
        dataIndex: attr.id,
      }))
    );

    return <Table columns={columns} dataSource={value} />;
  }
}
