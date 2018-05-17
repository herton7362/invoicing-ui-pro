import React, { PureComponent } from 'react';

import {connect} from "dva/index";
import { Form, Modal } from 'antd';

import GoodsSkus from './GoodsSkus';

@connect(({ goods, goodsCategory, goodsTypeAttribute, loading }) => ({
  goods,
  goodsCategory,
  goodsTypeAttribute,
  submitting: loading.effects['goods/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { goods: { formData } } = props;

    return {
      goodsSkus: Form.createFormField({
        value: formData.goodsSkus,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, goods: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'goods/saveForm',
      payload,
    });
  },
})
export default class GoodsForm extends PureComponent {
  state = {
    visible: false,
  };

  componentWillReceiveProps(nextProps) {
    if ('visible' in nextProps && 'goodsId' in nextProps) {
      const { visible, goodsId } = nextProps;
      this.setState({ visible });
      if(visible)
        this.handleLoadGoods(goodsId);
    }
  }

  handleLoadGoods(goodsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/fetchOne',
      payload: { id: goodsId },
      callback: response => {
        dispatch({
          type: 'goodsTypeAttribute/fetch',
          payload: {
            goodsTypeId: response.goodsTypeId,
            logicallyDeleted: 0,
            sort: 'sortNumber',
            order: 'asc',
          },
        });
      },
    });
  }

  render() {
    const {
      goods: { formData: { goodsAttributes } },
      goodsTypeAttribute: { data: { list: goodsTypeAttributeList } },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    return (
      <Modal
        title="编辑商品货品信息"
        visible={visible}
        width={860}
        onOk={() => this.setState({visible: false})}
        onCancel={() => this.setState({visible: false})}
      >
        {goodsTypeAttributeList.length > 0 && getFieldDecorator('goodsSkus')(
          <GoodsSkus
            goodsTypeAttributes={goodsTypeAttributeList}
            goodsAttributes={goodsAttributes}
          />
        )}
      </Modal>
    );
  }
}
