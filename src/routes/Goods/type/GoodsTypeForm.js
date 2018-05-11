import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import AutoFocus from 'components/AutoFocus';

const FormItem = Form.Item;

@connect(({ goodsType, loading }) => ({
  goodsType,
  submitting: loading.effects['goodsType/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { goodsType: { formData } } = props;

    return {
      name: Form.createFormField({
        value: formData.name,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, goodsType: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'goodsType/saveForm',
      payload,
    });
  },
})
export default class GoodsTypeForm extends PureComponent {
  handleOk = () => {
    const {
      form,
      onSaveSuccess,
      handleModalVisible,
      dispatch,
      goodsType: { formData },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'goodsType/save',
        payload: {
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
      modalVisible,
      form: { getFieldDecorator },
      handleModalVisible,
      onCancel,
      submitting,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    return (
      <Modal
        title="商品类别维护"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        footer={[
          <Popconfirm key="delete" title="确定删除吗?" onConfirm={this.handleRemove}>
            <Button type="danger">删除</Button>
          </Popconfirm>,
          <Button key="cancel" onClick={() => onCancel()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={submitting} onClick={this.handleOk}>
            保存
          </Button>,
        ]}
      >
        <FormItem {...formItemLayout} label="类别名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入商品类别名称',
              },
            ],
          })(
            <AutoFocus focus={modalVisible}>
              <Input placeholder="给商品类别起个名字" />
            </AutoFocus>
          )}
        </FormItem>
      </Modal>
    );
  }
}
