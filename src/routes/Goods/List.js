import React, { PureComponent } from 'react';

import { connect } from "dva/index";
import { Card, List, Avatar, Menu, Dropdown, Icon, Tooltip } from 'antd';
import Ellipsis from 'components/Ellipsis';
import numeral from 'numeral';
import { getImgServerPath } from "../../utils/utils";

import styles from './List.less';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
export default class GoodsList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'goods/fetch',
      payload: {
        logicallyDeleted: 0,
      },
    });
  }

  handleDisable = item => {
    this.props.dispatch({
      type: 'goods/disable',
      payload: {
        id: item.id,
      },
    });
  };

  render() {
    const { goods: { list, total }, loading } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 15,
      total,
    };

    const ListContent = (
      {
        data: {
          basicGoodsPrice: { retailPrice },
          costPrice,
          weight,
          length,
          width,
          height,
        },
      }) => (
        <div className={styles.listContent}>
          <div className={styles.listContentItem}>
            <p>价格：￥ {numeral(retailPrice).format('0,0.0')}</p>
            <p>利润：￥ {numeral(retailPrice - costPrice).format('0,0.0')}</p>
          </div>
          <div className={styles.listContentItem}>
            <p>重量：{numeral(weight).format('0.00')} kg</p>
            <p>长度：{numeral(length).format('0.00')} kg</p>
            <p>宽度：{numeral(width).format('0.00')} kg</p>
            <p>高度：{numeral(height).format('0.00')} kg</p>
          </div>
          <div className={styles.listContentItem}>
            <p>库存：10 件</p>
            <p><a>查看库存</a></p>
          </div>
        </div>
    );

    const menu = item => (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.handleDisable(item)}>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = ( props ) => {
      const { item } = props;
      return (
        <Dropdown overlay={menu(item)}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };

    const avatarPath = (attachId) => (attachId?`${getImgServerPath()}/attachment/download/${attachId}`: '/none-img.jpg');

    return (
      <div className={styles.goodsList}>
        <Card bordered={false}>
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={item => (
              <List.Item actions={[<a>编辑</a>, <MoreBtn item={item} />]}>
                <List.Item.Meta
                  avatar={<Avatar src={avatarPath(item.goodsCoverImage.attachmentId)} shape="square" size="large" />}
                  title={<Tooltip title={item.name}><Ellipsis className={styles.title} lines={1}>{item.name}</Ellipsis></Tooltip>}
                  description={item.code}
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  }
}
