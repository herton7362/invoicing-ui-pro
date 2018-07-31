import React, { Component } from 'react';
import classNames from 'classnames';
import { Popover, Icon } from 'antd';
import styles from './index.less';

export default class FooterToolbar extends Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const { width } = this.state;
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const calcWidth = `calc(100% - ${sider.style.width})`;
    if (calcWidth !== width) {
      this.setState({ width });
    }
  };

  render() {
    const {
      children,
      className,
      extra,
      getFieldsError,
      fieldLabels = [],
      excludeKeys = [],
      ...restProps
    } = this.props;
    const { width } = this.state;

    let getErrorInfo = () => {};
    if(getFieldsError) {
      const errors = getFieldsError();
      getErrorInfo = () => {
        const errorCount = Object.keys(errors).filter(key => errors[key] && !excludeKeys.includes(key))
          .length;
        if (!errors || errorCount === 0) {
          return null;
        }
        const scrollToField = fieldKey => {
          const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
          if (labelNode) {
            labelNode.scrollIntoView(true);
          }
        };
        const errorList = Object.keys(errors).map(key => {
          if (!errors[key] || excludeKeys.includes(key)) {
            return null;
          }
          return (
            <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
              <Icon type="cross-circle-o" className={styles.errorIcon} />
              <div className={styles.errorMessage}>{errors[key][0]}</div>
              <div className={styles.errorField}>{fieldLabels[key]}</div>
            </li>
          );
        });
        return (
          <span className={styles.errorIcon}>
            <Popover
              title="表单校验信息"
              content={errorList}
              overlayClassName={styles.errorPopover}
              trigger="click"
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Icon type="exclamation-circle" />
            </Popover>
            {errorCount}
          </span>
        );
      };
    }

    return (
      <div className={classNames(className, styles.toolbar)} style={{width}} {...restProps}>
        <div className={styles.left}>{extra}</div>
        <div className={styles.right}>{getErrorInfo()}{children}</div>
      </div>
    );
  }
}
