import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import {getRoutes} from "../../utils/utils";

@connect()
export default class GoodsList extends PureComponent {
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'list':
        dispatch(routerRedux.push(`${match.url}/list`));
        break;
      case 'category':
        dispatch(routerRedux.push(`${match.url}/category`));
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'list',
        tab: '普通商品',
      },
      {
        key: 'category',
        tab: '商品分类',
      },
    ];

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);

    return (
      <PageHeaderLayout
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/goods/manage" to="/goods/manage/list" />
        </Switch>
      </PageHeaderLayout>
    );
  }
}
