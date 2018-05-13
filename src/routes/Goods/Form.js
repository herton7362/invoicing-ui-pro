import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { Card, Form, Button, Input, InputNumber, Popover, Icon, Checkbox } from 'antd';
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

@connect(({ goods, goodsCategory, goodsTypeAttribute, loading }) => ({
  goods,
  goodsCategory,
  goodsTypeAttribute,
  fetchingGoodsCategory: loading.effects['goodsCategory/fetch'],
  submitting: loading.effects['goods/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { goods: { formData: { goodsAttributes }, formData } } = props;
    const extra = {};

    if(goodsAttributes)
      goodsAttributes.forEach((attr, index) => {
        if(attr)
          extra[`goodsAttributes[${index}]`] = Form.createFormField({
            value: {
              goodsTypeAttributeValue: attr.goodsTypeAttributeValue,
              goodsTypeAttributeId: attr.goodsTypeAttributeId,
            },
          });
      })

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
        value: formData.costPrice || 0,
      }),
      stockNumber: Form.createFormField({
        value: formData.stockNumber || 0,
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
      ...extra,
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
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { goods: { formData } } = this.props;
    if (formData.goodsTypeId) this.handleLoadAttributes(formData.goodsTypeId);
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

  handleLoadAttributes = goodsTypeId => {
    const { dispatch } = this.props;
    if(goodsTypeId) {
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

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  render() {
    const {
      submitting,
      goods: { formData },
      goodsTypeAttribute: { data: { list: goodsTypeAttributeList } },
    } = this.props;
    const { getFieldDecorator, setFieldsValue, getFieldValue, getFieldsError } = this.props.form;

    const errors = getFieldsError();

    const getErrorInfo = () => {
      const excludeKey = ['goodsAttributes'];
      const errorCount = Object.keys(errors).filter(key => errors[key] && !excludeKey.includes(key))
        .length;
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
        if (!errors[key] || excludeKey.includes(key)) {
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

    const renderGoodsAttributes = (attrs) => {
      const isChecked = (key, value) => {
        return getFieldValue(key)
          && value.val === getFieldValue(key).goodsTypeAttributeValue
          && value.attrId === getFieldValue(key).goodsTypeAttributeId;
      }
      const setValue = (checked, key, value) => {
        if(checked) {
          setFieldsValue({
            [key]: {
              goodsTypeAttributeValue: value.val,
              goodsTypeAttributeId: value.attrId,
            },
          });
        } else {
          setFieldsValue({[key]: null});
        }
      }
      return attrs.map((attr, attrIndex) => (
        <FormItem key={attr.id} {...formItemLayout} label={attr.name}>
          {
            attr.attrValues
              .split(',')
              .map((val, vaIndex) => {
                let lastAttrValuesLength = 0;
                if(attrIndex > 0) {
                  lastAttrValuesLength = goodsTypeAttributeList[attrIndex - 1].attrValues.split(',').length;
                }
                const key = `goodsAttributes[${lastAttrValuesLength + vaIndex}]`;
                return (
                  <Checkbox
                    key={`${attr.id}_${val}`}
                    checked={isChecked(key, {val, attrId: attr.id})}
                    onChange={e => setValue(e.target.checked, key, {val, attrId: attr.id})}
                  >
                    { val }
                  </Checkbox>
                )
              })}
        </FormItem>
      ))
    }

    const test = () => {
      const a = formData.goodsAttributes && formData.goodsAttributes.filter(v=>v);
      const result = {};
      a && a.forEach(item => {
        result[item.goodsTypeAttributeId] = result[item.goodsTypeAttributeId] || [];
        result[item.goodsTypeAttributeId].push(item.goodsTypeAttributeValue);
      });
      const aa = [];
      Object.keys(result).forEach(key => {
        aa.push(result[key].length);
      });

      const MyMatrix = (props) => {
        const length = props.reduce((x,y) => x * y);
        const matrix = new Array(length).fill([]);
        const row = MyArray(props);
        return matrix.map(() => row.next());
      };

      const MyArray = (props) => {
        const numbers = [];
        props.forEach(p => {
          numbers.push(new MyNumber(p));
        });

        const isLast = (index) => {
          return index >= props.length - 1;
        };

        const next = (index = 0) => {
          if(numbers[index].next()) {
            if(isLast(index)) {
              next();
            } else {
              next(index + 1);
            }
          }
        };

        return {
          next: () => {
            const result = numbers.map(num => num.get());
            next();
            return result;
          },
        };
      };

      const MyNumber = (length) => {
        let num = 0;

        const isLast = () => {
          return num >= length - 1;
        };

        return {
          next: () => {
            if(isLast()) {
              num = 0;
              return true;
            } else {
              num += 1;
              return false;
            }
          },
          get: () => num,
        }
      };

      if(aa.length > 1)
        console.log(MyMatrix(aa));

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
                  <InputNumber
                    formatter={val => `￥ ${numeral(val).format('0,0.0')}`}
                    style={{ width: 200 }}
                    placeholder="请输入商品的成本价"
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="库存数量" extra="如果没有sku则以当前数量为准">
                {getFieldDecorator('stockNumber')(
                  <InputNumber
                    style={{ width: 200 }}
                    placeholder="请输入商品的库存数量"
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
              {goodsTypeAttributeList.length > 0 && renderGoodsAttributes(goodsTypeAttributeList)}
              {
                test()
              }
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="库存信息">
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
