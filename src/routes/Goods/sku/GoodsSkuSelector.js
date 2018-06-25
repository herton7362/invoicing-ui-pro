import React, { Component } from 'react';

import { Table, InputNumber, Modal, Form } from 'antd';
import { connect } from "dva";

import AttributeCheckboxGroup from '../AttributeCheckboxGroup';
import GoodsSelector from '../GoodsSelector';
import GoodsSkuProducer from './GoodsSkuProducer';

const FormItem = Form.Item;

@connect(({ goods, goodsTypeAttribute }) => ({
  goods,
  goodsTypeAttribute,
}))
@Form.create()
export default class GoodsSkus extends Component {
  state = {
    goodsId: undefined,
    goodsAttributes: [],
    goodsSkus: [],
  }

  onSelectGoods = goodsId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchOne',
      payload: { id: goodsId },
      callback: response => {
        this.setState({
          goodsId,
          goodsAttributes: response.goodsAttributes,
          goodsSkus: response.goodsSkus,
        });
        this.handleLoadAttributes(response.goodsTypeId);
      },
    });
  }

  bootGoodsSkusData = goodsSkus => {
    return goodsSkus.map(goodsSku => Object.assign(goodsSku, {
      price: goodsSku.lastPurchasePrice,
      count: 0,
      sumPrice: 0,
    }))
  }

  handleLoadAttributes = goodsTypeId => {
    const { dispatch } = this.props;
    if (goodsTypeId) {
      dispatch({
        type: 'goodsTypeAttribute/fetch',
        payload: {
          goodsTypeId,
          logicallyDeleted: 0,
          sort: 'sortNumber',
          order: 'asc',
        },
      });
    } else {
      dispatch({
        type: 'goodsTypeAttribute/queryList',
        payload: {},
      });
    }
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    this.setState({goodsSkus: changedValue});
    if (onChange) onChange(changedValue);
  };

  render() {
    const {
      modalVisible,
      goodsTypeAttribute: { data: { list: goodsTypeAttributes = [] } },
    } = this.props;

    const { goodsId, goodsAttributes, goodsSkus } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    return (
      <Modal
        title="商品选择"
        visible={modalVisible}
        width={960}
      >
        <FormItem {...formItemLayout} label="商品">
          <GoodsSelector
            value={goodsId}
            onChange={this.onSelectGoods}
            style={{ width: '250px' }}
          />
        </FormItem>
        <AttributeCheckboxGroup
          {...formItemLayout}
          value={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          onChange={changedValue => this.setState({goodsAttributes: changedValue})}
        />
        <GoodsSkuProducer
          value={goodsSkus}
          goodsAttributes={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          valueChangeFilter={this.bootGoodsSkusData}
          columns={currentDataSource => {
            const dataSource = currentDataSource;

            return [
              {
                title: '条码',
                dataIndex: 'barcode',
                align: 'center',
              },
              {
                title: '库存数量',
                dataIndex: 'stockNumber',
                align: 'center',
              },
              {
                title: '单价',
                dataIndex: 'price',
                align: 'center',
                render: (rowValue, record, index) => (
                  <InputNumber
                    size="small"
                    value={rowValue}
                    onChange={val => {
                      dataSource[index].price = val;
                      dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
                      this.triggerChange(dataSource);
                    }}
                    style={{ width: '100px' }}
                  />
                ),
              },
              {
                title: '数量',
                dataIndex: 'count',
                align: 'center',
                render: (rowValue, record, index) => (
                  <InputNumber
                    size="small"
                    value={rowValue}
                    onChange={val => {
                      dataSource[index].count = val;
                      dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
                      this.triggerChange(dataSource);
                    }}
                    style={{ width: '100px' }}
                  />
                ),
              },
              {
                title: '金额',
                dataIndex: 'sumPrice',
                align: 'center',
                render: (rowValue, record, index) => (
                  <InputNumber
                    size="small"
                    value={rowValue}
                    onChange={val => {
                      dataSource[index].sumPrice = val;
                      this.triggerChange(dataSource);
                    }}
                    style={{ width: '100px' }}
                  />
                ),
              },
            ];
          }}
          style={{padding: '0 30px'}}
        >
          <Table size="small" pagination={false} />
        </GoodsSkuProducer>
      </Modal>
    );
  }
}
