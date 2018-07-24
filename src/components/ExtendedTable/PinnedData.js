import React, { Component, Fragment } from 'react';

const PinnedDataTable = () => {
  return element => {
    return class ExtendedTable extends Component {
      render() {
        const { columns } = this.props;
        const selfProps = {...this.props};

        const renderTd = pinnedData => columns.map(column => {
          const key = column.dataIndex || column.key;
          const matched = pinnedData.find(data => key === Object.keys(data)[0]);
          const style = {
            textAlign: column.align,
          };
          if(matched != null) {
            return <td key={`${key}_${matched[key]}`} style={style}>{matched[key]}</td>;
          } else {
            return <td key={key || 'noop'} />;
          }
        });

        selfProps.components = selfProps.components || {};
        selfProps.components.body = selfProps.components.body || {};

        selfProps.components.body.wrapper = props => {
          const {pinnedTopData, pinnedBottomData} = this.props;

          return (
            <tbody {...props}>
              <Fragment>
                {pinnedTopData && (
                  <tr className="ant-table-row">
                    {renderTd(pinnedTopData)}
                  </tr>
                )}
                { props.children }
                {pinnedBottomData && (
                  <tr className="ant-table-row">
                    {renderTd(pinnedBottomData)}
                  </tr>
                )}
              </Fragment>
            </tbody>
          );
        };

        return React.createElement(element, selfProps);
      }
    }
  }
};

export default PinnedDataTable;
