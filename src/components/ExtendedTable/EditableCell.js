import React, { Component } from 'react';
import { Input, InputNumber, Form } from 'antd';

const FormItem = Form.Item;

export default (EditableContext) => {
  const EditableContextConsumer = EditableContext.Consumer;
  return class EditableCell extends Component {
    getInput = () => {
      const { editor: { type, onChange = () => {}, ...restProps }, record } = this.props;
      if (type === 'number') {
        return <InputNumber onChange={value => onChange(value, record)} {...restProps} />;
      }
      return <Input onChange={e => onChange(e.target.value, record)} {...restProps} />;
    }

    render() {
      const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        rowKey,
        editor,
        ...restProps
      } = this.props;

      return (
        <EditableContextConsumer>
          {(form) => {
            const { getFieldDecorator } = form;

            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `请输入${title}！`,
                      }],
                      initialValue: record[dataIndex],
                    })(this.getInput())}
                  </FormItem>
                ) : restProps.children}
              </td>
            );
          }}
        </EditableContextConsumer>
      );
    }
  }
}
