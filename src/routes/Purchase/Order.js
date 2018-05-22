import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Card, Form } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods || loading.models.goodsTypeAttribute,
}))
@Form.create()
export default class GoodsList extends PureComponent {
  render() {
    const {goods: {list, total}, loading} = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          88
        </Card>
      </PageHeaderLayout>
    );
  }
}
