import React, { Component } from 'react';

import { connect } from 'dva/index';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import GoodsSelector from '../Goods/GoodsSelector';
import GoodsSkuSelector from '../Goods/sku/GoodsSkuSelector';
import { PinnedData, EditableRow } from '../../components/ExtendedTable';

import styles from './Skus.less';

const ExtendedTable = EditableRow()(PinnedData()(Table));

@connect(({ goods }) => ({
  goods,
}))
export default class GoodsTypeSelector extends Component {
  static propTypes = {
    businessRelatedUnitId: PropTypes.string,
  };

  static defaultProps = {
    businessRelatedUnitId: null,
  };

  state = {
    value: [],
    modalVisible: false,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value: this.mergeCell(value) });
    }
  }

  onGoodsSkuSelected = goodsSkus => {
    const { value = [] } = this.state;

    const matchedRows = value.filter(row1 => goodsSkus.some(row2 => row2.skuId === row1.skuId));
    const restRows = goodsSkus.filter(row1 => matchedRows.every(row2 => row2.skuId !== row1.skuId));
    const increaseCountAndSumPrice = rows => {
      rows.forEach(row => {
        const tempSku = goodsSkus.find(sku => sku.skuId === row.skuId);
        return Object.assign(row, {
            count: row.count + tempSku.count,
            sumPrice: row.sumPrice + tempSku.count * tempSku.price,
        });
      });
    };
    const appendNewSkus = rows => {
      value.push(
        ...rows.map((goodsSku, index) =>
          Object.assign(goodsSku, {
            goods: Object.assign({}, goodsSku.goods, { rowSpan: index === 0 ? rows.length : 0 }),
          })
        )
      );
    };
    const filter = result => [...result.filter(row => row.count > 0)];

    increaseCountAndSumPrice(matchedRows);
    appendNewSkus(restRows);
    this.triggerChange(filter(value));
  };

  onSelectGoods = goodsId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchOne',
      payload: { id: goodsId },
    });
    this.setState({ modalVisible: true });
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  mergeCell = result => {
    let lastGoodsId;
    if (!result) {
      return result;
    }
    return result.sort((row1, row2) => (row1.goodsId === row2.goodsId ? 0 : -1)).map(row => {
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const { businessRelatedUnitId } = this.props;
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
        align: 'right',
        editor: {
          type: 'number',
          size: 'small',
          onChange: (val, record) => {
            const newRecord = record;
            newRecord.sumPrice = newRecord.count * (val || 0);
          },
        },
      },
      {
        title: '数量',
        dataIndex: 'count',
        width: 130,
        align: 'right',
        editor: {
          type: 'number',
          size: 'small',
          onChange: (val, record) => {
            const newRecord = record;
            newRecord.sumPrice = (val || 0) * newRecord.price;
          },
        },
      },
      {
        title: '金额',
        dataIndex: 'sumPrice',
        width: 130,
        align: 'right',
        editor: {
          type: 'number',
          size: 'small',
        },
      },
    ];

    const parentMethods = {
      onOk: this.onGoodsSkuSelected,
      handleModalVisible: this.handleModalVisible,
      onCancel: this.handleModalVisible,
    };

    const pinnedBottomData = [
      { 'goods.name': `合计：` },
      { price: `￥${value ? value.reduce((a, b) => a + b.price, 0) : 0}` },
      { count: `${value ? value.reduce((a, b) => a + b.count, 0) : 0}` },
      { sumPrice: `￥${value ? value.reduce((a, b) => a + b.sumPrice, 0) : 0}` },
    ];

    const onChange = (data) => {
      const result = this.mergeCell([...data]);
      this.setState(result);
      this.triggerChange(result);
    }

    return (
      <div className={styles.goodsSkus}>
        <ExtendedTable
          rowKey={row => row.skuId}
          dataSource={value}
          pagination={false}
          columns={columns}
          pinnedBottomData={pinnedBottomData}
          size="middle"
          onChange={onChange}
        />
        <GoodsSelector onChange={this.onSelectGoods} />
        <GoodsSkuSelector
          {...parentMethods}
          modalVisible={modalVisible}
          businessRelatedUnitId={businessRelatedUnitId}
        />
      </div>
    );
  }
}
