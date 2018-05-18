import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Form, Modal, Button } from 'antd';

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
  handleOk = () => {
    const { form, onSaveSuccess, handleModalVisible, dispatch, goods: { formData } } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'goods/save',
        payload: {
          ...formData,
          ...fieldsValue,
          id: formData.id,
        },
      }).then(() => {
        handleModalVisible();
        onSaveSuccess();
      });
    });
  };

  render() {
    const {
      submitting,
      visible,
      handleModalVisible,
      goods: { formData: { goodsAttributes } },
      goodsTypeAttribute: { data: { list: goodsTypeAttributeList } },
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="编辑商品货品信息"
        visible={visible}
        width={860}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="cancel" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={submitting} onClick={this.handleOk}>
            保存
          </Button>,
        ]}
      >
        {getFieldDecorator('goodsSkus')(
          <GoodsSkus
            goodsTypeAttributes={goodsTypeAttributeList}
            goodsAttributes={goodsAttributes}
          />
        )}
      </Modal>
    );
  }
}
