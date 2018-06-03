import React, { Component, Fragment } from 'react';

import { connect } from 'dva/index';
import { Button, Dropdown, Icon, Menu } from 'antd';
import debounce from 'lodash/debounce';

import styles from './GoodsSkuSelector.less';

const MenuItem = Menu.Item;

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
    if (!('value' in this.props))
      this.setState({ value: changedValue });
    if (onChange)
      onChange(changedValue);
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

  handleSelect = id => {
    this.triggerChange(id);
  }

  render() {
    const {
      dispatch,
      goods: { list },
      loading,
      ...rest
    } = this.props;
    const { value } = this.state;

    const getName = id => {
      if(list) {
        const one = list.find(data => data.id === id);
        if(one) {
          return one.name;
        }
      }
      return '';
    }

    const menu = (
      <Menu onClick={({ key }) => this.handleSelect(key)}>
        {list.map(data => (
          <MenuItem key={data.id}>{data.name}</MenuItem>
        ))}
      </Menu>
    );

    return (
      <Fragment>
        <div {...rest}>
          <span className={styles.label}>{getName(value)}</span>
          <Dropdown overlay={menu}>
            <Button size="small">选择 <Icon type="down" /></Button>
          </Dropdown>
        </div>
      </Fragment>
    );
  }
}
