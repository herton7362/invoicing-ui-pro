import React, { Component } from 'react';
import { Input, InputNumber, Form } from 'antd';

import styles from './EditableCell.less';

const FormItem = Form.Item;

export default EditableContext => {
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
        handleEdit,
        ...restProps
      } = this.props;

      return (
        <EditableContextConsumer>
          {(form) => {
            const { getFieldDecorator } = form;

            return (
              <td
                {...restProps}
                onClick={() => {
                  if(editing) {
                    return;
                  }
                  if (typeof rowKey === 'string') {
                    handleEdit(record[rowKey]);
                  }
                  if (typeof rowKey === 'function') {
                    handleEdit(rowKey(record));
                  }
                }}
              >
                {(editing && editor) ? (
                  <FormItem className={styles.formItem}>
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
