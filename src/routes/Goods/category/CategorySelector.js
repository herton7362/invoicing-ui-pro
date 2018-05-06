import React, { Component, Fragment } from 'react';

import { connect } from "dva/index";
import debounce from 'lodash/debounce';
import DropdownSelector from 'components/DropdownSelector';
import Form from './Form';
import { query } from '../../../services/goodsCategory';

@connect()
export default class CategorySelector extends Component {
  constructor() {
    super();
    this.handleSearchGoodsCategory = debounce(this.handleSearchGoodsCategory, 600);
  }

  state = {
    value: null,
    modalVisible: false,
    goodsCategoryList: [],
    loading: true,
  };

  componentDidMount() {
    const { value } = this.props;
    this.handleSearchGoodsCategory(null, value);
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value }  = nextProps;
      this.setState({ value });
    }
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value: changedValue });
    }
    if (onChange) {
      onChange(changedValue);
    }
  };

  handleSearchGoodsCategory = (name, value) => {
    this.setState({ value, loading: true });
    query({
      logicallyDeleted: 0,
      pageSize: 7,
      cascadeParent: true,
      name,
    }).then(response => {
      this.setState({
        value,
        goodsCategoryList: response.content,
        loading: false,
      })
    })
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleOpenGoodsCategoryAddModal = () => {
    this.handleModalVisible(true);
  };

  handleOpenGoodsCategoryEditModal = id => {
    this.props.dispatch({
      type: 'goodsCategory/fetchOne',
      payload: {id},
    }).then(() => this.handleModalVisible(true));
  };

  render() {
    const {
      dispatch,
      allowClear = false,
      showHandler = true,
      ...rest
    } = this.props;
    const { value, loading, modalVisible, goodsCategoryList } = this.state;

    const parentMethods = {
      onSaveSuccess: this.onSaveSuccess,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        <DropdownSelector
          {...rest}
          value={value}
          showSearch
          allowClear={allowClear}
          showHandler={showHandler}
          loading={loading}
          data={goodsCategoryList}
          placeholder="请选择一个商品分类"
          filterTreeNode={false}
          treeDefaultExpandAll
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          onSearch={this.handleSearchGoodsCategory}
          onAdd={this.handleOpenGoodsCategoryAddModal}
          onEdit={this.handleOpenGoodsCategoryEditModal}
          onChange={this.triggerChange}
        />
        <Form {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}
