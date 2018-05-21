import React, { Component } from 'react';

import { Table, Input, InputNumber } from 'antd';

export default class GoodsSkus extends Component {
  state = {
    dataSource: null,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && 'goodsAttributes' in nextProps) {
      const { value, goodsAttributes } = nextProps;
      const dataSource = this.getSkusByGoodsAttributes(goodsAttributes, value);
      this.setState({ dataSource });
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

  getSkusByGoodsAttributes = (goodsAttributes, value) => {
    const distinctAttr = (goodsAttributes && goodsAttributes.filter(v => v)) || [];
    const attrGroup = [];
    distinctAttr.forEach(item => {
      // 根据商品属性分组，同一属性的商品放到一组当中
      const group = attrGroup.find(g =>
        g.some(sub => sub.goodsTypeAttributeId === item.goodsTypeAttributeId)
      );
      if (group) {
        group.push(item);
      } else {
        attrGroup.push([item]);
      }
    });

    const attrCombo = this.getGoodsAttrCombo(attrGroup);
    const addGoodsAttributes = attr =>
      attr.goodsAttributes
        ? attr
        : Object.assign(attr, {
            goodsAttributes: Object.keys(attr)
              .filter(key =>
                goodsAttributes.some(goodsAttribute => goodsAttribute.goodsTypeAttributeId === key)
              )
              .sort()
              .map(key => `${key}:${attr[key]}`)
              .join(','),
          });

    const result = attrCombo
      .map(group =>
        group
          .map(attr => ({
            [attr.goodsTypeAttributeId]: attr.goodsTypeAttributeValue,
            lastPurchasePrice: 0,
            stockNumber: 0,
          }))
          .reduce((x, y) => Object.assign(x, y))
      )
      .map(addGoodsAttributes);

    const goodsAttributesMatch = (sku1, sku2) => {
      return sku1.goodsAttributes
        .split(',')
        .every(sku => sku2.goodsAttributes.split(',').includes(sku))
        && sku2.goodsAttributes
          .split(',')
          .every(sku => sku1.goodsAttributes.split(',').includes(sku));
    };

    const compareSkuChanged = (skus1, skus2) => {
      return (
        skus1.length !== skus2.length ||
        !skus1.every(sku1 => skus2.some(sku2 => goodsAttributesMatch(sku1, sku2)))
      );
    };

    const addExtraProps = (source, target) => {
      return target.map(targetRow =>
        Object.assign(
          targetRow,
          source.find(sourceRow => goodsAttributesMatch(sourceRow, targetRow))
        )
      );
    };

    if (value) {
      const attrInValue = value.map(addGoodsAttributes);

      if (compareSkuChanged(result, attrInValue)) {
        this.triggerChange(addExtraProps(attrInValue, result));
      } else {
        return addExtraProps(attrInValue, result);
      }
    } else {
      this.triggerChange(result);
    }

    return result;
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
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
        if (numbers[index].next() && index < colsLength.length - 1) {
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
    const { dataSource } = this.state;

    const columns = [
      {
        title: '条码',
        dataIndex: 'barcode',
        align: 'center',
        render: (value, record, index) => (
          <Input
            size="small"
            value={value}
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
        render: (value, record, index) => (
          <InputNumber
            size="small"
            value={value}
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
        render: (value, record, index) => (
          <InputNumber
            size="small"
            value={value}
            onChange={val => {
              dataSource[index].stockNumber = val;
              this.triggerChange(dataSource);
            }}
            style={{ width: '150px' }}
          />
        ),
      },
    ];

    columns.unshift(
      ...goodsTypeAttributes
        .map(attr => ({ title: attr.name, dataIndex: attr.id, align: 'center' }))
        .filter(
          attr => dataSource && dataSource.some(data => Object.keys(data).includes(attr.dataIndex))
        )
    );

    return (
      <Table
        size="small"
        rowKey={record => `${goodsTypeAttributes.map(attr => record[attr.id])}`}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }
}
