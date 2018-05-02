import React, { PureComponent, Fragment } from 'react';

import { routerRedux } from 'dva/router';
import { connect } from "dva/index";
import { Card, Divider, Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import property from './Property';

import styles from './PropertyGroup.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateForm = Form.create({
  mapPropsToFields(props) {

    return {
      name: Form.createFormField({
        value: props.formData.name,
      }),
      remark: Form.createFormField({
        value: props.formData.remark,
      }),
    };
  },
})(props => {
  const { modalVisible, form, form: { getFieldDecorator }, handleSave, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSave(fieldsValue);
    });
  };
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
      loading={loading}
      title="属性组维护"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
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
    </Modal>
  );
});

@connect(({ goodsProperty, loading }) => ({
  goodsProperty,
  loading: loading.models.goodsProperty,
}))
export default class PropertyGroupList extends PureComponent {
  state = {
    modalVisible: false,
    currentPage: 1,
    pageSize: 15,
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = (params) => {
    const { dispatch } = this.props;
    const { currentPage, pageSize } = this.state;
    dispatch({
      type: 'goodsProperty/fetch',
      payload: {
        currentPage,
        pageSize,
        logicallyDeleted: 0,
        ...params,
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    this.setState(params);

    if (sorter.field) {
      params.sort = sorter.field;
      params.order = sorter.order;
    }

    this.handleSearch(params);
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSave = fields => {
    this.props.dispatch({
      type: 'goodsProperty/save',
      payload: {
        ...fields,
        id: this.props.goodsProperty.formData.id,
      },
      callback: () => {
        message.success('保存成功');
        this.handleSearch();
        this.setState({
          modalVisible: false,
        });
      },
    });
  };

  handleRemove = id => {
    this.props.dispatch({
      type: 'goodsProperty/remove',
      payload: {
        id,
      },
      callback: () => {
        this.handleSearch();
        message.success('删除成功');
      },
    });
  };

  handleOpenAddModal = () => {
    this.props.dispatch({
      type: 'goodsProperty/getOne',
      payload: {},
    });
    this.handleModalVisible(true);
  };

  handleOpenEditModal = id => {
    this.props.dispatch({
      type: 'goodsProperty/fetchOne',
      payload: {id},
    });
    this.handleModalVisible(true);
  };

  render() {
    const { goodsProperty: {data: { list, pagination }, formData}, loading, dispatch } = this.props;
    const { modalVisible, pageSize } = this.state;

    const columns = [
      {
        title: '商品属性组名称',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'remark',
      },
      {
        title: '属性',
        render: (val, record) => (
          record.goodsPropertyResults.map(item => item.name).join('，')
        ),
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a onClick={() => this.handleOpenEditModal(record.id)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => dispatch(routerRedux.push(`/goods/goods-property/${record.id}`))}>添加属性</a>
            <Divider type="vertical" />
            <Popconfirm title={`确定删除${record.name}吗?`} onConfirm={() => this.handleRemove(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      pageSize,
    };

    const parentMethods = {
      handleSave: this.handleSave,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="商品属性">
        <Card bordered={false}>
          <div className={styles.propertyGroup}>
            <div className={styles.operator}>
              <Button icon="plus" type="primary" onClick={this.handleOpenAddModal}>
                新建
              </Button>
            </div>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              columns={columns}
              onChange={this.handleStandardTableChange}
              expandedRowRender={property}
            />
          </div>
        </Card>
        {!loading && <CreateForm {...parentMethods} formData={formData} modalVisible={modalVisible} />}
      </PageHeaderLayout>
    );
  }
}
