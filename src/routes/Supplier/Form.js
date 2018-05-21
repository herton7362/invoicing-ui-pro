import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import AutoFocus from 'components/AutoFocus';
import Pinyin from 'components/Pinyin';

const FormItem = Form.Item;

@connect(({ businessRelatedUnit, loading }) => ({
  businessRelatedUnit,
  submitting: loading.effects['businessRelatedUnit/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { businessRelatedUnit: { formData } } = props;

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
      mobile: Form.createFormField({
        value: formData.mobile,
      }),
      email: Form.createFormField({
        value: formData.email,
      }),
      detailAddress: Form.createFormField({
        value: formData.detailAddress,
      }),
      depositBank: Form.createFormField({
        value: formData.depositBank,
      }),
      bankAccount: Form.createFormField({
        value: formData.bankAccount,
      }),
      remark: Form.createFormField({
        value: formData.remark,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, businessRelatedUnit: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'businessRelatedUnit/saveForm',
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
      businessRelatedUnit: { formData },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'businessRelatedUnit/save',
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
    const { onSaveSuccess, handleModalVisible, dispatch, businessRelatedUnit: { formData } } = this.props;
    dispatch({
      type: 'businessRelatedUnit/remove',
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
      businessRelatedUnit: { formData },
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
        title="供应商维护"
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
                <Input placeholder="请输入供应商的名字" />
              </AutoFocus>
            </Pinyin>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="拼音码" extra="拼音码可以帮助您快捷搜索">
          {getFieldDecorator('pinyin')(
            <Input style={{ width: 200 }} placeholder="请输入供应商的拼音码" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator('linkman')(
            <Input style={{ width: 200 }} placeholder="请输入供应商的联系人" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="电话">
          {getFieldDecorator('telephone')(
            <Input style={{ width: 200 }} placeholder="请输入联系人的电话" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="手机">
          {getFieldDecorator('mobile')(
            <Input style={{ width: 200 }} placeholder="请输入联系人的手机" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="电子邮件">
          {getFieldDecorator('email')(
            <Input style={{ width: 200 }} placeholder="请输入联系人的电子邮件" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          {getFieldDecorator('detailAddress')(
            <Input placeholder="请输入供应商的地址" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="开户银行">
          {getFieldDecorator('depositBank')(
            <Input placeholder="请输入供应商的开户银行" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="银行账号">
          {getFieldDecorator('bankAccount')(
            <Input placeholder="请输入供应商的银行账号" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('remark')(
            <Input placeholder="请输入备注" />
          )}
        </FormItem>
      </Modal>
    );
  }
}
