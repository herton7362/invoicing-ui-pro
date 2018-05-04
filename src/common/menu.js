import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '商品',
    icon: 'gift',
    path: 'goods',
    children: [
      {
        name: '商品列表',
        path: 'list',
      },
      {
        name: '商品类别',
        path: 'goods-type/list',
      },
    ],
  },
  {
    name: '库存',
    icon: 'database',
    path: 'warehouse',
    children: [
      {
        name: '库存入库',
        path: 'in-store-log',
      },
      {
        name: '库存出库',
        path: 'out-store-log',
      },
    ],
  },
  {
    name: '批零',
    icon: 'pay-circle-o',
    path: 'sale',
    children: [
      {
        name: '零售开单',
        path: 'sale-form',
      },
    ],
  },
  {
    name: '采购',
    icon: 'shopping-cart',
    path: 'purchase',
    children: [
      {
        name: '订单列表',
        path: 'list',
      },
      {
        name: '添加订单',
        path: 'new',
      },
      {
        name: '采购入库',
        path: 'in-store',
      },
    ],
  },
  {
    name: '会员',
    icon: 'user',
    path: 'member',
    children: [
      {
        name: '会员列表',
        path: 'list',
      },
    ],
  },
  {
    name: '店铺',
    icon: 'shop',
    path: 'shop',
    children: [
      {
        name: '店铺列表',
        path: 'list',
      },
    ],
  },
  {
    name: '权限',
    icon: 'lock',
    path: 'authority',
    children: [
      {
        name: '管理员列表',
        path: 'admin-list',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
