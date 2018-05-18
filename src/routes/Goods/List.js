import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import {
  Card,
  List,
  Avatar,
  Menu,
  Dropdown,
  Icon,
  Tooltip,
  Button,
  Form,
  Row,
  Col,
  Input,
} from 'antd';
import { routerRedux } from 'dva/router';
import Ellipsis from 'components/Ellipsis';
import numeral from 'numeral';
import { getImgServerPath } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodsSkuModal from './GoodsSkuModal';
import CategorySelector from './category/CategorySelector';

import styles from './List.less';

const FormItem = Form.Item;

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods || loading.models.goodsTypeAttribute,
}))
@Form.create()
export default class GoodsList extends PureComponent {
  state = {
    skuVisible: false,
  };

  componentDidMount() {
    this.handleSearchGoods();
  }

  onSaveSuccess = () => {
    this.handleSearchGoods();
  };

  handleSearchGoods = () => {
    const { form: { getFieldsValue } } = this.props;
    this.props.dispatch({
      type: 'goods/fetch',
      payload: {
        logicallyDeleted: 0,
        ...getFieldsValue(),
      },
    });
  };

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

  handleSkuModalVisible = flag => {
    this.setState({
      skuVisible: !!flag,
    });
  };

  handleViewSku = ({ id, goodsTypeId }) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goodsTypeAttribute/fetch',
      payload: {
        goodsTypeId,
        logicallyDeleted: 0,
        sort: 'sortNumber',
        order: 'asc',
      },
    }).then(() => {
      dispatch({
        type: 'goods/fetchOne',
        payload: { id },
      });
      this.handleSkuModalVisible(true);
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="快速搜索">
              {getFieldDecorator('quickSearch')(<Input placeholder="商品名称/条码/拼音码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品分类">
              {getFieldDecorator('goodsCategoryId')(
                <CategorySelector allowClear showHandler={false} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearchGoods}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { goods: { list, total }, loading } = this.props;
    const { skuVisible } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 15,
      total,
    };

    const parentMethods = {
      onSaveSuccess: this.onSaveSuccess,
      handleModalVisible: this.handleSkuModalVisible,
    };

    const ListContent = ({ data: { retailPrice, costPrice, goodsSkus, stockNumber }, data }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <p>价格：￥ {numeral(retailPrice).format('0,0.0')}</p>
          <p>利润：￥ {numeral(retailPrice - costPrice).format('0,0.0')}</p>
        </div>
        <div className={styles.listContentItem} style={{ width: 100, textAlign: 'center' }}>
          <p>
            库存：
            {goodsSkus.length > 0
              ? goodsSkus.map(goodsSku => goodsSku.stockNumber).reduce((x, y) => x + y)
              : stockNumber}{' '}
            件
          </p>
          {goodsSkus.length > 0 && (
            <p style={{ textAlign: 'center' }}>
              <a onClick={() => this.handleViewSku(data)}>查看sku</a>
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
            <div className={styles.listForm}>{this.renderForm()}</div>
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
                      <Avatar src={avatarPath(item.coverImageId)} shape="square" size="large" />
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
          <GoodsSkuModal {...parentMethods} visible={skuVisible} />
        </div>
      </PageHeaderLayout>
    );
  }
}
