<template>
  <div>
    <div class="login-container">
      <el-card class="login-card" shadow="hover">
        <h2 class="login-title">Welcome to Musical Instrument Online Website</h2>

        <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="80px">
          <!-- 用户名输入框 -->
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username" placeholder="Enter your username"></el-input>
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item label="Password" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="Enter your password"></el-input>
          </el-form-item>

          <!-- 登录按钮 -->
          <!-- <el-form-item>
              
            </el-form-item> -->
        </el-form>
        <el-button class="login-button" type="primary" @click="handleLogin(loginForm.username)">Login</el-button>
        <div>
          <el-button type="text" size="mini" @click="handleRegister">New user? Click here to register.</el-button>
        </div>

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
        username: '',
        password: ''
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter password', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 处理登录按钮点击
    handleLogin(username) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          localStorage.setItem('user', username);
          this.$axios.post('/User/login', {
            role: "ROLE_CUSTOMER",
            username: this.loginForm.username,
            password: this.loginForm.password,
          })
            .then(response => {
              console.log(response.data);
              let res = response.data;
              if (res['code'] == 200) {
                localStorage.setItem('jwtToken', res['jwtToken']);
                localStorage.setItem('userid', res['message']);
                this.$message({
                  message: 'Login successful!',
                  type: 'success'
                });
                this.$router.push('/productList');
              }
              else {
                this.$message({
                  message: 'Login failed, please try again.',
                  type: 'error'
                });
              }

            })
            .catch(error => {
              console.error(error);
              this.$message({
                message: 'Login failed, please try again.',
                type: 'error'
              });
            });
          // 模拟登录逻辑
        } else {
          console.log('Error during login');
          return false;
        }
      });
    },
    // go to register page
    handleRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
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
</style>