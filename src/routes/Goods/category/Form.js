import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import AutoFocus from 'components/AutoFocus';
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
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, goodsCategory: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'goodsCategory/saveForm',
      payload,
    });
  },
})
export default class GoodsCategoryForm extends PureComponent {
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
    const { modalVisible, form: { getFieldDecorator }, onCancel, submitting, goodsCategory: { formData } } = this.props;

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
          formData.id && (
            <Popconfirm key="delete" title="确定删除吗?" onConfirm={this.handleRemove}>
              <Button type="danger">删除</Button>
            </Popconfirm>
          ),
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
          })(
            <AutoFocus focus={modalVisible}>
              <Input placeholder="给商品分类起个名字" />
            </AutoFocus>
          )}
        </FormItem>
      </Modal>
    );
  }
}
