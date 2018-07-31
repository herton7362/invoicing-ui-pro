import React, { Component } from 'react';

import { Table } from 'antd';
import { PinnedData, EditableRow } from '../../components/ExtendedTable';

import styles from './Skus.less';

const ExtendedTable = EditableRow({deleteAble: false})(PinnedData()(Table));

export default class GoodsTypeSelector extends Component {
  state = {
    value: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value: this.mergeCell(value) });
    }
  }

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

  render() {
    const { value } = this.state;
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
        title: '待配送数量',
        dataIndex: 'needTransferCount',
        width: 130,
        align: 'right',
      },
      {
        title: '已配送数量',
        dataIndex: 'transferredCount',
        width: 130,
        align: 'right',
        editor: {
          type: 'number',
          size: 'small',
        },
      },
    ];

    const rowClassName = record => {
      if(record.transferredCount === 0) {
        return '';
      }
      if(record.needTransferCount !== record.transferredCount) {
        return styles.danger;
      }
      if(record.needTransferCount === record.transferredCount) {
        return styles.success;
      }
    }

    const pinnedBottomData = [
      { 'goods.name': `合计：` },
      { needTransferCount: value ? value.reduce((a, b) => a + b.needTransferCount, 0) : 0 },
      { transferredCount: value ? value.reduce((a, b) => a + b.transferredCount, 0) : 0 },
    ];

    const onChange = (data) => {
      const result = this.mergeCell([...data]);
      this.setState(result);
      this.triggerChange(result);
    }

    return (
      <div>
        <ExtendedTable
          rowKey={row => row.skuId}
          dataSource={value}
          pagination={false}
          columns={columns}
          rowClassName={rowClassName}
          pinnedBottomData={pinnedBottomData}
          size="middle"
          onChange={onChange}
        />
      </div>
    );
  }
}
