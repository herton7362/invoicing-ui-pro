import React, { Component } from 'react';

import { TreeSelect, Spin, Icon } from 'antd';

import styles from './TreeSelector.less';

const { TreeNode } = TreeSelect;

class TreeSelector extends Component {
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
      <TreeNode
        className={styles.addHandlerWrapper}
        title={<a className={styles.addHandler}>添加一个...</a>}
        key="add"
        value="_add"
      />
    );
  };
  renderEditHandler = (onEdit, value) => {
    return (
      <div className={styles.editHandlerWrapper}>
        <a className={styles.editHandler} onClick={() => onEdit(value)}>
          <Icon type="edit" />
        </a>
      </div>
    );
  };
  renderTreeData = (list, parentId = null) => {
    return list
      .map(item => {
        if (
          item.parentId === parentId ||
          (!list.some(i => i.id === item.parentId) && parentId === null)
        ) {
          const children = this.renderTreeData(list, item.id);
          return (
            <TreeNode value={item.id} title={item.name} key={item.id}>
              {children.length > 0 && children}
            </TreeNode>
          );
        }
        return null;
      })
      .filter(item => item);
  };
  renderContent = data => {
    const { showHandler } = this.props;
    return [this.renderTreeData(data), showHandler && this.renderAddMoreHandler()].filter(
      item => item
    );
  };
  render() {
    const {
      data,
      showSearch,
      placeholder,
      allowClear,
      dropdownStyle,
      treeDefaultExpandAll,
      treeNodeFilterProp = 'title',
      filterTreeNode = false,
      loading = false,
      showHandler = true,
      onSearch,
      onAdd,
      onEdit,
      ...rest
    } = this.props;

    const { value } = this.state;

    return (
      <div className={styles.treeSelector} {...rest}>
        <div className={styles.field}>
          <TreeSelect
            value={loading ? 'noData' : value}
            showSearch={showSearch}
            placeholder={placeholder}
            allowClear={allowClear}
            dropdownStyle={dropdownStyle}
            treeDefaultExpandAll={treeDefaultExpandAll}
            treeNodeFilterProp={treeNodeFilterProp}
            filterTreeNode={filterTreeNode}
            onSearch={val => onSearch && onSearch(val)}
            onChange={this.triggerChange}
          >
            {loading ? (
              <TreeNode
                key="noData"
                title={<Spin key="noData" size="small" />}
                value="noData"
                disabled
              />
            ) : (
              data && this.renderContent(data)
            )}
          </TreeSelect>
        </div>
        {showHandler && this.renderEditHandler(onEdit, value)}
      </div>
    );
  }
}

export default TreeSelector;
