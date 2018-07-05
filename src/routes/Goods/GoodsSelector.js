import React, { Component } from 'react';

import { connect } from 'dva/index';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
export default class GoodsTypeSelector extends Component {
  constructor() {
    super();
    this.handleSearch = debounce(this.handleSearch, 600);
  }

  state = {
    value: null,
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

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) this.setState({ value: changedValue });
    if (onChange) onChange(changedValue);
  };

  handleSearch = name => {
    const { dispatch, value } = this.props;
    return dispatch({
      type: 'goods/fetch',
      payload: {
        logicallyDeleted: 0,
        pageSize: 7,
        cascadeParent: true,
        name,
        extraData: value,
      },
    });
  };

  render() {
    const { dispatch, goods: { list }, loading, ...rest } = this.props;
    const { value } = this.state;

    return (
      <Select
        value={value}
        placeholder="请选择商品"
        optionFilterProp="children"
        onSearch={this.handleSearch}
        notFoundContent={loading ? <Spin size="small" /> : null}
        showSearch
        onChange={this.triggerChange}
        {...rest}
      >
        {list.map(data => (
          <Option key={data.id} value={data.id}>
            {data.name}
          </Option>
        ))}
      </Select>
    );
  }
}
