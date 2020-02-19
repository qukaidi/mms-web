<template>
  <d2-container>
    <el-form :model="addFormData" ref="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark text-header">任务界面</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工段" prop="departmentId">
            <el-select v-model="addFormData.departmentId" placeholder="请选择一个部门" >
               <el-option  v-for="depart in departList" :key="depart.id" :label="depart.departmentName" :value="depart.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作类型" prop="workTypeId">
            <el-select v-model="addFormData.workTypeId" placeholder="请选择工作类型">
              <el-option  v-for="workType in workTypeList" :key="workType.id" :label="workType.workTypeName" :value="workType.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="任务编号">
            <el-input disabled placeholder="任务自动编码生成"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model="addFormData.linkman"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划工时" prop="planDuration">
            <el-input v-model.number="addFormData.planDuration" step="1234"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数量" prop="number">
            <el-input v-model.number="addFormData.number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="状态">
            <el-radio-group v-model="addFormData.status">
              <el-radio :label="0">等待</el-radio>
              <el-radio :label="2">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划完成周期" prop="line">
            <el-input v-model="addFormData.line"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="任务描述" prop="taskDescribe">
            <el-input type="textarea" :rows="2" v-model="addFormData.taskDescribe"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input type="textarea" :rows="2" v-model="addFormData.remarks"></el-input>
          </el-form-item>
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
import {
  fetchList as fetchDepartList
} from '@api/department.js'
import {
  fetchList as fetchWorkTypeList
} from '@api/workType.js'
import {
  add as addTask
} from '@api/task.js'
import { mapActions } from 'vuex'
import { checkIsNum, checkIsLine } from '@/plugin/checkRules.js'
import parseStrToWeekObj from '@/plugin/weekUtils'
export default {
  name: 'taskAdd',
  data () {
    return {
      departList: null,
      workTypeList: null,
      addFormData: {
        departmentId: '',
        workTypeId: '',
        taskCode: '',
        linkman: '',
        planDuration: '',
        number: '',
        status: 0,
        line: '',
        taskDescribe: '',
        remarks: ''
      },
      rules: {
        departmentId: [
          { required: true, message: '请选择工段', trigger: 'change' }
        ],
        workTypeId: [
          { required: true, message: '请选择工作类型', trigger: 'change' }
        ],
        linkman: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        planDuration: [
          { required: true,
            message: '请输入计划工时',
            trigger: 'blur' },
          { validator: checkIsNum, trigger: 'blur' }
        ],
        number: [ { required: true,
          message: '请输入数量',
          trigger: 'blur' },
        { validator: checkIsNum, trigger: 'blur' }],
        line: [
          { required: true,
            message: '请输入计划完成周期',
            trigger: 'blur' },
          { validator: checkIsLine, trigger: 'blur' }
        ],
        taskDescribe: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      // this.close({
      // tagName: '/task-add' })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let { addFormData } = this
          let weekObj = parseStrToWeekObj(addFormData.line)
          if (!weekObj) {
            this.$message('格式不正确')
            return false
          }
          let requestBody = {
            department: {
              id: addFormData.departmentId
            },
            linkman: addFormData.linkman,
            number: addFormData.number,
            planDuration: addFormData.planDuration,
            status: addFormData.status,
            taskDescribe: addFormData.taskDescribe,
            workType: {
              id: addFormData.workTypeId
            },
            startYear: weekObj.year,
            endYear: weekObj.year,
            startWeek: weekObj.startWeek,
            endWeek: weekObj.endWeek
          }
          addTask(requestBody).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
          })
        } else {
          return false
        }
      })
    },
    ...mapActions('d2admin/page', [
      'close'
    ])
  },
  mounted () {
    fetchWorkTypeList().then(res => {
      this.workTypeList = res.data
    })
    fetchDepartList().then(res => {
      this.departList = res.data
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
