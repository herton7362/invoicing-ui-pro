import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AutoFocus extends Component {
  static defaultProps = {
    focus: false,
  };

  static propTypes = {
    children: PropTypes.object.isRequired,
    focus: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      focus: props.focus,
    };

    if (props.focus) this.focusTextInput();
  }

  state = {
    value: null,
    focus: false,
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
    if ('focus' in nextProps) {
      const { focus } = nextProps;
      if (focus) if (!this.state.focus) this.focusTextInput();
      this.setState({ focus });
    }
  }

  focusTextInput = () => {
    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 200);
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value: changedValue });
    }
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { children, focus, ...restProps } = this.props;
    const { value } = this.state;

    return (
      <div {...restProps}>
        {React.cloneElement(children, {
          ref: element => {
            this.input = element && element.input;
          },
          value,
          onChange: this.triggerChange,
        })}
      </div>
    );
  }
}
