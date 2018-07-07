import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva/index';
import { Card, Form, message, Divider, Popconfirm, Input, Button, Table } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Order.less';

const { Search } = Input;

@connect(({ purchaseOrder, loading }) => ({
  purchaseOrder,
  loading: loading.models.goods || loading.models.goodsTypeAttribute,
}))
@Form.create()
export default class OrderList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 15,
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = params => {
    const { dispatch } = this.props;
    const { currentPage, pageSize } = this.state;
    dispatch({
      type: 'purchaseOrder/fetch',
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

  handleOpenAddPage = () => {
    this.props.dispatch(routerRedux.push('/purchase/add'));
  };

  handleOpenEditPage = id => {
    this.props.dispatch(routerRedux.push(`/purchase/edit/${id}`));
  };

  handleRemove = id => {
    this.props.dispatch({
      type: 'purchaseOrder/remove',
      payload: {
        id,
      },
      callback: () => {
        this.handleSearch();
        message.success('删除成功');
      },
    });
  };

  render() {
    const { purchaseOrder: { data: { list, pagination } }, loading } = this.props;
    const { pageSize } = this.state;

    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNumber',
      },
      {
        title: '预订交货日期',
        dataIndex: 'deliveryDate',
      },
      {
        title: '交货到',
        dataIndex: 'warehouse.name',
      },
      {
        title: '供应商',
        dataIndex: 'businessRelatedUnit.name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => {
          const status = {
            CANCEL: '已取消',
            DRAFT: '草稿',
            CONFIRMED: '已确认',
          };
          return status[val];
        },
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a onClick={() => this.handleOpenEditPage(record.id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定删除${record.orderNumber}吗?`}
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

    return (
      <PageHeaderLayout>
        <Card
          className={styles.purchaseOrder}
          bordered={false}
          title="采购订单"
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          extra={<Search placeholder="请输入" onSearch={name => this.handleSearch({ name })} />}
        >
          <div className={styles.operator}>
            <Button type="primary" icon="plus" onClick={this.handleOpenAddPage}>
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
      </PageHeaderLayout>
    );
  }
}
