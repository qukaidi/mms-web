<template>
  <d2-container>
    <el-form :model="addFormData" ref="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark text-header">增加采购单</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="项目" prop="projectId">
            <el-select v-model="addFormData.projectId" placeholder="请选择">
               <el-option  v-for="proj in projectList" :key="proj.id" :label="proj.projectName" :value="proj.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号" prop="postId">
            <el-input v-model.number="addFormData.postId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供货方" prop="supplierName">
            <el-input v-model="addFormData.supplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提单时间" prop="gmtBill">
            <el-date-picker v-model="addFormData.gmtBill" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="需求部门" prop="departmentId">
            <el-select v-model="addFormData.departmentId" placeholder="请选择">
               <el-option  v-for="dep in departList" :key="dep.id" :label="dep.departmentName" :value="dep.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="PO" prop="po">
            <el-input v-model.number="addFormData.po"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="成本(含税)" label-width="100px" prop="cost">
            <el-input v-model.number="addFormData.cost"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货日期" prop="gmtTake">
            <el-date-picker v-model="addFormData.gmtTake" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用途说明" prop="useIllustration">
            <el-input v-model="addFormData.useIllustration"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="相关任务代码(可选)" label-width="140" prop="taskRecordId">
            <el-select v-model="addFormData.taskRecordId" placeholder="请选择任务代码">
               <el-option  v-for="task in taskSelectList" :key="task[0]" :label="`${task[6]}${task[1]}`" :value="task[0]"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark text-header">使用材料</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :max-height="280"
            :data="materivalTableForm"
            style="width: 100%;"
            fit
            ref="table"
          >
            <el-table-column label="序号" width="90">
              <template slot-scope="{$index}">
                <el-button type="text" size="small">{{$index+1}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="材料厂内代码" width="130">
              <template slot-scope="{row}">
                <el-select v-model="row.id" placeholder="请选择" @change="onSelectMaterial(row)">
                   <el-option  v-for="material in materialList" :key="material.id" :label="`${material.materialCode} ${material.name}`" :value="material.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="尺寸或数量 " width="130">
              <template slot-scope="{row}">
                <el-input v-model="row.takeNum" :disabled="!row.id"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位 " width="180">
              <template slot-scope="{row}">
                <el-input v-model="row.unit" disabled></el-input>
                </template>
            </el-table-column>
            <el-table-column label="材料费（含税）¥" width="180">
              <template slot-scope="{row}">
                <el-input v-model="row.cost" :disabled="!row.id"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单价¥" width="180">
              <template slot-scope="{row}">
                {{row|toOutPrice}}
              </template>
            </el-table-column>
            <el-table-column label="收货状态" width="180">
              <template slot-scope="{row}">
                <el-tag :type="row.status?'success':'danger'">{{row.status?'正常':'异常'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="{$index}">
                <el-button type="success" @click="onAddToMaterial">新建</el-button>
                <el-button
                  v-if="materivalTableForm.length>1"
                  type="danger"
                  @click="onDeleteFromMaterial($index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="jisuan-box">
            <span>材料费总汇:</span>
            <el-input disabled :value="toOutTotalPrice"></el-input>
          </div>
        </el-col>
      </el-row>
      <br>
      <br>
    <div class="but">
      <el-button type="primary" @click="onSubmit">提 交</el-button>
    </div>
    </el-form>
  </d2-container>
</template>

<script>
import {
  fetchList as fetchProjectList
} from '@api/project.js'
import {
  fetchList as fetchMaterialList,
  fetchById as fetchMaterialById
} from '@api/material.js'
import {
  fetchList as fetchDepartList
} from '@api/department.js'
import {
  fetchSelectList as fetchTaskSelectList
} from '@api/task.js'
import {
  add as addPurchase
} from '@api/purchase.js'
import { checkIsNum } from '@/plugin/checkRules.js'
export default {
  name: 'purAdd',
  data () {
    return {
      projectList: null,
      materialList: null,
      departList: null,
      taskSelectList: null,
      addFormData: {
        status: 1,
        projectId: '',
        postId: '',
        supplierName: '',
        gmtBill: '',
        departmentId: '',
        po: '',
        cost: '',
        gmtTake: '',
        useIllustration: '',
        taskRecordId: ''
      },
      materivalTableForm: [
        {
          id: '',
          takeNum: '',
          cost: '',
          price: '',
          status: 1,
          unit: ''
        }
      ],
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        postId: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
          { validator: checkIsNum,
            trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供货方', trigger: 'blur' }
        ],
        gmtBill: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        po: [ { required: true, message: '请输入PO', trigger: 'blur' },
          { validator: checkIsNum, trigger: 'blur' }],
        cost: [
          { required: true, message: '请输入成本', trigger: 'blur' },
          { validator: checkIsNum, trigger: 'blur' }
        ],
        gmtTake: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        useIllustration: [
          { required: true, message: '请输入用途说明', trigger: 'blur' }],
        taskRecordId: [
          { required: true, message: '请选择任务代码', trigger: 'change' }]
      }
    }
  },
  mounted () {
    fetchProjectList().then(res => {
      this.projectList = res.data
    })
    fetchMaterialList().then(res => {
      this.materialList = res.data
    })
    fetchDepartList().then(res => {
      this.departList = res.data
    })
    fetchTaskSelectList().then(res => {
      this.taskSelectList = res.data
    })
  },
  filters: {
    toOutPrice: function (row) {
      if (!row.takeNum || !row.cost) {
        return ''
      }
      return parseFloat(row.cost) / parseFloat(row.takeNum)
    }
  },
  computed: {
    toOutTotalPrice () {
      let existMaterList = this.materivalTableForm.filter(item => item.takeNum && item.cost)
      if (!existMaterList.length) {
        return 0
      }
      let totalPrice = 0
      existMaterList.forEach(item => {
        totalPrice += parseFloat(item.cost) / parseFloat(item.takeNum)
      })
      return totalPrice
    }
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let requestBody = {
            takeRecords: this.materivalTableForm.map(item => {
              return {
                material: {
                  id: item.id
                },
                takeNum: item.takeNum,
                price: parseFloat(item.cost) / parseFloat(item.takeNum),
                takeRecordcol: item.cost
              }
            }),
            purchasePost: {
              ...this.addFormData,
              totalPrice: this.toOutTotalPrice,
              gmtTake: this.addFormData.gmtTake.getTime(),
              gmtBill: this.addFormData.gmtBill.getTime()
            }
          }
          addPurchase(requestBody).then(res => {
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
    onAddToMaterial () {
      this.materivalTableForm.push({
        id: '',
        takeNum: '',
        cost: '',
        price: '',
        status: 1,
        unit: ''
      })
    },
    onDeleteFromMaterial (index) {
      this.materivalTableForm.splice(index, 1)
    },
    onSelectMaterial (row) {
      fetchMaterialById(row.id).then(res => {
        row.unit = res.data.unit
      })
    }
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
.jisuan-box {
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 21px;
  font-weight: 700;
  & > span {
    flex-basis: 128px;
  }
  & > div {
    flex-basis: 200px;
  }
}
.jisuan-tip {
  text-align: center;
  color: red;
  margin-top: 15px;
}
.but{
  display: flex;
  justify-content: center;
}
</style>
