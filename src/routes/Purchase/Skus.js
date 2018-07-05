import React, { Component, Fragment } from 'react';

import { Table, InputNumber } from 'antd';
import GoodsSkuSelector from '../Goods/sku/GoodsSkuSelector';

export default class GoodsTypeSelector extends Component {
  state = {
    value: [],
    modalVisible: false,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  onGoodsSkuSelected = goodsSkus => {
    const { value = [] } = this.state;

    const matchedRows = value.filter(row1 => goodsSkus.some(row2 => row2.id === row1.id));
    const restRows = goodsSkus.filter(row1 => matchedRows.every(row2 => row2.id !== row1.id));
    const increaseCount = rows => {
      rows.forEach(row =>
        Object.assign(row, {
          count: row.count + goodsSkus.find(sku => sku.id === row.id).count,
        })
      );
    };
    const appendNewSkus = rows => {
      value.push(
        ...rows.map((goodsSku, index) =>
          Object.assign(goodsSku, {
            goods: Object.assign(goodsSku.goods, { rowSpan: index === 0 ? rows.length : 0 }),
          })
        )
      );
    };
    const groupByGoods = result =>
      result.sort((row1, row2) => (row1.goodsId === row2.goodsId ? 0 : -1));
    const filter = result => [...result.filter(row => row.count > 0)];

    increaseCount(matchedRows);
    appendNewSkus(restRows);

    this.triggerChange(this.mergeCell(groupByGoods(filter(value))));
  };

  mergeCell = result => {
    let lastGoodsId;
    return result.map(row => {
      const newRow = Object.assign(row, {
        goods: Object.assign(row.goods, {
          rowSpan:
            lastGoodsId !== row.goodsId
              ? result.filter(tmp => tmp.goodsId === row.goodsId).length
              : 0,
        }),
      });
      lastGoodsId = row.goodsId;
      return newRow;
    });
  };

  dataToObject = data => {
    return data.map(row =>
      Object.assign(row, {
        id: null,
        skuId: row.id,
      })
    );
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(this.dataToObject(changedValue));
  };

  handleAddRow = () => {
    this.setState({ modalVisible: true });
  };

  handleRemove = index => {
    const { value = [] } = this.state;
    value.splice(index, 1);
    const result = this.mergeCell([...value]);
    this.setState(result);
    this.triggerChange(result);
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const { value, modalVisible } = this.state;
    const columns = [
      {
        title: '商品',
        dataIndex: 'goods.name',
        render: (v, row) => ({
          children: v,
          props: {
            rowSpan: row.goods.rowSpan,
          },
        }),
      },
      {
        title: '规格',
        dataIndex: 'attributeName',
        align: 'center',
      },
      {
        title: '单价',
        dataIndex: 'price',
        width: 130,
        align: 'center',
        render: (rowValue, record, index) => (
          <InputNumber
            size="small"
            value={rowValue}
            onChange={val => {
              const dataSource = value;
              dataSource[index].price = val;
              dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
              this.setState({ value: dataSource });
              this.triggerChange(dataSource);
            }}
            style={{ width: '100px' }}
          />
        ),
      },
      {
        title: '数量',
        dataIndex: 'count',
        width: 130,
        align: 'center',
        render: (rowValue, record, index) => (
          <InputNumber
            size="small"
            value={rowValue}
            min={0}
            onChange={val => {
              const dataSource = value;
              dataSource[index].count = val;
              dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
              this.setState({ value: dataSource });
              this.triggerChange(dataSource);
            }}
            style={{ width: '100px' }}
          />
        ),
      },
      {
        title: '金额',
        dataIndex: 'sumPrice',
        width: 130,
        align: 'center',
        render: (rowValue, record, index) => (
          <InputNumber
            size="small"
            value={rowValue}
            onChange={val => {
              const dataSource = value;
              dataSource[index].sumPrice = val;
              this.setState({ value: dataSource });
              this.triggerChange(dataSource);
            }}
            style={{ width: '100px' }}
          />
        ),
      },
      {
        title: '操作',
        width: 120,
        align: 'center',
        render: (val, record, index) => <a onClick={() => this.handleRemove(index)}>删除</a>,
      },
    ];

    const parentMethods = {
      onOk: this.onGoodsSkuSelected,
      handleModalVisible: this.handleModalVisible,
      onCancel: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Table rowKey={row => row.skuId} dataSource={value} pagination={false} columns={columns} />
        <a onClick={this.handleAddRow}>添加商品</a>
        <GoodsSkuSelector {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}
