import React, { Component, Fragment } from 'react';

import { connect } from 'dva/index';
import { message } from 'antd';
import debounce from 'lodash/debounce';
import { Selector } from 'components/DropdownSelector';
import Form from './GoodsTypeForm';

@connect(({ goodsType, loading }) => ({
  goodsType,
  loading: loading.models.goodsType,
}))
export default class GoodsTypeSelector extends Component {
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

  handleSearch = name => {
    const { dispatch, value } = this.props;
    return dispatch({
      type: 'goodsType/fetch',
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

  handleOpenGoodsTypeAddModal = () => {
    this.props.dispatch({
      type: 'goodsType/saveForm',
      payload: {},
    });
    this.handleModalVisible(true);
  };

  handleOpenGoodsTypeEditModal = id => {
    this.props
      .dispatch({
        type: 'goodsType/fetchOne',
        payload: { id },
      })
      .then(() => this.handleModalVisible(true));
  };

  render() {
    const {
      dispatch,
      allowClear = true,
      showHandler = true,
      goodsType: { data: { list } },
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
        <Selector
          {...rest}
          value={value}
          showSearch
          allowClear={allowClear}
          showHandler={showHandler}
          loading={loading}
          data={list}
          placeholder="请选择一个商品分类"
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          onSearch={this.handleSearch}
          onAdd={this.handleOpenGoodsTypeAddModal}
          onEdit={this.handleOpenGoodsTypeEditModal}
          onChange={this.triggerChange}
        />
        <Form {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}
