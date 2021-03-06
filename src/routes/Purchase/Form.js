import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { Card, Form, Button, DatePicker, Input, message, Row, Col } from 'antd';
import moment from 'moment';
import FooterToolbar from 'components/FooterToolbar';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SupplierSelector from '../Supplier/SupplierSelector';
import WarehouseSelector from '../Warehouse/WarehouseSelector';
import Skus from './Skus';

import styles from './Form.less';

const FormItem = Form.Item;
const { Description } = DescriptionList;
const { TextArea } = Input;

@connect(({ purchaseOrder, loading }) => ({
  purchaseOrder,
  submitting: loading.effects['purchaseOrder/save'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { purchaseOrder: { formData } } = props;

    return {
      businessRelatedUnitId: Form.createFormField({
        value: formData.businessRelatedUnitId,
      }),
      operator: Form.createFormField({
        value: formData.operator,
      }),
      bookTransferDate: Form.createFormField({
        value: formData.bookTransferDate ? moment(formData.bookTransferDate) : null,
      }),
      warehouseId: Form.createFormField({
        value: formData.warehouseId,
      }),
      remark: Form.createFormField({
        value: formData.remark,
      }),
      items: Form.createFormField({
        value: formData.items,
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
  }

  handleSubmit = (fieldsValue, status) => {
    const { form, dispatch, purchaseOrder: { formData } } = this.props;

    form.resetFields();
    dispatch({
      type: 'purchaseOrder/save',
      payload: {
        ...formData,
        ...fieldsValue,
        status,
      },
    }).then(() => {
      message.success('保存成功');
      this.handleGoBack();
    });
  };

  handleSave = e => {
    e.preventDefault();
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    this.handleSubmit(fieldsValue, 'DRAFT');
  };

  handleConfirm = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.handleSubmit(fieldsValue, 'CONFIRMED');
    });
  };

  handleTransfer = e => {
    e.preventDefault();
    const { dispatch, purchaseOrder: { formData: { transferOrderId } } } = this.props;
    dispatch(routerRedux.push(`/transfer/edit/${transferOrderId}`));
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  };

  render() {
    const { submitting, purchaseOrder: { formData }, form: { getFieldDecorator, getFieldsError } } = this.props;
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
      businessRelatedUnitId: '供应商',
      bookTransferDate: '交货日期',
      warehouseId: '仓库',
    };

    const description = (
      <DescriptionList size="small" col="2">
        <Description term="创建人">{formData.createUserName}</Description>
        <Description term="创建时间">{formData.createdDate}</Description>
      </DescriptionList>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{formData.statusName}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>收货状态</div>
          <div className={styles.heading}>{formData.transferStatusName}</div>
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout
        title={`单号：${formData.orderNumber}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        content={description}
        extraContent={extra}
      >
        <div>
          <Form>
            <Card style={{ marginTop: 8 }} bordered={false} title="订单信息">
              <FormItem {...formItemLayout} label="供应商">
                {getFieldDecorator('businessRelatedUnitId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择一个供应商',
                    },
                  ],
                })(<SupplierSelector style={{ width: 300 }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="预订交货日期">
                {getFieldDecorator('bookTransferDate', {
                  rules: [
                    {
                      required: true,
                      message: '请选择交货日期',
                    },
                  ],
                })(<DatePicker />)}
              </FormItem>
              <FormItem {...formItemLayout} label="交货到">
                {getFieldDecorator('warehouseId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择交货仓库',
                    },
                  ],
                })(<WarehouseSelector style={{ width: 300 }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="附加说明">
                {getFieldDecorator('remark')(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="你可以填写一个附加说明"
                    rows={4}
                  />
                )}
              </FormItem>
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="商品信息">
              <FormItem>
                {getFieldDecorator('items')(
                  <Skus businessRelatedUnitId={formData.businessRelatedUnitId} />
                )}
              </FormItem>
            </Card>

            <FooterToolbar getFieldsError={getFieldsError} fieldLabels={fieldLabels}>
              {formData.transferOrderId && (
                <Button
                  type="primary"
                  icon="car"
                  onClick={this.handleTransfer}
                  loading={submitting}
                >
                  接收产品
                </Button>
              )}
              {formData.status !== 'CONFIRMED' && (
                <Button type="primary" onClick={this.handleConfirm} loading={submitting}>
                  确认订单
                </Button>
              )}
              {formData.status !== 'CONFIRMED' && (
                <Button type="primary" onClick={this.handleSave} loading={submitting}>
                  保存
                </Button>
              )}
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
