import React, { PureComponent, Fragment } from 'react';

import { connect } from 'dva/index';
import { Card, Divider, Table, Button, message, Popconfirm, Input } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import attribute from './Attribute';
import GoodsTypeForm from './GoodsTypeForm';
import AttributeForm from './AttributeForm';

import styles from './GoodsType.less';

const { Search } = Input;

@connect(({ goodsType, goodsTypeAttribute, loading }) => ({
  goodsType,
  goodsTypeAttribute,
  loading: loading.models.goodsType || loading.models.goodsTypeAttribute,
}))
export default class GoodsTypeList extends PureComponent {
  state = {
    modalVisible: false,
    attrModalVisible: false,
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
      type: 'goodsType/fetch',
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

  handleAttrModalVisible = flag => {
    this.setState({
      attrModalVisible: !!flag,
    });
  };

  handleRemove = id => {
    this.props.dispatch({
      type: 'goodsType/remove',
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
      type: 'goodsType/getOne',
      payload: {},
    });
    this.handleModalVisible(true);
  };

  handleOpenEditModal = id => {
    this.props.dispatch({
      type: 'goodsType/fetchOne',
      payload: { id },
    });
    this.handleModalVisible(true);
  };

  handleOpenAddAttrModal = goodsTypeId => {
    this.props.dispatch({
      type: 'goodsTypeAttribute/getOne',
      payload: {
        goodsTypeId,
      },
    });
    this.handleAttrModalVisible(true);
  };

  handleOpenEditAttrModal = id => {
    this.props.dispatch({
      type: 'goodsTypeAttribute/fetchOne',
      payload: { id },
    });
    this.handleAttrModalVisible(true);
  };

  handleAttrRemove = id => {
    this.props.dispatch({
      type: 'goodsTypeAttribute/remove',
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
    const { goodsType: { data: { list, pagination } }, loading } = this.props;
    const { modalVisible, attrModalVisible, pageSize } = this.state;

    const columns = [
      {
        title: '商品类别名称',
        dataIndex: 'name',
      },
      {
        title: '属性',
        render: (val, record) =>
          record.goodsTypeAttribute && record.goodsTypeAttribute.length > 0
            ? record.goodsTypeAttribute.map(attr => attr.name)
            : '未配置',
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a onClick={() => this.handleOpenEditModal(record.id)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleOpenAddAttrModal(record.id)}>添加属性</a>
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
      handleAttrModalVisible: this.handleAttrModalVisible,
      onCancel: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <div className={styles.goodsType}>
          <Card
            bordered={false}
            title="商品属性"
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={
              <Search
                className={styles.extraContentSearch}
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
              expandedRowRender={record =>
                attribute(record, this.handleOpenEditAttrModal, this.handleAttrRemove)
              }
            />
          </Card>
          {!loading && <GoodsTypeForm {...parentMethods} modalVisible={modalVisible} />}
          {!loading && <AttributeForm {...parentMethods} modalVisible={attrModalVisible} />}
        </div>
      </PageHeaderLayout>
    );
  }
}
