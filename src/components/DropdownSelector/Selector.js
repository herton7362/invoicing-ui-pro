import React, { Component } from 'react';

import { Select, Spin, Icon } from 'antd';

import styles from './Selector.less';

const { Option } = Select;

class Selector extends Component {
  state = {
    value: null,
  };
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }
  triggerChange = changedValue => {
    if (changedValue === '_add') {
      this.props.onAdd();
      return;
    }
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value: changedValue });
    }
    if (onChange) {
      onChange(changedValue);
    }
  };
  renderAddMoreHandler = () => {
    return (
      <Option key="add" value="_add">
        <a>添加一个...</a>
      </Option>
    );
  };
  renderEditHandler = (onEdit, value) => {
    return (
      <div className={styles.editHandlerWrapper}>
        <a
          style={{ display: value ? 'inline-block' : 'none' }}
          className={styles.editHandler}
          onClick={() => onEdit(value)}
        >
          <Icon type="edit" />
        </a>
      </div>
    );
  };
  renderOptions = list => {
    return list.map(item => (
      <Option value={item.id} key={item.id}>
        {item.name}
      </Option>
    ));
  };
  renderContent = data => {
    const { showHandler } = this.props;
    return [this.renderOptions(data), showHandler && this.renderAddMoreHandler()];
  };
  render() {
    const {
      data,
      showSearch,
      placeholder,
      allowClear,
      dropdownStyle,
      optionFilterProp = 'children',
      loading = false,
      showHandler = true,
      onSearch,
      onAdd,
      onEdit,
      ...rest
    } = this.props;

    const { value } = this.state;

    return (
      <div className={styles.selector} {...rest}>
        <div className={styles.field}>
          <Select
            value={loading ? 'noData' : value}
            showSearch={showSearch}
            placeholder={placeholder}
            allowClear={allowClear}
            dropdownStyle={dropdownStyle}
            optionFilterProp={optionFilterProp}
            onSearch={val => onSearch && onSearch(val)}
            onChange={this.triggerChange}
          >
            {loading ? (
              <Option key="noData" value="noData" disabled>
                <Spin key="noData" size="small" />
              </Option>
            ) : (
              data && this.renderContent(data)
            )}
          </Select>
        </div>
        {showHandler && this.renderEditHandler(onEdit, value)}
      </div>
    );
  }
}

export default Selector;
