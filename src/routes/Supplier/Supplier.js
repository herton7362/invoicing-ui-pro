import React, { PureComponent, Fragment } from 'react';
import {connect} from "dva/index";
import { Form, Card, Button, Table, Input, Divider, Popconfirm, message } from "antd";

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SaveForm from './Form';

import styles from './Supplier.less';

const { Search } = Input;

@connect(({ businessRelatedUnit, loading }) => ({
  businessRelatedUnit,
  loading: loading.models.businessRelatedUnit,
}))
@Form.create()
export default class SupplierList extends PureComponent {
  state = {
    modalVisible: false,
    currentPage: 1,
    pageSize: 15,
  };

  componentDidMount() {
    this.handleSearch();
  }

  onSaveSuccess = () => {
    message.success('保存成功');
    this.handleSearch();
  };

  handleSearch = params => {
    const { dispatch } = this.props;
    const { currentPage, pageSize } = this.state;
    dispatch({
      type: 'businessRelatedUnit/fetch',
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

  handleOpenAddModal = () => {
    this.props.dispatch({
      type: 'businessRelatedUnit/saveForm',
      payload: {},
    });
    this.handleModalVisible(true);
  };

  handleOpenEditModal = id => {
    this.props.dispatch({
      type: 'businessRelatedUnit/fetchOne',
      payload: { id },
    });
    this.handleModalVisible(true);
  };

  handleRemove = id => {
    this.props.dispatch({
      type: 'businessRelatedUnit/remove',
      payload: {
        id,
      },
    }).then(() => {
      this.handleSearch();
      message.success('删除成功');
    });
  };

  render() {
    const { businessRelatedUnit: { data: { list, pagination } }, loading } = this.props;
    const { modalVisible, pageSize } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '电话',
        dataIndex: 'telephone',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '电子邮件',
        dataIndex: 'email',
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a onClick={() => this.handleOpenEditModal(record.id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定删除${record.name}吗?`}
              onConfirm={() => this.handleRemove(record.id)}
            >
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
      onSaveSuccess: this.onSaveSuccess,
      handleModalVisible: this.handleModalVisible,
      onCancel: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.supplier}>
          <Card
            bordered={false}
            title="供应商"
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={
              <Search
                placeholder="请输入"
                onSearch={name => this.handleSearch({ name })}
              />
            }
          >
            <div className={styles.operator}>
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.handleOpenAddModal}
              >
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
            />
          </Card>
        </div>
        <SaveForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
