import React, { Component } from 'react';
import {connect} from "dva/index";
import { Button } from 'antd';

@connect(({ goodsTypeAttribute, loading }) => ({
  goodsTypeAttribute,
  loading: loading.models.goodsTypeAttribute,
}))
export default class AttributeTagSelector extends Component {

  render() {
    const { goodsTypeAttribute, ...rest } = this.props;
    return (
      <div {...rest}>
        <Button size="small">选规格</Button>
      </div>
    );
  }
}
