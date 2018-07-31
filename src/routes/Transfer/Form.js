import React, { PureComponent } from 'react';

import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { Card, Form, Button, DatePicker, message, Row, Col } from 'antd';
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

@connect(({ transferOrder, loading }) => ({
  transferOrder,
  submitting: loading.effects['transferOrder/save'],
}))
@Form.create()
export default class TransferForm extends PureComponent {
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (id) {
      dispatch({
        type: 'transferOrder/fetchOne',
        payload: { id },
      });
    } else {
      dispatch({
        type: 'transferOrder/saveForm',
        payload: {},
      });
    }
  }

  handleConfirm = e => {
    e.preventDefault();
    const { form, dispatch, transferOrder: { formData } } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'transferOrder/save',
        payload: {
          ...formData,
          ...fieldsValue,
          status: 'COMPLETED',
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

  render() {
    const { submitting, transferOrder: { formData }, form: { getFieldDecorator, getFieldsError } } = this.props;
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
        <Description term="关联单据">{formData.originOrderNumber}</Description>
      </DescriptionList>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{formData.statusName}</div>
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
                  initialValue: formData.businessRelatedUnitId,
                })(<SupplierSelector style={{ width: 300 }} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="交货日期">
                {getFieldDecorator('transferredDate', {
                  rules: [
                    {
                      required: true,
                      message: '请选择交货日期',
                    },
                  ],
                  initialValue: formData.transferredDate ? moment(formData.transferredDate) : null,
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
                  initialValue: formData.warehouseId,
                })(<WarehouseSelector style={{ width: 300 }} />)}
              </FormItem>
            </Card>

            <Card style={{ marginTop: 24 }} bordered={false} title="商品信息">
              <FormItem>
                {getFieldDecorator('items', {
                  initialValue: formData.items,
                })(
                  <Skus />
                )}
              </FormItem>
            </Card>

            <FooterToolbar getFieldsError={getFieldsError} fieldLabels={fieldLabels}>
              {formData.status !== 'COMPLETED' && (
                <Button type="primary" onClick={this.handleConfirm} loading={submitting}>
                  确认订单
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
