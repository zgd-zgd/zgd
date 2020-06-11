import axios from 'axios'

//服务器地址
// axios.defaults.baseURL = "http://172.16.4.200:5000"  //教师IP
axios.defaults.baseURL = "http://127.0.0.1:5000/"// 本地
// 需改商品编辑 商品添加 头像上传

/* API_LOGIN：登录接口 
   account：用户名
   password：密码
*/
export const API_LOGIN = (account, password) => axios.post('/users/checkLogin', { account, password })


//=================================      账户       =====================================================================

/* API_USERADD：添加账号
   account：用户名
   password：密码
   userGroup：用户组
 */
export const API_USERADD = (account, password, userGroup) => axios.post('/users/add', { account, password, userGroup })


/* API_USERLIST：账号列表
   currentPage：当前页面
   pageSize：每页条数
 */
export const API_USERLIST = (currentPage, pageSize) => axios.get('/users/list', { params: { currentPage, pageSize } })


/* API_REMOVE_ACC：删除账号
   id:id
 */
export const API_REMOVE_ACC = id => axios.get('/users/del', { params: { id } })


/* API_BATCH_DELETE：批量删除账号
   ids:数组形式的id
 */
export const API_BATCH_DELETE = ids => axios.get('/users/batchdel', { params: { ids } })


/* API_UPDATEACC：编辑账号接口 
   id:id
   account：用户名
   userGroup：用户组
*/
export const API_UPDATEACC = (id, account, userGroup) => axios.post('/users/edit', { id, account, userGroup })


/* API_UPDATEACC：当前账号密码是否正确接口 
   id:id
   pwd：当前账号密码
*/
export const API_RAWPWD = (id, oldPwd) => axios.get('/users/checkoldpwd', { params: { id, oldPwd } })


/* API_UPDATEPWD：修改账户密码
   id:id
   account：用户名
   userGroup：用户组
*/
export const API_UPDATEPWD = (id, newPwd) => axios.post('/users/editpwd', { id, newPwd })



/* API_ACCOUNT：获取账户信息
   id:id
*/
export const API_ACCOUNT = (id) => axios.get('/users/accountinfo', { params: { id } })


/* API_TOKEN：验证是否过期
  token: token
*/
export const API_TOKEN = (token) => axios.get('/users/checktoken', { params: { token } })


// =======================         商品           ===============================================================

/* API_COMMODITY_ADDCATE：添加商品类别
 */

export const API_COMMODITY_ADDCATE = (cateName, state) => axios.post('/goods/addcate', { cateName, state })


/* API_COMMODITY_CATELIST：商品分类列表
   currentPage：当前页码
   pageSize：每页条数
 */

export const API_COMMODITY_CATELIST = (currentPage, pageSize) => axios.get('/goods/catelist', { params: { currentPage, pageSize } })



/* API_COMMODITY_EDITCATE：编辑商品分类
   id:id
   cateName:分类名称
   state：是否开启
 */

export const API_COMMODITY_EDITCATE = (id, cateName, state) => axios.post('/goods/editcate', { id, cateName, state })


/* API_COMMODITY_DELCATE：删除商品分类
   id:当前删除的id标识
 */

export const API_COMMODITY_DELCATE = (id) => axios.get('/goods/delcate', { params: { id } })


/* 
API_COMMODITY_CATEGORIES:商品类别
 */

export const API_COMMODITY_CATEGORIES = () => axios.get('/goods/categories')


/* API_GOODS_ADD:添加商品
   name：商品名称
   category：商品分类
   price：商品价格
   imgUrl：商品图片地址
   goodsDesc：商品描述
*/

export const API_GOODS_ADD = (name, category, price, imgUrl, goodsDesc) => axios.post('/goods/add', { name, category, price, imgUrl, goodsDesc })

/* API_GOODS_LIST:渲染商品列表
currentPage:当前页码
pageSize:每页条数
 */
export const API_GOODS_LIST = (currentPage, pageSize) => axios.get('/goods/list', { params: { currentPage, pageSize } })


/* API_GOODS_DEL:删除商品
id：需删除商品的ID
 */
export const API_GOODS_DEL = (id) => axios.get('/goods/del', { params: { id } })


/* API_GOODS_EDIT:修改商品
   name：商品名称
   category：商品分类
   price：商品价格
   imgUrl：商品图片地址
   goodsDesc：商品描述
*/

export const API_GOODS_EDIT = (name, category, price, imgUrl, goodsDesc, id) => axios.post('/goods/edit', { name, category, price, imgUrl, goodsDesc, id })



//=========================================     订单      =============================================================================

/* API_ORDER_DETAIL:订单列表 （模糊查询）
   currentPage:当前页码
   pageSize：每页条数
   currentPage:当前页码
   pageSize：每页条数
   orderNo:订单号
   consignee:收货人
   phone:手机号
   orderState:订单状态
   date:时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"]
 */
export const API_ORDER_LIST = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/list', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

/* API_ORDER_SEARCH:订单查询 
   currentPage:当前页码
   pageSize：每页条数
   orderNo:订单号
   consignee:收货人
   phone:手机号
   orderState:订单状态
   date:时间范围，字符串格类型如: ["2019-10-05 00:00:00","2019-10-10 00:00:00"]
 */
export const API_ORDER_SEARCH = (currentPage, pageSize, orderNo, consignee, phone, orderState, date) => axios.get('/order/search', { params: { currentPage, pageSize, orderNo, consignee, phone, orderState, date } })

/* 
API_ORDER_EDIT:编辑订单
 */
export const API_ORDER_EDIT = (id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState) => axios.post('/order/edit', { id, orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState })


/* API_SHOP_INFO:店铺详情
 */
export const API_SHOP_INFO = () => axios.get('/shop/info')


/*
API_SHOP_EDIT:编辑店铺信息
 */
export const API_SHOP_EDIT = (id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics) => axios.post('/shop/edit', { id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics })






/* API_SHOP_INFO:首页报表
 */
export const API_HOME_TOTALDATA = () => axios.get('/order/totaldata')


/* API_SHOP_INFO:订单报表
 */
export const API_ORDER_ORDERTOTAL = (date) => axios.get('/order/ordertotal', { params: { date } })