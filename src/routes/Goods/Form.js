import React, { PureComponent } from 'react';
import { connect } from "dva/index";
import { routerRedux } from 'dva/router';
import { Card, Form, Button, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CategorySelector from './category/CategorySelector';

import styles from './Form.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ goods, goodsCategory, loading }) => ({
  goods,
  goodsCategory,
  fetchingGoodsCategory: loading.effects['goodsCategory/fetch'],
  submitting: loading.effects['goods/save'],
}))
@Form.create()
export default class GoodsForm extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      goods: { formData },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'goodsAttribute/save',
        payload: {
          ...formData,
          ...fieldsValue,
        },
      }).then(() => {
      });
    });
  };

  handleGoBack = () => {
    this.props.dispatch(routerRedux.push('/goods/list'));
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout>
        <div className={styles.goodsForm}>
          <Form style={{ marginTop: 8 }}>
            <Card bordered={false} title="通用信息">
              <FormItem
                {...formItemLayout}
                label="内部分类"
                extra="内部类别用于内部使用，与系统业务无关"
              >
                {getFieldDecorator('goodsCategoryId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择一个商品分类',
                    },
                  ],
                })(<CategorySelector style={{width: 300}} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="条形码">
                {getFieldDecorator('barcode')(<Input style={{ width: 200 }} placeholder="请输入商品的条形码" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="商品名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商品名称',
                    },
                  ],
                })(<Input placeholder="请输入商品的名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="商品简单描述">
                {getFieldDecorator('remark')(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请描述一下这个商品"
                    rows={4}
                  />
                )}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
                  提交
                </Button>
                <Button icon="left" style={{ marginLeft: 8 }} onClick={this.handleGoBack} >返回</Button>
              </FormItem>
            </Card>
          </Form>
        </div>
      </PageHeaderLayout>
    );
  }
}
