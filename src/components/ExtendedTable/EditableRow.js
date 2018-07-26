import React, { Component } from 'react';
import { Form, Popconfirm, Divider } from 'antd';

import EditableCell from './EditableCell';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
const EditableContextCell = EditableCell(EditableContext);


const EditableTable = () => {
  return element => {
    return class ExtendedTable extends Component {
      state = {
        editingKey: '',
        data: [],
      };

      componentWillReceiveProps(nextProps) {
        const { dataSource } = nextProps;
        this.setState({ data: dataSource });
      }

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

      cancel = () => {
        this.setState({ editingKey: '' });
      };

      save = (form, key) => {
        const { rowKey, onChange = () => {} } = this.props;
        form.validateFields((error, row) => {
          if (error) {
            return;
          }
          const { data } = this.state;
          const newData = [...data];
          const index = newData.findIndex(item => {
            if (typeof rowKey === 'string') {
              return key === item[rowKey];
            }
            if (typeof rowKey === 'function') {
              return key === rowKey(item);
            }
            return false;
          });
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            this.setState({ data: newData, editingKey: '' }, () => onChange(newData, index));
          } else {
            newData.push(row);
            this.setState({ data: newData, editingKey: '' }, () => onChange(newData, index));
          }
        });
      };

      edit = (key) => {
        this.setState({ editingKey: key });
      };

      remove = (index) => {
        this.cancel();
        const { onChange = () => {} } = this.props;
        const { data } = this.state;
        data.splice(index, 1);
        this.setState({ data, editingKey: '' }, () => onChange(data, -2));
      }

      render() {
        const { columns, rowKey } = this.props;
        const selfProps = {...this.props};
        const { data } = this.state;

        selfProps.columns = [...columns.map((col) => {
            return {
              ...col,
              onCell: record => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editor: col.editor ? Object.assign({
                  size: selfProps.size,
                }, col.editor) : false,
                editing: this.isEditing(record),
                handleEdit: this.edit,
                rowKey,
              }),
            };
          }),
          {
            title: '操作',
            dataIndex: '操作',
            align: 'center',
            render: (text, record, index) => {
              const editable = this.isEditing(record);
              let key;
              if (typeof rowKey === 'string') {
                key = record[rowKey];
              }
              if (typeof rowKey === 'function') {
                key = rowKey(record);
              }
              return (
                <div>
                  {editable ? (
                    <span>
                      <EditableContext.Consumer>
                        {form => (
                          <a
                            onClick={() => this.save(form, key)}
                            style={{marginRight: 8}}
                          >
                            保存
                          </a>
                        )}
                      </EditableContext.Consumer>
                      <Divider type="vertical" />
                      <a onClick={() => this.cancel(key)}>取消</a>
                    </span>
                  ) : (
                    <span>
                      <a onClick={() => this.edit(key)}>编辑</a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="您确定删除吗？"
                        onConfirm={() => this.remove(index)}
                      >
                        <a>删除</a>
                      </Popconfirm>
                    </span>
                  )}
                </div>
              );
            },
          },
        ];

        selfProps.dataSource = data;

        selfProps.components = selfProps.components || {};
        selfProps.components.body = selfProps.components.body || {};

        selfProps.components.body.row = EditableFormRow;
        selfProps.components.body.cell = EditableContextCell;
        return React.createElement(element, selfProps);
      }
    }
  }
};

export default EditableTable;
