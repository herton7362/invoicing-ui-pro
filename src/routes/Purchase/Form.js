import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { Card, Form, Button, Input, Popover, Icon } from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Form.less';

const FormItem = Form.Item;

const fieldLabels = {};

@connect(({ purchaseOrder, loading }) => ({
  purchaseOrder,
  submitting: loading.effects['purchaseOrder/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { purchaseOrder: { formData } } = props;

    return {
      operator: Form.createFormField({
        value: formData.operator,
      }),
    };
  },
  onValuesChange(props, changedValues, allValues) {
    const { dispatch, purchaseOrder: { formData } } = props;
    const payload = Object.assign(formData, allValues);

    dispatch({
      type: 'purchaseOrder/saveForm',
      payload,
    });
  },
})
export default class GoodsForm extends PureComponent {
  state = {
    width: '100%',
  };

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id) {
      dispatch({
        type: 'purchaseOrder/fetchOne',
        payload: { id },
      });
    } else {
      dispatch({
        type: 'purchaseOrder/saveForm',
        payload: {},
      });
    }

    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, purchaseOrder: { formData } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'purchaseOrder/save',
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
    this.props.dispatch(routerRedux.push('/purchase/order'));
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
    const { getFieldDecorator, getFieldsError } = this.props.form;

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
                })(<Input />)}
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
