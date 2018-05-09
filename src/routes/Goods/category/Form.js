import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import CategorySelector from './CategorySelector';

const FormItem = Form.Item;

@connect(({ goodsCategory, loading }) => ({
  goodsCategory,
  submitting: loading.effects['goodsCategory/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { goodsCategory: { formData } } = props;
    return {
      name: Form.createFormField({
        value: formData.name,
      }),
      parentId: Form.createFormField({
        value: formData.parentId,
      }),
    };
  },
})
export default class GoodsCategoryForm extends PureComponent {
  focusTextInput = element => {
    // Focus the text input using the raw DOM API
    setTimeout(() => {
      if (element.input) element.input.focus();
    }, 200);
  };

  handleOk = () => {
    const {
      form,
      onSaveSuccess,
      handleModalVisible,
      dispatch,
      goodsCategory: { formData },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'goodsCategory/save',
        payload: {
          ...formData,
          ...fieldsValue,
        },
        callback: response => {
          handleModalVisible();
          onSaveSuccess(response);
        },
      });
    });
  };

  handleRemove = () => {
    const { onSaveSuccess, handleModalVisible, dispatch, goodsCategory: { formData } } = this.props;
    dispatch({
      type: 'goodsCategory/remove',
      payload: {
        id: formData.id,
      },
      callback: () => {
        handleModalVisible();
        onSaveSuccess();
      },
    });
  };

  render() {
    const { modalVisible, form: { getFieldDecorator }, onCancel, submitting } = this.props;

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
        title="商品分类维护"
        visible={modalVisible}
        onCancel={onCancel}
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
        <FormItem {...formItemLayout} label="上级类别" extra="没有上级分类可以留空">
          {getFieldDecorator('parentId')(<CategorySelector allowClear showHandler={false} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="分类名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入商品分类名称',
              },
            ],
          })(<Input ref={this.focusTextInput} placeholder="给商品分类起个名字" />)}
        </FormItem>
      </Modal>
    );
  }
}
