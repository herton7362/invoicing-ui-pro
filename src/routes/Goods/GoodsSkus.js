import React, { Component } from 'react';

import { Table, Input } from 'antd';

export default class GoodsSkus extends Component {
  state = {
    dataSource: null,
  };

  componentWillReceiveProps(nextProps) {
    if('value' in nextProps && 'goodsAttributes' in nextProps && 'goodsTypeAttributes' in nextProps) {
      const { value, goodsTypeAttributes, goodsAttributes } = nextProps;
      const dataSource = this.getSkusByGoodsAttributes(goodsTypeAttributes, goodsAttributes, value);
      this.setState({dataSource});
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

  getSkusByGoodsAttributes = (goodsTypeAttributes, goodsAttributes, value) => {
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
    const getKey = attr=>Object.assign(attr, {
      key: Object.keys(attr)
        .filter(key=>goodsTypeAttributes.some(goodsTypeAttr=>goodsTypeAttr.id === key))
        .sort()
        .map(key=>attr[key])
        .join(','),
    });

    const result = attrCombo.map(group => group.map(attr=>({
      [attr.goodsTypeAttributeId]: attr.goodsTypeAttributeValue,
    })).reduce((x, y) => Object.assign(x, y))).map(getKey);

    const compareSkuChanged = (skus1, skus2) => {
      return skus1.length !== skus2.length || !skus1.every(sku1=>skus2.some(sku2=>sku2.key === sku1.key));
    }

    const addExtraProps = (source, target) => {
      return target.map(targetRow=>Object.assign(targetRow, source.find(sourceRow=>sourceRow.key === targetRow.key)));
    }

    if(value) {
      const keyInValue = value.map(getKey);
      if(compareSkuChanged(result, keyInValue)) {
        this.triggerChange(addExtraProps(keyInValue, result));
      } else {
        return value;
      }
    } else {
      this.triggerChange(result);
    }

    return result;
  }

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
        render: (value, record, index) => {
          return (
            <Input
              size="small"
              value={value}
              onChange={(e) => {
                dataSource[index].barcode = e.target.value;
                this.triggerChange(dataSource);
              }}
              style={{width: '150px'}}
            />
          );
        },
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
      ...goodsTypeAttributes
        .map(attr => ({title: attr.name, dataIndex: attr.id}))
        .filter(attr => dataSource && dataSource.some(data => Object.keys(data).includes(attr.dataIndex)))
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
