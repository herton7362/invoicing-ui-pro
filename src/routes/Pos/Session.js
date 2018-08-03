import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Breadcrumb, Card, Button, Row, Col, Icon, Tag } from 'antd';

import styles from './Session.less';

const { Content, Header, Sider } = Layout;

const { CheckableTag } = Tag;
const ButtonGroup = Button.Group;

const tagsFromServer = ['生鲜', '水果蔬菜', '业务伙伴服务', '电脑'];

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
      <Layout className={styles.layout}>
        <Sider width={444} className={styles.sider}>
          <Header className={styles.header} />
          <table className={styles.sideTable}>
            <tbody>
              <tr>
                <td className={styles.orders}>
1
                </td>
              </tr>
              <tr>
                <td className={styles.controlButtons}>
                  <Row gutter={8}>
                    <Col span={8}>
                      <Button size="large" icon="tag" style={{ width: '100%', fontSize: 18 }}>备注</Button>
                    </Col>
                    <Col span={8}>
                      <Button size="large" icon="copy" style={{ width: '100%', fontSize: 18 }}>拆分</Button>
                    </Col>
                    <Col span={8}>
                      <Button size="large" icon="user" style={{ width: '100%', fontSize: 18 }}>客户</Button>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <div className={styles.actionpad}>
                      <Button className={styles.payButton}>
                        <Icon type="right-circle" />
                        <p>付款</p>
                      </Button>
                    </div>
                    <div className={styles.numpad}>
                      <ButtonGroup>
                        <Button className={`${styles.num} ${styles.button}`}>1</Button>
                        <Button className={`${styles.num} ${styles.button}`}>2</Button>
                        <Button className={`${styles.num} ${styles.button}`}>3</Button>
                        <Button type="primary" className={`${styles.mode} ${styles.button} ${styles.topRigthRadius}`}>数量</Button>
                      </ButtonGroup>
                      <ButtonGroup className={styles.middle}>
                        <Button className={`${styles.num} ${styles.button}`}>4</Button>
                        <Button className={`${styles.num} ${styles.button}`}>5</Button>
                        <Button className={`${styles.num} ${styles.button}`}>6</Button>
                        <Button className={`${styles.mode} ${styles.button}`}>折扣</Button>
                      </ButtonGroup>
                      <ButtonGroup className={styles.middle}>
                        <Button className={`${styles.num} ${styles.button}`}>7</Button>
                        <Button className={`${styles.num} ${styles.button}`}>8</Button>
                        <Button className={`${styles.num} ${styles.button}`}>9</Button>
                        <Button className={`${styles.mode} ${styles.button}`}>价格</Button>
                      </ButtonGroup>
                      <ButtonGroup className={styles.middle}>
                        <Button className={`${styles.num} ${styles.button}`}>+/-</Button>
                        <Button className={`${styles.num} ${styles.button}`}>0</Button>
                        <Button className={`${styles.num} ${styles.button}`}>.</Button>
                        <Button className={`${styles.backspace} ${styles.button} ${styles.bottomRigthRadius}`}>
                          <Icon type="close-square-o" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 99 }} />
          <table style={{ width: '100%', height: 'calc(100% - 64px)', border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ height: 0 }}>
                  <div style={{ padding: '16px 24px', background: '#fff', borderBottom: 'solid 1px #ebedf0' }}>
                    <Breadcrumb>
                      <Breadcrumb.Item>User</Breadcrumb.Item>
                      <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ marginTop: '16px' }}>
                      {tagsFromServer.map(tag => (
                        <CheckableTag
                          className={styles.tag}
                          key={tag}
                        >
                          {tag}
                        </CheckableTag>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ height: '100%' }}>
                  <Content style={{ height: '100%', overflow: 'auto' }}>
                    <div style={{ padding: 24, minHeight: 990 }}>
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
