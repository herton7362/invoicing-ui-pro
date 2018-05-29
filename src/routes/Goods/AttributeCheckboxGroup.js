import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Form } from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

// 属性checkbox组，允许checkbox将对象作为值
@connect(({ goodsTypeAttribute }) => ({
  goodsTypeAttribute,
}))
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
    const {
      goodsTypeAttribute: { data: { list: goodsTypeAttributeList = [] } },
      labelCol,
      wrapperCol,
    } = this.props;
    const { value } = this.state;

    return (
      <div>
        {goodsTypeAttributeList.map(attr => (
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
