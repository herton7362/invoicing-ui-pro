import React, { Component } from 'react';

import { InputNumber, Modal, Form, Button } from 'antd';
import { connect } from 'dva';

import AttributeCheckboxGroup from '../AttributeCheckboxGroup';
import GoodsSelector from '../GoodsSelector';
import GoodsSkuTable from './GoodsSkuTable';

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
  };

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
  };

  bootGoodsSkusData = goodsSkus => {
    return goodsSkus.map(goodsSku =>
      Object.assign(goodsSku, {
        price: goodsSku.price || goodsSku.lastPurchasePrice,
        count: goodsSku.count || 0,
        sumPrice: goodsSku.sumPrice || 0,
      })
    );
  };

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

  handleOk = () => {
    const {
      onOk,
      handleModalVisible,
      goodsTypeAttribute: { data: { list: goodsTypeAttributes = [] } },
      goods: { list },
    } = this.props;

    const { goodsId, goodsSkus } = this.state;
    const attributeNameFormat = sku =>
      goodsTypeAttributes.map(attr => `${attr.name}：${sku[attr.id]}`).join('，');
    const resultFormat = result =>
      result.map(sku =>
        Object.assign(sku, {
          goods: Object.assign({}, list.find(row => row.id === goodsId)),
          attributeName: attributeNameFormat(sku),
        })
      );

    onOk(resultFormat(goodsSkus));
    this.clearSelected();
    handleModalVisible();
  };

  clearSelected = callback => {
    this.setState({
      goodsId: undefined,
      goodsAttributes: [],
      goodsSkus: [],
    });
    if (callback) {
      callback();
    }
  };

  render() {
    const {
      modalVisible,
      goodsTypeAttribute: { data: { list: goodsTypeAttributes = [] } },
      handleModalVisible,
      onCancel,
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

    const columns = currentDataSource => [
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
              const dataSource = currentDataSource;
              dataSource[index].price = val;
              dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
              this.setState({ goodsSkus: dataSource });
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
            min={0}
            onChange={val => {
              const dataSource = currentDataSource;
              dataSource[index].count = val;
              dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
              this.setState({ goodsSkus: dataSource });
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
              const dataSource = currentDataSource;
              dataSource[index].sumPrice = val;
              this.setState({ goodsSkus: dataSource });
            }}
            style={{ width: '100px' }}
          />
        ),
      },
    ];

    return (
      <Modal
        title="商品选择"
        visible={modalVisible}
        width={960}
        onCancel={() => this.clearSelected(handleModalVisible)}
        footer={[
          <Button key="cancel" onClick={() => this.clearSelected(onCancel)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            保存
          </Button>,
        ]}
      >
        <FormItem {...formItemLayout} label="商品">
          <GoodsSelector value={goodsId} onChange={this.onSelectGoods} style={{ width: '250px' }} />
        </FormItem>
        <AttributeCheckboxGroup
          {...formItemLayout}
          value={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          onChange={changedValue => this.setState({ goodsAttributes: changedValue })}
        />
        <GoodsSkuTable
          value={goodsSkus}
          goodsAttributes={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          valueChangeFilter={this.bootGoodsSkusData}
          columns={columns}
          style={{ padding: '0 30px' }}
          size="small"
          pagination={false}
        />
      </Modal>
    );
  }
}
