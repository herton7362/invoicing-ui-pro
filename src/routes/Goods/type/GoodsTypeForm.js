import React, { PureComponent } from 'react';

import { connect } from "dva/index";
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

@connect(({ goodsType }) => ({
  goodsType,
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
})
export default class GoodsTypeForm extends PureComponent {
  focusTextInput = element => {
    // Focus the text input using the raw DOM API
    setTimeout(() => {
      if (element.input) element.input.focus()
    }, 500);
  };

  okHandle = () => {
    const {
      form,
      onSaveSuccess,
      handleModalVisible,
      dispatch,
      formData,
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
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
      >
        <FormItem {...formItemLayout} label="类别名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入商品类别名称',
              },
            ],
          })(<Input ref={this.focusTextInput} placeholder="给商品类别起个名字" />)}
        </FormItem>
      </Modal>
    );
  }
}
