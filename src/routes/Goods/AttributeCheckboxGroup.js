import React, { Component } from 'react';
import { Checkbox, Form } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

// 属性checkbox组，允许checkbox将对象作为值
export default class AttributeCheckboxGroup extends Component {
  static propTypes = {
    goodsTypeAttributes: PropTypes.array.isRequired,
  };

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
    const { goodsTypeAttributes, labelCol, wrapperCol } = this.props;
    const { value } = this.state;

    return (
      <div>
        {goodsTypeAttributes.map(attr => (
          <FormItem key={attr.id} labelCol={labelCol} wrapperCol={wrapperCol} label={attr.name}>
            <CheckboxGroup
              value={
                value &&
                value.map(val => `${val.goodsTypeAttributeId},${val.goodsTypeAttributeValue}`)
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
              {attr.attrValues.split(',').map(val => {
                return (
                  <Checkbox key={`${attr.id}_${val}`} value={`${attr.id},${val}`}>
                    {val}
                  </Checkbox>
                );
              })}
            </CheckboxGroup>
          </FormItem>
        ))}
      </div>
    );
  }
}
