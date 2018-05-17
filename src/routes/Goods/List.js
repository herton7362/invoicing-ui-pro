import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Card, List, Avatar, Menu, Dropdown, Icon, Tooltip, Button } from 'antd';
import { routerRedux } from 'dva/router';
import Ellipsis from 'components/Ellipsis';
import numeral from 'numeral';
import { getImgServerPath } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodsSkuModal from './GoodsSkuModal';

import styles from './List.less';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
export default class GoodsList extends PureComponent {
  state = {
    skuVisible: false,
    goodsId: null,
  };

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

  handleOpenAddModal = () => {
    this.props.dispatch(routerRedux.push('/goods/add'));
  };

  handleOpenEditModal = ({ id }) => {
    this.props.dispatch(routerRedux.push(`/goods/edit/${id}`));
  };

  render() {
    const { goods: { list, total }, loading } = this.props;
    const { skuVisible, goodsId } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 15,
      total,
    };

    const ListContent = ({ data: { id, basicGoodsPrice: { retailPrice }, costPrice, goodsSkus, stockNumber } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <p>价格：￥ {numeral(retailPrice).format('0,0.0')}</p>
          <p>利润：￥ {numeral(retailPrice - costPrice).format('0,0.0')}</p>
        </div>
        <div className={styles.listContentItem}>
          <p>
            库存：
            {
              goodsSkus.length > 0
                ? goodsSkus.map(goodsSku => goodsSku.stockNumber).reduce((x, y) => x + y)
                : stockNumber
            } 件
          </p>
          {goodsSkus.length > 0 && (
            <p style={{textAlign: 'center'}}>
              <a onClick={() => this.setState({skuVisible: true, goodsId: id})}>查看sku</a>
            </p>
          )}
        </div>
      </div>
    );

    const menu = item => (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.handleDisable(item)}>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = props => {
      const { item } = props;
      return (
        <Dropdown overlay={menu(item)}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };

    const avatarPath = attachId =>
      attachId ? `${getImgServerPath()}/attachment/download/${attachId}` : '/none-img.jpg';

    return (
      <PageHeaderLayout>
        <div className={styles.goodsList}>
          <Card bordered={false}>
            <div className={styles.operator}>
              <Button type="primary" icon="plus" onClick={this.handleOpenAddModal}>
                新建
              </Button>
            </div>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => this.handleOpenEditModal(item)}>编辑</a>,
                    <MoreBtn item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={avatarPath(item.goodsCoverImage.attachmentId)}
                        shape="square"
                        size="large"
                      />
                    }
                    title={
                      <Tooltip title={item.name}>
                        <Ellipsis className={styles.title} lines={1}>
                          {item.name}
                        </Ellipsis>
                      </Tooltip>
                    }
                    description={`条码：${item.barcode || '-'}`}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
          <GoodsSkuModal visible={skuVisible} goodsId={goodsId} />
        </div>
      </PageHeaderLayout>
    );
  }
}
