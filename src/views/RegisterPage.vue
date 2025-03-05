<template>
    <div>
        <div class="login-container">
            <el-card class="login-card" shadow="hover">
                <h2 class="login-title">Welcome to be a new user!</h2>

                <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="150px">
                    <el-form-item label="User type">
                        <el-radio-group v-model="loginForm.role">
                            <el-radio label="customer"></el-radio>
                            <el-radio label="seller"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 用户名输入框 -->
                    <el-form-item label="Username" prop="username">
                        <el-input v-model="loginForm.username" placeholder="Enter your username"></el-input>
                    </el-form-item>

                    <!-- 密码输入框 -->
                    <el-form-item label="Password" prop="password">
                        <el-input v-model="loginForm.password" type="password"
                            placeholder="Enter your password"></el-input>
                    </el-form-item>

                    <!-- 密码输入框 -->
                    <el-form-item label="Password again" prop="passwordAgain">
                        <el-input v-model="loginForm.passwordAgain" type="password"
                            placeholder="Enter your password again"></el-input>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="loginForm.email" placeholder="Enter your email"></el-input>
                    </el-form-item>
                    <el-form-item label="Phone number" prop="phoneNumber">
                        <el-input v-model="loginForm.phoneNumber" placeholder="Enter your phone number"></el-input>
                    </el-form-item>
                    <el-form-item label="Address" prop="address">
                        <el-input v-model="loginForm.address" placeholder="Enter your address"></el-input>
                    </el-form-item>
                </el-form>
                <el-button class="login-button" type="primary" @click="handleRegister">Register</el-button>

            </el-card>

        </div>
        <div class="power">Powered by Xiao Su 2097658, Angran Li 2097002, Dongye Liu 2075960</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 表单数据
            loginForm: {
                role: 'customer',
                username: '',
                password: '',
                passwordAgain: '',
                email: '',
                phoneNumber: '',
                address: ''
            },
            // 验证规则
            rules: {
                username: [
                    { required: true, message: 'Please enter username', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please enter password', trigger: 'blur' }
                ],
                passwordAgain: [
                    { required: true, message: 'Please enter password again', trigger: 'blur' },
                    { validator: this.validateConfirmPassword, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleRegister() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$axios.post('/User/register', {
                        role: this.loginForm.role == "customer" ? "ROLE_CUSTOMER" : "ROLE_SELLER",
                        username: this.loginForm.username,
                        password: this.loginForm.password,
                        email: this.loginForm.email,
                        phoneNumber: this.loginForm.phoneNumber,
                        address: this.loginForm.address,
                    })
                        .then(response => {
                            console.log(response.data);
                            let res = response.data;
                            if (res['code'] == 200) {
                                this.$message({
                                    message: 'Registration successful, please login.',
                                    type: 'success'
                                });
                                this.$router.push('/');
                            }
                            else {
                                this.$message({
                                    message: 'Registration failed, please try again.',
                                    type: 'error'
                                });
                            }

                        })
                        .catch(error => {
                            console.log(error);
                            this.$message({
                                message: 'Registration failed, please try again.',
                                type: 'error'
                            });
                        });

                } else {
                    console.log('Error during register');
                    return false;
                }
            });
        },
        validateConfirmPassword(rule, value, callback) {
            if (value === '') {
                callback(new Error('Please enter password again'));
            } else if (value !== this.loginForm.password) {
                callback(new Error('It is different from password above!'));
            } else {
                callback();
            }
        },

    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 700px;
    background-color: #f2f2f2;
}

.login-card {
    width: 700px;
    padding: 20px;
}

.login-title {
    text-align: center;
    margin-bottom: 60px;
    font-size: 24px;
    color: #409EFF;
}

.login-button {
    text-align: center;
    margin-bottom: 10px;
}

.power {
    text-align: center;
    font-size: 12px;
    color: #888888;
    padding: 10px 0;
    margin-top: 20px;
}

.el-radio-group {
    width: 80%;
}

.el-radio {
    margin-right: 100px;
}
</style>