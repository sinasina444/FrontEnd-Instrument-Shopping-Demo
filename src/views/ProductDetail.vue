<template>
    <div class="product-detail">
        <el-row :gutter="20">
            <!-- 左侧商品图片展示 -->
            <el-col :span="6">
                <el-image class="product-image" :src="product.imageURL" alt="Product Image" fit="cover" />
            </el-col>

            <!-- 右侧商品信息展示 -->
            <el-col :span="18">
                <h1>{{ product.name }}</h1>
                <div class="desc">{{ product.description }}</div>
                <el-divider></el-divider>

                <el-row>
                    <el-col :span="8">
                        <p class="sub-title">Category：{{ product.category }}</p>
                    </el-col>
                    <el-col :span="8">
                        <p class="sub-title">Brand：{{ product.brand }}</p>
                    </el-col>
                    <el-col :span="8">
                        <p class="sub-title">Material：{{ product.material }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <p class="sub-title">Rating：{{ product.rating }}</p>
                    </el-col>
                    <el-col :span="8">
                        <p class="price">Price：${{ product.price }}</p>
                    </el-col>
                </el-row>

                <el-divider></el-divider>
                <!-- 数量选择和按钮组 -->
                <div class="action-buttons">
                    <el-input-number v-model="quantity" :min="1" label="Quantity"></el-input-number>

                    <el-button class="summit-button" type="primary" icon="el-icon-shopping-cart-full"
                        @click="addToCart">
                        Add to Cart
                    </el-button>

                    <el-button type="default" @click="goBack" icon="el-icon-arrow-left">
                        Go Back
                    </el-button>
                </div>
            </el-col>
        </el-row>

        <!-- 商品详情和评论信息 -->
        <el-tabs type="border-card" class="product-tabs">
            <el-tab-pane label="Product Detail">
                <p>{{ product.detail }}</p>
                <!-- YouTube Video -->
                <div class="video-container">
                    <iframe v-if="product.audioURL" :src="product.audioURL" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Comments">
                <p>No Reviews</p>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: {
                // name: "Yamaha Guitar",
                // price: 199.99,
                // image: require('@/assets/guitar.png'),
                // description: "The guitar is a popular string instrument, typically with six strings, known for its versatility across various musical styles such as rock, jazz, blues, classical, and folk. It consists of a wooden body that amplifies the sound, a neck with frets to control pitch, and tuning pegs to adjust string tension. ",
                // details: "The Yamaha FG800 Acoustic Guitar is a timeless classic, crafted for musicians of all levels who demand superior sound quality, exceptional craftsmanship, and unparalleled playability. Whether you're strumming your first chords or performing on stage, the FG800 is designed to elevate your music journey.",
                // videoUrl: "https://www.youtube.com/embed/uePV98PEU-w", // Replace VIDEO_ID with actual YouTube video ID
                // reviews: [
                //     { username: "Anonymous User 1", comment: "Very good！" },
                //     { username: "Anonymous User 2", comment: "Quality is outstanding." },
                // ],
            },
            quantity: 1,
        };
    },
    created() {
        this.initialDetail();
    },
    methods: {
        initialDetail() {
            this.$axios.get('/Instrument/getInstrumentBySku', {
                params: {
                    sku: this.$route.query.sku
                }
            })
                .then(response => {
                    console.log(response.data);
                    this.product = response.data.instrument;
                })
                .catch(error => {
                    console.error(error);
                });
        },

        addToCart() {
            let username = localStorage.getItem('user');
            this.$axios.post('/ShoppingCart/addItem', {
                sku: this.$route.query.sku
            }, {
                params: {
                    username: username,
                    quantity: this.quantity
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
        goBack() {
            // Use browser history to go back
            window.history.back();
        },
    },
};
</script>

<style scoped>
.product-detail {
    position: relative;
    padding: 20px;
}

.go-back-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
}

.product-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
}

.price {
    font-size: 20px;
    color: #ff4d4f;
    margin-top: 10px;
}

.description {
    font-size: 16px;
    margin-top: 5px;
    color: #606266;
    text-align: left;
}

.product-tabs {
    margin-top: 20px;
}

.desc {
    font-size: 16px;
    color: #606266;
}

.summit-button {
    margin-left: 10px;
}

.video-container {
    position: relative;
    padding-top: 56.25%;
    /* Aspect ratio 16:9 */
    height: 0;
    overflow: hidden;
    margin-top: 20px;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
}
</style>