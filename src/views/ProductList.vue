<template>
  <div>
    <el-header>
      <div class="header-container">
        <div class="header-left">
          <img src="@/assets/music1.png" alt="">
          <div class="welcome-message">
            {{ username }}, Welcome!
          </div>
        </div>
        <div class="header-right">

          <i class="el-icon-shopping-cart-2 cart" @click="goToCart"></i>

          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="text">
              User Center <el-icon name="arrow-down"></el-icon>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">Profile</el-dropdown-item>
              <el-dropdown-item command="signout">Sign Out</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <div class="product-list">
      <div>Product List</div>
      <el-table :data="instrumentList" stripe border style="width: 100%">
        <el-table-column prop="name" label="Instrument Name" width="180" align="center"
          header-align="center"></el-table-column>
        <el-table-column prop="category" label="Category" width="120" align="center"
          header-align="center"></el-table-column>
        <el-table-column prop="brand" label="Brand" width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="price" label="Price" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <span>${{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Description" align="center" header-align="center"></el-table-column>
        <el-table-column prop="material" label="Material" width="120" align="center"
          header-align="center"></el-table-column>
        <el-table-column prop="stockQuantity" label="Stock Quantity" width="120" align="center"
          header-align="center"></el-table-column>
        <el-table-column prop="rating" label="Rating" width="150" align="center" header-align="center">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.rating" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="Operation" align="center" width="130">
          <template slot-scope="scope">
            <el-button @click="goToDetail(scope.row)" type="text" size="small"
              style="text-decoration: underline;">Detail</el-button>
            <el-button @click="addToCart(scope.row)" type="text" size="small" style="text-decoration: underline;">Add to
              Cart</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next" :total="totalItems" :page-size="pageSize"
        :page-sizes="[5, 10, 15, 20, 30]" :current-page.sync="currentPage" @current-change="getInstrumentList"
        @size-change="handleSizeChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      instrumentList: [],
      totalItems: 0,
      currentPage: 1,
      pageSize: 10,

    };
  },
  created() {
    this.username = localStorage.getItem('user');
    this.getInstrumentList();
    // this.instrumentList = [
    //   {
    //     name: '智能手机',
    //     category: '电子产品',
    //     brand: 'Brand A',
    //     price: 4999,
    //     description: '一款高性能智能手机',
    //     material: '金属',
    //     stockQuantity: 50,
    //     rating: 1
    //   },
    //   {
    //     name: '笔记本电脑',
    //     category: '电子产品',
    //     brand: 'Brand B',
    //     price: 8999,
    //     description: '轻薄型笔记本电脑',
    //     material: '铝合金',
    //     stockQuantity: 30,
    //     rating: 5
    //   },
    //   {
    //     name: '运动鞋',
    //     category: '服装',
    //     brand: 'Brand C',
    //     price: 599,
    //     description: '透气舒适运动鞋',
    //     material: '织物',
    //     stockQuantity: 100,
    //     rating: 3
    //   },
    // ]
  },
  methods: {
    goToCart() {
      this.$router.push('/cart');
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.currentPage = 1;
      this.getInstrumentList();
    },
    getInstrumentList() {
      this.$axios.get('/Instrument/getInstrumentList', {
        params: {
          page: this.currentPage,
          pageSize: this.pageSize,
        }
      })
        .then(response => {
          console.log(response.data);
          this.instrumentList = response.data.instrumentList;
          this.totalItems = response.data.total;
        })
        .catch(error => {
          console.error(error);
        });
    },
    goToDetail(row) {
      console.log(row);
      this.$router.push({path: '/detail', query: {
        sku: row.sku
      }});
    },
    addToCart(row) {
      let username = localStorage.getItem('user');
      console.log(row);
      this.$axios.post('/ShoppingCart/addItem', {
        sku: row.sku
      }, {
        params: {
          username: username,
          quantity: 1
        }
      })
        .then(response => {
          console.log(response.data);
          this.$message({
            message: 'Add to Cart successfully',
            type: 'success'
          });
        })
        .catch(error => {
          console.log(error);
          this.$message({
            message: 'failed to add to cart, please try again.',
            type: 'error'
          });
        });
    },
    handleCommand(option) {
      switch (option) {
        case 'signout':
          localStorage.removeItem('jwtToken');
          this.$message({
            message: 'Logout successful, please login again.',
            type: 'success'
          });
          this.$router.push('/');
          // 执行选项1的逻辑
          break;
        case 'profile':
          this.$router.push('/profile');
          break;
        default:
          break;
      }
    }

  }
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  /* 让内容两端对齐 */
  align-items: center;
  /* 垂直居中 */
  padding: 0 20px;
  /* 左右内边距 */
  height: 100%;
  /* 高度占满 */
}

.welcome-message {
  font-size: 20px;
  /* 字体大小 */
  font-weight: bold;
  /* 加粗字体 */
  color: #409EFF;
  /* 字体颜色，Element UI 的主题色 */
  margin-left: 10px;
}

.header-left {
  display: flex;
  justify-content: space-between;
  /* 让内容两端对齐 */
  align-items: center;
  /* 垂直居中 */
  padding: 0 20px;
  /* 左右内边距 */
  height: 100%;
  /* 高度占满 */
}

.header-right {
  display: flex;
}

.cart {
  margin: auto 20px;
  position: relative;
  top: -1px;
  color: #409EFF;
  font-size: large;
  cursor: pointer;
}

.el-table {
  margin-top: 20px;
}

.product-list {
  padding: 20px 40px;
}

.el-pagination {
  margin-top: 20px;
}
</style>