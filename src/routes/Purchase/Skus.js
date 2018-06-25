import React, { Component, Fragment } from 'react';

import { Table, InputNumber, Popconfirm } from 'antd';
import GoodsSelector from '../Goods/GoodsSelector';
import AttributeTagSelector from '../Goods/type/AttributeTagSelector';
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

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  handleAddRow = () => {
    this.setState({ modalVisible: true });
  };

  handleSaveRow = (rowIndex, record) => {
    const { value = [] } = this.state;
    const list = value.map((val, i) => (i === rowIndex ? Object.assign(
      val,
      record
    ) : val));

    if (list[rowIndex].goodsId) {
      this.triggerChange(list);
    } else {
      this.setState({ value: list });
    }
  };

  handleRemove = index => {
    const { value = [] } = this.state;
    value.splice(index, 1);
    this.setState({ value });
  };

  render() {
    const { value, modalVisible } = this.state;
    const columns = [
      {
        title: '商品',
        dataIndex: 'goodsId',
        render: (val, record, index) => (
          <Fragment>
            <GoodsSelector
              size="small"
              value={val}
              onChange={v => this.handleSaveRow(index, { goodsId: v })}
            />
            <AttributeTagSelector style={{marginTop: '8px'}} />
          </Fragment>
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
            onChange={v => this.handleSaveRow(index, { count: v })}
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
            onChange={v => this.handleSaveRow(index, { price: v })}
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
        <a onClick={this.handleAddRow}>添加商品</a>
        <GoodsSkuSelector modalVisible={modalVisible} />
      </Fragment>
    );
  }
}
