<template>
    <div>
        <el-header>
            <div class="header-container">
                <div class="header-left">
                    <img src="@/assets/music1.png" alt="">
                    <div class="welcome-message">
                        {{ username }}, Here is the shopping cart!
                    </div>
                </div>
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
        </el-header>
        <div class="product-list">
            <div class="title">Shopping Cart</div>
            <CartItem v-for="(product, index) in cartList" :key="index" :product="product"
                @deleteItem="handleDeleteItem" />
            <div class="bottomline"></div>
        </div>
        <div class="total">
            Subtotal ({{ totalQnt }} items): ${{ totalPrice }}
        </div>
        <el-button type="primary" @click="checkout">Check Out</el-button>
        <el-button @click="goBack">Go Back</el-button>
    </div>
</template>

<script>
import CartItem from '../components/CartItem.vue'
export default {
    components: {
        CartItem
    },
    data() {
        return {
            username: "",
            cartList: [],
            totalQnt: 0,
            totalPrice: 0
        };
    },
    created() {
        this.username = localStorage.getItem('user');
        this.getCartList();
        // this.cartList = [
        //     {
        //         name: '智能手机',
        //         category: '电子产品',
        //         brand: 'Brand A',
        //         price: 4999,
        //         description: '一款高性能智能手机',
        //         material: '金属',
        //         stockQuantity: 50,
        //         rating: 1,
        //         quantity: 3
        //     },
        //     {
        //         name: '笔记本电脑',
        //         category: '电子产品',
        //         brand: 'Brand B',
        //         price: 8999,
        //         description: '轻薄型笔记本电脑',
        //         material: '铝合金',
        //         stockQuantity: 30,
        //         rating: 5,
        //         quantity: 5
        //     },
        //     {
        //         name: '运动鞋',
        //         category: '服装',
        //         brand: 'Brand C',
        //         price: 599,
        //         description: '透气舒适运动鞋',
        //         material: '织物',
        //         stockQuantity: 100,
        //         rating: 3,
        //         quantity: 2
        //     },
        // ]
    },
    methods: {
        getCartList() {
            let username = localStorage.getItem('user');
            this.$axios.get('/ShoppingCart/getShoppingCart', {
                params: {
                    username: username
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.cartList = response.data['cartItems'];
                    let quantityTmp = 0;
                    let totalTmp = 0;
                    for (let i = 0; i < this.cartList.length; i++) {
                        quantityTmp += this.cartList[i].quantity;
                        totalTmp += this.cartList[i].totalPrice;
                    }
                    this.totalQnt = quantityTmp;
                    this.totalPrice = totalTmp;
                })
                .catch(error => {
                    console.error(error);
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
        },
        checkout() {
            let userid = localStorage.getItem('userid');
            this.$axios.delete('/ShoppingCart/clearShoppingCartById', {
                params: {
                    userId: userid
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.cartList = [];
                    this.$message({
                        message: 'Checkout ' + this.totalQnt + ' items, $' + this.totalPrice + ' successful!',
                        type: 'success'
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
        goBack() {
            this.$router.back();
        },
        handleDeleteItem(sku) {
            let userid = localStorage.getItem('userid');
            this.$axios.delete('/ShoppingCart/removeItemBySku', {
                params: {
                    userId: userid,
                    sku: sku
                }
            })
                .then(response => {
                    console.log(response);
                    this.getCartList();
                    this.$message({
                        message: 'Delete successful!',
                        type: 'success'
                    });
                })
                .catch(error => {
                    console.error("Error in delete request:", error);
                });
        }
    }
};
</script>

<style scoped>
.bottomline {
    border-top: 1px solid grey;
}

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

.el-table {
    margin-top: 20px;
}

.product-list {
    padding: 20px 100px;
}

.el-pagination {
    margin-top: 20px;
}

.title {
    margin-bottom: 20px;
}

.total {
    margin: 20px;
    text-align: right;
    padding-right: 100px;
    font-size: large;
    font-weight: bolder;
}
</style>