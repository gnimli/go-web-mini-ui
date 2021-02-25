<template>
  <div>
    <el-card style="margin-bottom:20px;">
      <div slot="header" class="clearfix">
        <span>修改账户密码</span>
      </div>

      <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="100px">

        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model.trim="dialogFormData.oldPassword" autocomplete="off" :type="passwordTypeOld" placeholder="请输入原密码" />
          <span class="show-pwd" @click="showPwdOld">
            <svg-icon :icon-class="passwordTypeOld === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model.trim="dialogFormData.newPassword" autocomplete="off" :type="passwordTypeNew" placeholder="请输入原密码" />
          <span class="show-pwd" @click="showPwdNew">
            <svg-icon :icon-class="passwordTypeNew === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="dialogFormData.confirmPassword" autocomplete="off" :type="passwordTypeConfirm" placeholder="请输入原密码" />
          <span class="show-pwd" @click="showPwdConfirm">
            <svg-icon :icon-class="passwordTypeConfirm === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      dialogFormRules: {

      },
      passwordTypeOld: 'password',
      passwordTypeNew: 'password',
      passwordTypeConfirm: 'password'
    }
  },
  methods: {
    showPwdOld() {
      if (this.passwordTypeOld === 'password') {
        this.passwordTypeOld = ''
      } else {
        this.passwordTypeOld = 'password'
      }
    },
    showPwdNew() {
      if (this.passwordTypeNew === 'password') {
        this.passwordTypeNew = ''
      } else {
        this.passwordTypeNew = 'password'
      }
    },
    showPwdConfirm() {
      if (this.passwordTypeConfirm === 'password') {
        this.passwordTypeConfirm = ''
      } else {
        this.passwordTypeConfirm = 'password'
      }
    }
  }
}
</script>

<style scoped>
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
</style>
