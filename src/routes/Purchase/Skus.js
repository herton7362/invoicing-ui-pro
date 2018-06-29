import React, { Component, Fragment } from 'react';

import { Table, Popconfirm, message } from 'antd';
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

  onGoodsSkuSelected = (goods, goodsSkus) => {
    this.triggerChange(goodsSkus.map(goodsSku => Object.assign(goodsSku, {
      goods: Object.assign(goods, {rowSpan: goodsSkus.length}),
    })))
    message.success('保存成功');
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  handleAddRow = () => {
    this.setState({ modalVisible: true });
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
        title: '数量',
        dataIndex: 'count',
        width: 130,
        align: 'center',
      },
      {
        title: '单价',
        dataIndex: 'price',
        width: 130,
        align: 'center',
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

    const parentMethods = {
      onOk: this.onGoodsSkuSelected,
      handleModalVisible: this.handleModalVisible,
      onCancel: this.handleModalVisible,
    };

    return (
      <Fragment>
        <Table
          rowKey={row => row.id}
          dataSource={value}
          pagination={false}
          columns={columns}
          size="small"
        />
        <a onClick={this.handleAddRow}>添加商品</a>
        <GoodsSkuSelector {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}
