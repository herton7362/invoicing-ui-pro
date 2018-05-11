import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Modal, Form, Input } from 'antd';
import AutoFocus from 'components/AutoFocus';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ goodsTypeAttribute }) => ({
  goodsTypeAttribute,
}))
@Form.create({
  mapPropsToFields(props) {
    const { goodsTypeAttribute: { formData } } = props;
    return {
      name: Form.createFormField({
        value: formData.name,
      }),
      attrValues: Form.createFormField({
        value: formData.attrValues ? formData.attrValues.replace(/,/g, '\n') : null,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, goodsTypeAttribute: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'goodsTypeAttribute/saveForm',
      payload,
    });
  },
})
export default class GoodsTypeForm extends PureComponent {
  okHandle = () => {
    const {
      form,
      onSaveSuccess,
      handleAttrModalVisible,
      dispatch,
      goodsTypeAttribute: { formData },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'goodsTypeAttribute/save',
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
          })(
            <AutoFocus focus={modalVisible}>
              <Input placeholder="给属性起个名字" />
            </AutoFocus>
          )}
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
