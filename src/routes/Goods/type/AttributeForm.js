import React, { PureComponent } from 'react';

import { Modal, Form, Input } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ goodsAttribute }) => ({
  goodsAttribute,
}))
@Form.create({
  mapPropsToFields(props) {
    const { goodsAttribute: { formData } } = props;
    return {
      name: Form.createFormField({
        value: formData.name,
      }),
      attrValues: Form.createFormField({
        value: formData.attrValues ? formData.attrValues.replace(/,/g, '\n') : null,
      }),
    };
  },
})
export default class GoodsTypeForm extends PureComponent {
  focusTextInput = element => {
    // Focus the text input using the raw DOM API
    setTimeout(() => {
      if (element.input) element.input.focus();
    }, 200);
  };

  okHandle = () => {
    const {
      form,
      onSaveSuccess,
      handleAttrModalVisible,
      dispatch,
      goodsAttribute: { formData },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'goodsAttribute/save',
        payload: {
          ...formData,
          ...fieldsValue,
          attrValues: fieldsValue.attrValues
            .trim()
            .replace(/\n+/g, '\n')
            .replace(/\n/g, ','),
        },
      }).then(() => {
        handleAttrModalVisible();
        onSaveSuccess();
      });
    });
  };

  render() {
    const { modalVisible, form: { getFieldDecorator }, handleAttrModalVisible } = this.props;

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
        title="属性维护"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleAttrModalVisible()}
      >
        <FormItem {...formItemLayout} label="属性名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入属性名称',
              },
            ],
          })(<Input ref={this.focusTextInput} placeholder="给属性起个名字" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="可选值列表"
          help="从上面的列表中选择（一行代表一个可选值）"
        >
          {getFieldDecorator('attrValues', {
            rules: [
              {
                required: true,
                message: '请输入可选值列表',
              },
            ],
          })(<TextArea style={{ minHeight: 32 }} rows={6} />)}
        </FormItem>
      </Modal>
    );
  }
}
