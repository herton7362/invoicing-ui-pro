import React, { Component } from 'react';
import { Input, InputNumber, Form } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      rowKey,
      index,
      handleToggleEdit,
      handleSave,
      handleCancel,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;

          return (
            <td
              {...restProps}
              onClick={() => {
                if (typeof rowKey === 'string') {
                  handleToggleEdit(record[rowKey])
                }
                if (typeof rowKey === 'function') {
                  handleToggleEdit(rowKey(record))
                }
              }}
            >
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

const EditableTable = () => {
  return element => {
    return class ExtendedTable extends Component {
      state = {
        editingKey: '',
      };

      isEditing = (record) => {
        const { editingKey } = this.state;
        const { rowKey } = this.props;
        if (typeof rowKey === 'string') {
          return record[rowKey] === editingKey;
        }
        if (typeof rowKey === 'function') {
          return rowKey(record) === editingKey;
        }
        return false;
      };

      handleCancel = () => {
        this.setState({ editingKey: '' });
      };

      handleSave = (form, key) => {
        form.validateFields((error, row) => {
          if (error) {
            return;
          }
          const { data } = this.state;
          const newData = [...data];
          const index = newData.findIndex(item => key === item.key);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            this.setState({ data: newData, editingKey: '' });
          } else {
            newData.push(row);
            this.setState({ data: newData, editingKey: '' });
          }
        });
      };

      handleToggleEdit = (key) => {
        this.setState({ editingKey: key });
      };

      render() {
        const { columns, rowKey } = this.props;
        const selfProps = {...this.props};

        selfProps.columns = columns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: record => ({
              record,
              inputType: col.dataIndex === 'age' ? 'number' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: this.isEditing(record),
              handleToggleEdit: this.handleToggleEdit,
              handleSave: this.handleSave,
              handleCancel: this.handleCancel,
              rowKey,
            }),
          };
        });

        selfProps.components = selfProps.components || {};
        selfProps.components.body = selfProps.components.body || {};

        selfProps.components.body.row = EditableFormRow;
        selfProps.components.body.cell = EditableCell;
        return React.createElement(element, selfProps);
      }
    }
  }
};

export default EditableTable;
