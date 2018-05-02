import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Checkbox,
  Row,
  Col,
} from 'antd';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

@connect(({ loading }) => ({
  submitting: loading.effects['goodsProperty/submitGoodsPropertyForm'],
}))
@Form.create()
export default class Modify extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
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

    const propertyItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const plainOptions = ['M', 'X', 'XL','2XL', '3XL', '4XL'];

    return (
      <PageHeaderLayout
        title="添加属性"
      >
        <Form style={{ marginTop: 8 }}>
          <Card title="基本信息" bordered={false}>
            <FormItem {...formItemLayout} label="属性组名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入属性组名称',
                  },
                ],
              })(<Input placeholder="给属性组起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="属性组描述">
              {getFieldDecorator('remark', {
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="可以描述一下属性组"
                  rows={4}
                />
              )}
            </FormItem>
          </Card>

          <Card title="属性信息" bordered={false} style={{ marginTop: 24 }}>
            <FormItem {...formItemLayout} label="商品属性">
              <FormItem {...propertyItemLayout} label="尺码">
                <Row>
                  <Col xs={24} sm={18}>
                    <CheckboxGroup options={plainOptions} defaultValue={['Apple']} />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Button type="primary" size="small" ghost>自定义</Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem {...propertyItemLayout} label="尺码">
                <Row>
                  <Col xs={24} sm={18}>
                    <CheckboxGroup options={plainOptions} defaultValue={['Apple']} />
                  </Col>
                  <Col xs={24} sm={6}>
                    <Button type="primary" size="small" ghost>自定义</Button>
                  </Col>
                </Row>
              </FormItem>
              <Col offset={6}>
                <Button type="primary" size="small">添加属性</Button>
              </Col>
            </FormItem>
          </Card>
        </Form>

        <FooterToolbar style={{ width: this.state.width }}>
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
