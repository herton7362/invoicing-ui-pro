import React, { Component, Fragment } from 'react';

import { connect } from 'dva/index';
import { message } from 'antd';
import debounce from 'lodash/debounce';
import { TreeSelector } from 'components/DropdownSelector';
import Form from './Form';

@connect(({ goodsCategory, loading }) => ({
  goodsCategory,
  loading: loading.models.goodsCategory,
}))
export default class CategorySelector extends Component {
  constructor() {
    super();
    this.handleSearch = debounce(this.handleSearch, 600);
  }

  state = {
    value: null,
    modalVisible: false,
  };

  componentDidMount() {
    this.handleSearch();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
      if (value !== null && value !== undefined && !this.checkValueInItems(value)) {
        this.handleSearch();
      }
    }
  }

  onSaveSuccess = response => {
    message.success('保存成功');
    this.handleSearch().then(() =>
      setTimeout(() => this.triggerChange(response ? response.id : null), 700)
    );
  };

  onCancel = () => {
    this.handleSearch();
    this.handleModalVisible();
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (typeof changedValue === 'object' && (changedValue !== null || changedValue !== undefined))
      return;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  checkValueInItems = value => {
    const { goodsCategory: { data: { list } } } = this.props;
    return list.some(row => row.id === value);
  };

  handleSearch = name => {
    const { dispatch, value } = this.props;
    return dispatch({
      type: 'goodsCategory/fetch',
      payload: {
        logicallyDeleted: 0,
        pageSize: 7,
        cascadeParent: true,
        name,
        extraData: value,
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleOpenGoodsCategoryAddModal = () => {
    this.props.dispatch({
      type: 'goodsCategory/saveForm',
      payload: {},
    });
    this.handleModalVisible(true);
  };

  handleOpenGoodsCategoryEditModal = id => {
    this.props
      .dispatch({
        type: 'goodsCategory/fetchOne',
        payload: { id },
      })
      .then(() => this.handleModalVisible(true));
  };

  render() {
    const {
      dispatch,
      allowClear = false,
      showHandler = true,
      goodsCategory: { data: { list } },
      loading,
      ...rest
    } = this.props;
    const { value, modalVisible } = this.state;

    const parentMethods = {
      onSaveSuccess: this.onSaveSuccess,
      handleModalVisible: this.handleModalVisible,
      onCancel: this.onCancel,
    };

    return (
      <Fragment>
        <TreeSelector
          {...rest}
          value={value}
          showSearch
          allowClear={allowClear}
          showHandler={showHandler}
          loading={loading}
          data={list}
          placeholder="请选择一个商品分类"
          filterTreeNode={false}
          treeDefaultExpandAll
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          onSearch={this.handleSearch}
          onAdd={this.handleOpenGoodsCategoryAddModal}
          onEdit={this.handleOpenGoodsCategoryEditModal}
          onChange={this.triggerChange}
        />
        <Form {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}
