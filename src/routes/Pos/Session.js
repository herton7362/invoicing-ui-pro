import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Breadcrumb, Card } from 'antd';

import styles from './Session.less';

const { Content, Header, Sider } = Layout;

@connect(({ posSession, loading }) => ({
  posSession,
  loading: loading.models.posSession,
}))
export default class PosSession extends Component {
  render() {
    const list = [
      {
        id: 1,
        title: '国产红提',
        avatar: '/logo.svg',
      },
      {
        id: 2,
        title: '大白菜',
        avatar: '/logo.svg',
      },
      {
        id: 3,
        title: 'iPhone X',
        avatar: '/logo.svg',
      },
      {
        id: 4,
        title: 'iPhone X',
        avatar: '/logo.svg',
      },
    ];
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={440}>
          sider
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 99 }} />
          <table style={{ width: '100%', height: 'calc(100% - 64px)', border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ height: 0 }}>
                  <div style={{ background: '#fff', padding: '16px 24px' }}>
                    <Breadcrumb>
                      <Breadcrumb.Item>User</Breadcrumb.Item>
                      <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ marginTop: '16px' }}>
                      {list.map(item => (
                        <Card key={item.id} hoverable className={styles.card}>
                          <Card.Meta
                            avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                            title={<a className={styles.cardTitle} href="#">{item.title}</a>}
                          />
                        </Card>
                      ))}
                      <div className={styles.clearBoth} />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ height: '100%' }}>
                  <Content style={{ height: '100%', overflow: 'auto' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 990 }}>
                      {list.map(item => (
                        <Card key={item.id} hoverable className={styles.card}>
                          <Card.Meta
                            avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                            title={<a className={styles.cardTitle} href="#">{item.title}</a>}
                          />
                        </Card>
                      ))}
                    </div>
                  </Content>
                </td>
              </tr>
            </tbody>
          </table>
        </Layout>
      </Layout>
    );
  }
}
