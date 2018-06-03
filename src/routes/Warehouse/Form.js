import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import AutoFocus from 'components/AutoFocus';
import Pinyin from 'components/Pinyin';

const FormItem = Form.Item;

@connect(({ warehouse, loading }) => ({
  warehouse,
  submitting: loading.effects['warehouse/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { warehouse: { formData } } = props;

    return {
      name: Form.createFormField({
        value: formData.name,
      }),
      pinyin: Form.createFormField({
        value: formData.pinyin,
      }),
      linkman: Form.createFormField({
        value: formData.linkman,
      }),
      telephone: Form.createFormField({
        value: formData.telephone,
      }),
      zipCode: Form.createFormField({
        value: formData.zipCode,
      }),
      addressId: Form.createFormField({
        value: formData.addressId,
      }),
      shippingAddress: Form.createFormField({
        value: formData.shippingAddress,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, warehouse: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'warehouse/saveForm',
      payload,
    });
  },
})
export default class BusinessRelatedUnitForm extends PureComponent {
  handleOk = () => {
    const {
      form,
      onSaveSuccess,
      handleModalVisible,
      dispatch,
      warehouse: { formData },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'warehouse/save',
        payload: {
          ...formData,
          ...fieldsValue,
          id: formData.id,
          type: 'VENDOR',
        },
      }).then(() => {
        handleModalVisible();
        onSaveSuccess();
      });
    });
  };

  handleRemove = () => {
    const {
      onSaveSuccess,
      handleModalVisible,
      dispatch,
      warehouse: { formData },
    } = this.props;
    dispatch({
      type: 'warehouse/remove',
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
    const {
      warehouse: { formData },
      modalVisible,
      form: { getFieldDecorator, setFieldsValue },
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
        title="仓库维护"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
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
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(
            <Pinyin onPinyinChange={pinyin => setFieldsValue({ pinyin })}>
              <AutoFocus focus={modalVisible}>
                <Input placeholder="请输入仓库的名字" />
              </AutoFocus>
            </Pinyin>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="拼音码" extra="拼音码可以帮助您快捷搜索">
          {getFieldDecorator('pinyin')(
            <Input style={{ width: 200 }} placeholder="请输入仓库的拼音码" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('linkman')(
            <Input style={{ width: 200 }} placeholder="请输入仓库的联系人" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="电话">
          {getFieldDecorator('telephone')(
            <Input style={{ width: 200 }} placeholder="请输入联系人的电话" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="邮政编码">
          {getFieldDecorator('zipCode')(
            <Input style={{ width: 200 }} placeholder="请输入收货地址的邮政编码" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="电子邮件">
          {getFieldDecorator('email')(
            <Input style={{ width: 200 }} placeholder="请输入联系人的电子邮件" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          {getFieldDecorator('addressId')(<Input placeholder="请输入供应商的地址" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="发货地址">
          {getFieldDecorator('shippingAddress')(<Input placeholder="请输入仓库的发货地址" />)}
        </FormItem>
      </Modal>
    );
  }
}
