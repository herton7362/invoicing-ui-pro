import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { InputNumber, Modal, Button } from 'antd';
import { connect } from 'dva';

import GoodsSkuTable from './GoodsSkuTable';

import styles from './GoodsSkuSelector.less';

@connect(({ goods, goodsTypeAttribute }) => ({
  goods,
  goodsTypeAttribute,
}))
export default class GoodsSkus extends Component {
  static defaultProps = {
    businessRelatedUnitId: null,
  };

  static propTypes = {
    businessRelatedUnitId: PropTypes.string,
  };

  constructor() {
    super();
    this.value = [];
  }

  state = {
    goods: undefined,
    goodsAttributes: [],
    goodsSkus: [],
  };

  componentWillReceiveProps(nextProps) {
    if ('goods' in nextProps) {
      const { goods = {} } = this.state;
      const { goods: { formData } } = nextProps;
      if (formData.id !== goods.id) {
        this.setState({
          goods: formData,
          goodsAttributes: formData.goodsAttributes,
          goodsSkus: formData.goodsSkus,
        });
        this.handleLoadAttributes(formData.goodsTypeId);
      }
    }
  }

  bootGoodsSkusData = goodsSkus => {
    const {
      businessRelatedUnitId,
      goodsTypeAttribute: { data: { list: goodsTypeAttributes = [] } },
    } = this.props;
    const { goods } = this.state;
    const attributeNameFormat = sku =>
      goodsTypeAttributes.map(attr => `${attr.name}：${sku[attr.id]}`).join('，');

    const goodsSupplier =
      goods &&
      goods.goodsSuppliers.find(
        supplier => supplier.businessRelatedUnitId === businessRelatedUnitId
      );

    return goodsSkus.map(goodsSku => {
      const price =
        goodsSku.price || (goodsSupplier && goodsSupplier.price) || goodsSku.lastPurchasePrice;
      const count = goodsSku.count || (goodsSupplier && goodsSupplier.minimumCount) || 0;

      return Object.assign(goodsSku, {
        id: null,
        goodsId: goods.id,
        goods: Object.assign(goods, { goodsSkus: null }),
        skuId: goodsSku.skuId || goodsSku.id,
        attributeName: attributeNameFormat(goodsSku),
        price,
        count,
        sumPrice: goodsSku.sumPrice || price * count || 0,
      });
    });
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

  triggerChange = changedValue => {
    this.value = changedValue;
  };

  handleOk = () => {
    const { onOk, handleModalVisible } = this.props;

    onOk(this.value);
    this.clearSelected();
    handleModalVisible();
  };

  clearSelected = callback => {
    this.setState({
      goods: undefined,
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

    const { goods = {}, goodsAttributes, goodsSkus } = this.state;

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
            min={0}
            onChange={val => {
              const dataSource = currentDataSource;
              dataSource[index].count = val;
              dataSource[index].sumPrice = dataSource[index].count * dataSource[index].price;
              this.setState({ goodsSkus: dataSource });
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
              const dataSource = currentDataSource;
              dataSource[index].sumPrice = val;
              this.setState({ goodsSkus: dataSource });
              this.triggerChange(dataSource);
            }}
            style={{ width: '100px' }}
          />
        ),
      },
    ];

    return (
      <Modal
        title={goods.name}
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
          className={styles.goodsSkuTable}
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
