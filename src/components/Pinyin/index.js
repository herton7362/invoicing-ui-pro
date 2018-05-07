import React, { Component } from 'react';
import PropTypes from 'prop-types';

import firstletter from './pinyinFirstletter';

export default class Pinyin extends Component {
  static defaultProps = {
    onPinyinChange: () => {},
  };

  static propTypes = {
    children: PropTypes.object.isRequired,
    onPinyinChange: PropTypes.func,
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

  getFirstPinyinLetter = string => {
    if (!string || /^ +$/g.test(string)) return '';
    const result = [];
    for (const [ch] of string) {
      const unicode = ch.charCodeAt(0);
      if (unicode >= 19968 && unicode <= 40869) {
        result.push(firstletter.all.charAt(unicode - 19968));
      } else {
        result.push(ch);
      }
    }
    return result.join('').toLowerCase();
  };

  triggerChange = changedValue => {
    const { onChange, onPinyinChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value: changedValue });
    }
    if (onChange) {
      onChange(changedValue);
    }
    onPinyinChange(this.getFirstPinyinLetter(changedValue.target.value));
  };

  render() {
    const { children, onPinyinChange, ...restProps } = this.props;

    const { value } = this.state;

    return (
      <div {...restProps}>
        {React.cloneElement(children, {
          value,
          onChange: this.triggerChange,
        })}
      </div>
    );
  }
}
