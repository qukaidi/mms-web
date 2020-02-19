<template>
  <d2-container>
      <el-form :model="addFormData" ref="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark text-header">新增材料界面</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="材料类型" prop="materialTypeId">
              <el-select v-model="addFormData.materialTypeId" placeholder="请选择">
                 <el-option  v-for="mateType in mateTypeList" :key="mateType.id" :label="mateType.materialTypeName" :value="mateType.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addFormData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="场内代码" prop="materialCode">
              <el-input v-model="addFormData.materialCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="addFormData.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最低储备" label-width="100px" prop="minNum">
              <el-input v-model.number="addFormData.minNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="现有数量" prop="nowNum">
              <el-input v-model.number="addFormData.nowNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark text-header">上传照片</div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="8">
            <el-upload
            ref="el-upload"
            :headers='headers'
            action="/api/pic/upload?type=cache"
            list-type="picture-card">
             <i class="el-icon-plus"></i>
             </el-upload>
             <br>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="4" >
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>重置</el-button>
        </el-col>
      </el-row>
  </d2-container>
</template>

<script>
import util from '@/libs/util'
import {
  fetchList as fetchMaterialTypeList
} from '@api/materialType.js'
import {
  add as addMaterial
} from '@api/material.js'
import { checkIsNum } from '@/plugin/checkRules.js'
export default {
  name: 'materialAdd',
  data () {
    return {
      addFormData: {
        materialTypeId: '',
        name: '',
        materialCode: '',
        unit: '',
        minNum: '',
        nowNum: ''
      },
      mateTypeList: null,
      rules: {
        materialTypeId: [
          { required: true, message: '请选择材料类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        materialCode: [
          { required: true, message: '请输入场内代码', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        minNum: [
          { required: true,
            message: '请输入最低储备',
            trigger: 'blur' },
          { validator: checkIsNum, trigger: 'blur' }
        ],
        nowNum: [ { required: true,
          message: '请输入现有数量',
          trigger: 'blur' },
        { validator: checkIsNum, trigger: 'blur' }]
      },
      headers: {
        Authorization: util.cookies.get('token')
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$refs['el-upload'].uploadFiles.length < 1) {
            this.$message('上传图片不能少于0')
            return false
          }
          let imgUrl = this.$refs['el-upload'].uploadFiles.map(item => item.response.data).join(';')
          let requestBody = {
            ...this.addFormData,
            imgUrl
          }
          addMaterial(requestBody).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
          })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    fetchMaterialTypeList().then(res => {
      this.mateTypeList = res.data
    })
  }
}
</script>
<style lang="scss">
.text-header {
  text-align: center;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 18px;
}
.dialog-footer {
  text-align: center;
}
.upload-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
