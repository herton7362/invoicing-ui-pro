import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { Card, Form, Button, Input, InputNumber, message } from 'antd';
import Pinyin from 'components/Pinyin';
import FooterToolbar from 'components/FooterToolbar';
import numeral from 'numeral';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CategorySelector from './category/CategorySelector';
import GoodsTypeSelector from './type/GoodsTypeSelector';
import GoodsSkus from './sku/GoodsSkus';
import Cover from './Cover';
import AttributeCheckboxGroup from './AttributeCheckboxGroup';
import SupplierSelectTable from './SupplierSelectTable';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ goods, goodsTypeAttribute, loading }) => ({
  goods,
  goodsTypeAttribute,
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
      coverImageId: Form.createFormField({
        value: formData.coverImageId,
      }),
      costPrice: Form.createFormField({
        value: formData.costPrice || 0,
      }),
      retailPrice: Form.createFormField({
        value: formData.retailPrice || 0,
      }),
      stockNumber: Form.createFormField({
        value: formData.stockNumber || 0,
      }),
      stockWarnNumber: Form.createFormField({
        value: formData.stockWarnNumber || 0,
      }),
      goodsTypeId: Form.createFormField({
        value: formData.goodsTypeId,
      }),
      weight: Form.createFormField({
        value: formData.weight || 0,
      }),
      length: Form.createFormField({
        value: formData.length || 0,
      }),
      width: Form.createFormField({
        value: formData.width || 0,
      }),
      height: Form.createFormField({
        value: formData.height || 0,
      }),
      goodsSkus: Form.createFormField({
        value: formData.goodsSkus,
      }),
      goodsAttributes: Form.createFormField({
        value: formData.goodsAttributes,
      }),
      goodsSuppliers: Form.createFormField({
        value: formData.goodsSuppliers,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, goods: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'goods/saveForm',
      payload,
    });
  },
})
export default class GoodsForm extends PureComponent {
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id) {
      dispatch({
        type: 'goods/fetchOne',
        payload: { id },
        callback: response => {
          this.handleLoadAttributes(response.goodsTypeId);
        },
      });
    } else {
      dispatch({
        type: 'goods/saveForm',
        payload: {},
      });
      this.handleLoadAttributes();
    }
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
        message.success('保存成功');
        this.handleGoBack();
      });
    });
  };

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  };

  handleLoadAttributes = goodsTypeId => {
    const { dispatch } = this.props;
    if (goodsTypeId) {
      dispatch({
        type: 'goodsTypeAttribute/fetch',
        payload: {
          goodsTypeId,
          logicallyDeleted: 0,
          sort: 'sortNumber',
          order: 'asc',
        },
      });
    } else {
      dispatch({
        type: 'goodsTypeAttribute/queryList',
        payload: {},
      });
    }
    return goodsTypeId;
  };

  render() {
    const {
      submitting,
      goods: { formData },
      goodsTypeAttribute: { data: { list: goodsTypeAttributes = [] } },
      form: { getFieldDecorator, setFieldsValue, getFieldsError },
    } = this.props;

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

    const fieldLabels = {
      goodsCategoryId: '内部分类',
      name: '商品名称',
    };

    const excludeKeys = ['goodsAttributes']

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
                {getFieldDecorator('pinyin')(
                  <Input style={{ width: 200 }} placeholder="请输入商品的拼音码" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="商品简单描述">
                {getFieldDecorator('remark')(
                  <TextArea style={{ minHeight: 32 }} placeholder="请描述一下这个商品" rows={4} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="商品封面">
                {getFieldDecorator('coverImageId')(<Cover />)}
              </FormItem>
              <FormItem {...formItemLayout} label="成本价">
                {getFieldDecorator('costPrice')(
                  <InputNumber
                    formatter={val => `￥ ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的成本价"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="零售价">
                {getFieldDecorator('retailPrice')(
                  <InputNumber
                    formatter={val => `￥ ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的零售价"
                  />
                )}
              </FormItem>
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="商品属性">
              <FormItem {...formItemLayout} label="商品类型">
                {getFieldDecorator('goodsTypeId', {
                  getValueFromEvent: this.handleLoadAttributes,
                })(<GoodsTypeSelector style={{ width: 300 }} />)}
              </FormItem>
              {getFieldDecorator('goodsAttributes')(
                <AttributeCheckboxGroup
                  {...formItemLayout}
                  goodsTypeAttributes={goodsTypeAttributes}
                />
              )}
              <FormItem
                labelCol={{
                  xs: { span: 24 },
                  sm: { span: 3 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 21 },
                  md: { span: 19 },
                }}
                label="商品sku"
              >
                {getFieldDecorator('goodsSkus')(
                  <GoodsSkus
                    goodsAttributes={formData.goodsAttributes}
                    goodsTypeAttributes={goodsTypeAttributes}
                  />
                )}
              </FormItem>
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="库存信息">
              {!formData.goodsTypeId && (
                <FormItem {...formItemLayout} label="库存数量" extra="如果没有sku则以当前数量为准">
                  {getFieldDecorator('stockNumber', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商品库存数量',
                      },
                    ],
                  })(<InputNumber style={{ width: 200 }} placeholder="请输入商品的库存数量" />)}
                </FormItem>
              )}
              {!formData.goodsTypeId && (
                <FormItem
                  {...formItemLayout}
                  label="库存预警值"
                  extra="当库存少于或等于库存警告设置数量时，后台会跳出提醒，提醒管理员增加库存"
                >
                  {getFieldDecorator('stockWarnNumber', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商品库存预警值',
                      },
                    ],
                  })(<InputNumber style={{ width: 200 }} placeholder="请输入商品的库存预警值" />)}
                </FormItem>
              )}
              <FormItem
                labelCol={{
                  xs: { span: 24 },
                  sm: { span: 3 },
                }}
                wrapperCol={{
                  xs: { span: 24 },
                  sm: { span: 21 },
                  md: { span: 19 },
                }}
                label="供应商"
              >
                {getFieldDecorator('goodsSuppliers')(<SupplierSelectTable />)}
              </FormItem>
              <FormItem {...formItemLayout} label="重量">
                {getFieldDecorator('weight')(
                  <InputNumber
                    formatter={val => `kg ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的重量"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="长度">
                {getFieldDecorator('length')(
                  <InputNumber
                    formatter={val => `cm ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的长度"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="宽度">
                {getFieldDecorator('width')(
                  <InputNumber
                    formatter={val => `cm ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的宽度"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="高度">
                {getFieldDecorator('height')(
                  <InputNumber
                    formatter={val => `cm ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的高度"
                  />
                )}
              </FormItem>
            </Card>

            <FooterToolbar getFieldsError={getFieldsError} excludeKeys={excludeKeys} fieldLabels={fieldLabels}>
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
