import React, { Component } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

// 属性checkbox组，允许checkbox将对象作为值
export default class AttributeCheckboxGroup extends Component {
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
    const { onChange } = this.props;
    if (onChange) onChange(changedValue);
  };

  render() {
    const { children } = this.props;
    const { value } = this.state;

    return (
      <CheckboxGroup
        value={
          value && value.map(val => `${val.goodsTypeAttributeId},${val.goodsTypeAttributeValue}`)
        }
        onChange={val =>
          this.triggerChange(
            val.map(v => ({
              goodsTypeAttributeId: v.split(',')[0],
              goodsTypeAttributeValue: v.split(',')[1],
            }))
          )
        }
      >
        {React.Children.map(children, item =>
          React.cloneElement(item, {
            value: `${item.props.value.goodsTypeAttributeId},${
              item.props.value.goodsTypeAttributeValue
            }`,
          })
        )}
      </CheckboxGroup>
    );
  }
}
