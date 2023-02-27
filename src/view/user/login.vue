<template>
  <section>
    <!-- safari卡顿 -->
    <!-- <div class="color">
      <div></div>
      <div></div>
      <div></div>
    </div> -->
    <div class="box">
      <div class="square" style="--i: 0"></div>
      <div class="square" style="--i: 1"></div>
      <div class="square" style="--i: 2"></div>
      <div class="square" style="--i: 3"></div>
      <div class="square" style="--i: 4"></div>
      <div class="container">
        <div class="login-form">
          <h2>{{ appName }} 登录</h2>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" placeholder="用户名">
                <i slot="prefix" class="el-icon-user" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                @keyup.enter.native="handleLogin"
              >
                <i slot="prefix" class="el-icon-lock" />
              </el-input>
            </el-form-item>
            <div class="tc-1">username: admin, password: admin</div>
            <el-form-item style="width: 100%">
              <el-button class="submit" :loading="loading.login" size="medium" @click.native.prevent="handleLogin">
                登 录
              </el-button>
            </el-form-item>
            <!-- <p class="forget">Forgot passowrd? 
                <a href="#">Click here</a>
            </p>
            <p class="forget">Don't have an account? 
                <a href="#">Sign up</a>
            </p> -->
          </el-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useUserStore } from '@/store/user'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'UserLogin',
  computed: {
    ...mapState(useUserStore, ['loading']),
  },
  data() {
    return {
      /* global __APP_NAME__ */
      appName: __APP_NAME__,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名称' }],
        password: [{ required: true, trigger: 'blur', message: '请输入登录密码' }],
      },
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
        }
        if (valid) {
          const success = await this.login(user)
          if (success === true) {
            this.$router.push({ path: this.redirect || '/' })
          } else {
            this.$message.error(success.msg)
          }
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(#f1f4f9 0, #a0a3a9 5%, #606266 10%, #303236 15%, #111112 20%);
  // .color>div {
  //   position: absolute;
  //   // safari卡顿
  //   filter: blur(150px);
  //   transform: translateZ(0);
  //   // backdrop-filter: blur(150px);
  //   &:nth-child(1) {
  //     top: 0px;
  //     width: 60vw;
  //     height: 60vh;
  //     background: #1890ff;
  //   }
  //   &:nth-child(2) {
  //     right: 10vw;
  //     width: 40vw;
  //     height: 30vh;
  //     background:  #dc18ff;
  //   }
  //   &:nth-child(3) {
  //     bottom: 10vh;
  //     left: 10vw;
  //     width: 40vw;
  //     height: 30vh;
  //     background: #18ff69;
  //   }
  // }
}

.box {
  position: relative;
  .square {
    position: absolute;
    backdrop-filter: blur(5px);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    animation: animate 10s linear infinite;
    animation-delay: calc(-1s * var(--i));
    &:nth-child(1) {
      top: -50px;
      right: -60px;
      width: 100px;
      height: 100px;
    }
    &:nth-child(2) {
      top: 10px;
      left: -100px;
      width: 120px;
      height: 120px;
      z-index: 2;
    }
    &:nth-child(3) {
      top: 50px;
      right: -60px;
      width: 80px;
      height: 80px;
    }
    &:nth-child(4) {
      bottom: -80px;
      left: 100px;
      width: 50px;
      height: 50px;
    }
    &::nth-child(5) {
      bottom: -80px;
      left: 140px;
      width: 60px;
      height: 60px;
    }
  }
}

@keyframes animate {
  0%,
  100% {
    transform: translateY(-40px);
  }
  50% {
    transform: translateY(40px);
  }
}

.container {
  position: relative;
  width: 400px;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.login-form {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 40px;
  h2 {
    position: relative;
    color: #fff;
    font-size: 25px;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 40px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 80px;
      height: 4px;
      background: #fff;
    }
  }

  ::v-deep .el-input__inner {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    outline: none;
    // padding: 10px 20px;
    border-radius: 35px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 16px;
    letter-spacing: 1px;
    color: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    height: 36px;
    transition: color 9999s ease-out, background-color 9999s ease-out;
    &::placeholder {
      color: #fff;
    }
  }
  ::v-deep .el-input__prefix {
    color: #fff;
    left: 8px;
  }
  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label,
  ::v-deep .el-checkbox__label {
    color: #fff;
  }

  .submit {
    border-radius: 18px;
    font-weight: bolder;
  }
}
</style>
