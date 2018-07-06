import React, { Component } from 'react';

import { InputNumber, Modal, Button } from 'antd';
import { connect } from 'dva';

import GoodsSkuTable from './GoodsSkuTable';

@connect(({ goods, goodsTypeAttribute }) => ({
  goods,
  goodsTypeAttribute,
}))
export default class GoodsSkus extends Component {
  state = {
    goodsId: undefined,
    goodsName: undefined,
    goodsAttributes: [],
    goodsSkus: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('goods' in nextProps) {
      const { goodsId } = this.state;
      const { goods: { formData } } = nextProps;
      if(formData.id !== goodsId) {
        this.setState({
          goodsId: formData.id,
          goodsName: formData.name,
          goodsAttributes: formData.goodsAttributes,
          goodsSkus: formData.goodsSkus,
        });
        this.handleLoadAttributes(formData.goodsTypeId);
      }
    }
  }

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
          id: null,
          goodsId,
          skuId: sku.id,
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

    const { goodsName, goodsAttributes, goodsSkus } = this.state;

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
        title={goodsName}
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
        <GoodsSkuTable
          value={goodsSkus}
          goodsAttributes={goodsAttributes}
          goodsTypeAttributes={goodsTypeAttributes}
          valueChangeFilter={this.bootGoodsSkusData}
          onChange={this.triggerChange}
          columns={columns}
          style={{ padding: '0 30px' }}
          size="small"
          pagination={false}
        />
      </Modal>
    );
  }
}
