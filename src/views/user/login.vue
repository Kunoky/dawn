<script setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const { loading } = storeToRefs(userStore)
const loginFormInstance = ref()
const appName = __APP_NAME__
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  uuid: '',
  code: '',
})
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入用户名称' }],
  password: [{ required: true, trigger: 'blur', message: '请输入登录密码' }],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
}

const handleLogin = () => {
  loginFormInstance.value.validate(async valid => {
    if (valid) {
      const res = await userStore.login(loginForm)
      if (res.code === 200) {
        router.push(router.currentRoute.value.query.redirect || '/')
      } else {
        // ElMessage.error(res.msg)
        getCode()
      }
    }
  })
}

const captchaEnabled = ref(true)
const { data: codeUrl, run: getCode } = useAsync(
  () =>
    req.get('/captchaImage').then(res => {
      captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
      if (captchaEnabled.value) {
        loginForm.uuid = res.uuid
        return 'data:image/gif;base64,' + res.img
      }
    }),
  {
    manual: false,
  }
)
</script>
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
          <el-form ref="loginFormInstance" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" placeholder="用户名">
                <template #prefix><i-ep-user /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password>
                <template #prefix><i-ep-lock /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">
                <template #prefix><IconFont icon="anquanyinsi" /></template>
              </el-input>
              <img :src="codeUrl" @click="getCode" class="code-img cs-p" />
            </el-form-item>
            <el-form-item style="width: 100%">
              <el-button class="submit" :loading="loading.login" size="default" @click.prevent="handleLogin">
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

<style rel="stylesheet/scss" lang="scss" scoped>
section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(#c2a6a6 0, #3d3a68 40%);
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
  :deep(.el-input__wrapper) {
    border-radius: 35px;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  :deep(.el-input__inner) {
    width: 100%;
    background-color: transparent;
    border: none;
    outline: none;
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
  :deep(.el-input__prefix) {
    color: #fff;
    left: 8px;
  }
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label),
  :deep(.el-checkbox__label) {
    color: #fff;
  }

  .submit {
    border-radius: 18px;
    font-weight: bolder;
  }

  .code-img {
    height: 36px;
    width: 33%;
    padding-left: 4%;
  }
}
</style>
