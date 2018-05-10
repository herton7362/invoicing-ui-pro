import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { Card, Form, Button, Input, InputNumber, Popover, Icon  } from 'antd';
import Pinyin from 'components/Pinyin';
import FooterToolbar from 'components/FooterToolbar';
import numeral from 'numeral';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CategorySelector from './category/CategorySelector';
import GoodsTypeSelector from './type/GoodsTypeSelector';

import styles from './Form.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const fieldLabels = {
  goodsCategoryId: '内部分类',
  name: '商品名称',
};

@connect(({ goods, goodsCategory, loading }) => ({
  goods,
  goodsCategory,
  fetchingGoodsCategory: loading.effects['goodsCategory/fetch'],
  submitting: loading.effects['goods/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { goods: { formData } } = props;
    return {
      goodsCategoryId: Form.createFormField({
        value: formData.goodsCategoryId,
      }),
      barcode: Form.createFormField({
        value: formData.barcode,
      }),
      name: Form.createFormField({
        value: formData.name,
      }),
      pinyin: Form.createFormField({
        value: formData.pinyin,
      }),
      remark: Form.createFormField({
        value: formData.remark,
      }),
      costPrice: Form.createFormField({
        value: formData.costPrice,
      }),
      goodsTypeId: Form.createFormField({
        value: formData.goodsTypeId,
      }),
      weight: Form.createFormField({
        value: formData.weight,
      }),
      length: Form.createFormField({
        value: formData.length,
      }),
      width: Form.createFormField({
        value: formData.width,
      }),
      height: Form.createFormField({
        value: formData.height,
      }),
    };
  },
})
export default class GoodsForm extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, goods: { formData } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'goods/save',
        payload: {
          ...formData,
          ...fieldsValue,
        },
      }).then(() => {
        this.handleGoBack();
      });
    });
  };

  handleGoBack = () => {
    this.props.dispatch(routerRedux.push('/goods/list'));
  };

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, setFieldsValue, getFieldsError } = this.props.form;

    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };

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

    return (
      <PageHeaderLayout>
        <div>
          <Form>
            <Card style={{ marginTop: 8 }} bordered={false} title="通用信息">
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
                })(<CategorySelector style={{ width: 300 }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="条形码">
                {getFieldDecorator('barcode')(
                  <Input style={{ width: 200 }} placeholder="请输入商品的条形码" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="商品名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商品名称',
                    },
                  ],
                })(
                  <Pinyin onPinyinChange={pinyin => setFieldsValue({ pinyin })}>
                    <Input placeholder="请输入商品的名称" />
                  </Pinyin>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="拼音码" extra="拼音码可以帮助您快捷搜索">
                {getFieldDecorator('pinyin')(<Input placeholder="请输入商品的拼音码" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="商品简单描述">
                {getFieldDecorator('remark')(
                  <TextArea style={{ minHeight: 32 }} placeholder="请描述一下这个商品" rows={4} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="成本价">
                {getFieldDecorator('costPrice')(
                  <InputNumber formatter={val => `￥ ${numeral(val).format('0,0.0')}`} style={{ width: 200 }} placeholder="请输入商品的成本价" />
                )}
              </FormItem>
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="商品属性">
              <FormItem {...formItemLayout} label="商品类型">
                {getFieldDecorator('goodsTypeId')(<GoodsTypeSelector style={{ width: 300 }} />)}
              </FormItem>
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="库存信息">
              <FormItem {...formItemLayout} label="重量">
                {getFieldDecorator('weight')(
                  <InputNumber formatter={val => `kg ${numeral(val).format('0,0.0')}`} style={{ width: 200 }} placeholder="请输入商品的重量" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="长度">
                {getFieldDecorator('length')(
                  <InputNumber formatter={val => `cm ${numeral(val).format('0,0.0')}`} style={{ width: 200 }} placeholder="请输入商品的长度" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="宽度">
                {getFieldDecorator('width')(
                  <InputNumber formatter={val => `cm ${numeral(val).format('0,0.0')}`} style={{ width: 200 }} placeholder="请输入商品的宽度" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="高度">
                {getFieldDecorator('height')(
                  <InputNumber formatter={val => `cm ${numeral(val).format('0,0.0')}`} style={{ width: 200 }} placeholder="请输入商品的高度" />
                )}
              </FormItem>
            </Card>

            <FooterToolbar style={{ width: this.state.width }}>
              {getErrorInfo()}
              <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
                提交
              </Button>
              <Button icon="left" style={{ marginLeft: 8 }} onClick={this.handleGoBack}>
                返回
              </Button>
            </FooterToolbar>
          </Form>
        </div>
      </PageHeaderLayout>
    );
  }
}
