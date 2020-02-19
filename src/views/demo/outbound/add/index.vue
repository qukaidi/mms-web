<template>
  <d2-container>
    <el-form :model="addFormData" ref="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark text-header">新增工作日志界面</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="任务代码" prop="taskCode">
            <el-select v-model="addFormData.taskCode" placeholder="请选择" @change="onSelectTask">
              <el-option
                v-for="task in taskSelectList"
                :key="task[0]"
                :label="task[6]+task[1]"
                :value="task[0]"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制作者" prop="producerName">
            <el-select v-model="addFormData.producerName" multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="producer in producerList"
                :key="producer.id"
                :label="producer.producerName"
                :value="producer.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交付时间">
            <el-input disabled placeholder="提交自动生成"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工作类型">
            <el-input v-model="addFormData.workTypeId" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需求部门">
            <el-input v-model="addFormData.department" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input v-model="addFormData.num" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="制作工时(h)" prop="makeDuration">
            <el-input v-model.number="addFormData.makeDuration"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="节约成本¥" prop="costSaving">
            <el-input v-model.number="addFormData.costSaving"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="任务描述">
            <el-input type="textarea" :rows="2" v-model="addFormData.illustration" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input type="textarea" :rows="2" v-model="addFormData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <br />
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
                <el-select v-model="row.id" placeholder="请选择" @change="onSelectMaterial(row)" :disabled="!addFormData.department">
                  <el-option
                    v-for="material in materialList"
                    :key="material.id"
                    :label="`${material.materialCode} ${material.name}`"
                    :value="material.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="尺寸或数量 " width="130">
              <template slot-scope="{row}">
                <el-input v-model.number="row.num" :disabled="!row.id"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位 " width="180">
              <template slot-scope="{row}">
                <el-input v-model="row.unit" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column label="材料费（含税）¥" width="180">
              <template slot-scope="{row}">
                <el-input :value="row|toOutCost" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单价¥" width="180">
              <template slot-scope="{row}">
                <el-input v-model="row.price" :disabled="!row.id"></el-input></template>
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
          <br />
        </el-col>
      </el-row>
       <el-row type="flex" justify="center">
        <el-col :span="2">
          <span>材料费总汇:</span>
        </el-col>
        <el-col :span="3">
          <el-input disabled :value="toOutTotalPrice"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <br />
          <div class="grid-content bg-purple-dark text-header">上传照片</div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-upload
            ref="el-upload"
            :headers="headers"
            action="/api/pic/upload?type=cache"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <br />
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :span="4">
        <br>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>重置</el-button>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import util from '@/libs/util'
import { checkIsNum } from '@/plugin/checkRules.js'
import {
  fetchList as fetchMaterialList,
  fetchById as fetchMaterialById,
  fetchPrice
} from '@api/material.js'
import { fetchSelectList as fetchTaskSelectList } from '@api/task.js'
import { fetchList as fetchProducerList } from '@api/producer.js'
import { add as addWork } from '@api/work.js'
import { fetchMaterListByTaskId } from '@api/purchase.js'
export default {
  name: 'outboundAdd',
  data () {
    return {
      producerList: null,
      materialList: null,
      taskSelectList: null,
      addFormData: {
        taskCode: '',
        producerName: [],
        workTypeId: '',
        department: '',
        departmentId: '',
        num: '',
        makeDuration: '',
        costSaving: '',
        illustration: '',
        remark: ''
      },
      materivalTableForm: null,
      rules: {
        taskCode: [
          { required: true, message: '请选择任务代码', trigger: 'change' }
        ],
        producerName: [
          { type: 'array', required: true, message: '请至少选择一个制作者', trigger: 'change' }
        ],
        makeDuration: [
          { required: true,
            message: '请输入制作工时',
            trigger: 'blur' },
          { validator: checkIsNum, trigger: 'blur' }
        ],
        costSaving: [
          { required: true,
            message: '请输入节约成本',
            trigger: 'blur' },
          { validator: checkIsNum, trigger: 'blur' }
        ]
      },
      headers: {
        Authorization: util.cookies.get('token')
      }
    }
  },
  methods: {
    onAddToMaterial () {
      this.materivalTableForm.push(this.returnMaterialObj())
    },
    onDeleteFromMaterial (index) {
      this.materivalTableForm.splice(index, 1)
    },
    onSelectMaterial (row) {
      fetchMaterialById(row.id).then(res => {
        row.unit = res.data.unit
      })
      fetchPrice({
        mid: row.id,
        did: this.addFormData.departmentId
      }).then(res => {
        row.price = res.data
      })
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$refs['el-upload'].uploadFiles.length < 1) {
            this.$message('上传图片不能少于0')
            return false
          }
          let imgUrl = this.$refs['el-upload'].uploadFiles.map(item => item.response.data).join(';')
          let { addFormData, toOutTotalPrice, materivalTableForm } = this
          let workRecord = {
            costSaving: addFormData.costSaving,
            makeDuration: addFormData.makeDuration,
            taskRecord: {
              id: addFormData.taskCode
            },
            totalPrice: toOutTotalPrice,
            workRecordcol: addFormData.producerName.join(';'),
            remark: addFormData.remark,
            imgUrl
          }
          let useRecords = materivalTableForm.map(item => {
            return {
              material: {
                id: item.id
              },
              useNum: item.num,
              price: item.price,
              materialCost: item.price && item.num ? item.price * item.num : 0
            }
          })
          let requestBody = {
            useRecords: useRecords,
            workRecord: workRecord
          }
          addWork(requestBody).then(res => {
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
    onSelectTask (value) {
      let { addFormData } = this
      const result = this.taskSelectList.filter(item => item[0] === value)
      if (result && result.length) {
        this.materivalTableForm = [this.returnMaterialObj()]
        fetchMaterListByTaskId(value).then(res => {
          if (res.data && res.data.length) {
            this.materivalTableForm = res.data.map(item => {
              return {
                id: item.material.id,
                num: item.takeNum,
                cost: item.takeRecordcol,
                price: item.price,
                status: 1,
                unit: item.material.unit
              }
            })
          }
        })
        let item = result[0]
        addFormData.workTypeId = item[8]
        addFormData.department = item[5]
        addFormData.departmentId = item[4]
        addFormData.num = item[2]
        addFormData.illustration = item[3]
      }
    },
    returnMaterialObj () {
      return {
        id: '',
        num: '',
        price: '',
        status: 1,
        unit: ''
      }
    }
  },
  mounted () {
    this.materivalTableForm = [this.returnMaterialObj()]
    fetchProducerList().then(res => {
      this.producerList = res.data
    })
    fetchMaterialList().then(res => {
      this.materialList = res.data
    })
    fetchTaskSelectList().then(res => {
      this.taskSelectList = res.data
    })
  },
  filters: {
    toOutPrice (row) {
      if (!row.takeNum || !row.cost) {
        return ''
      }
      return parseFloat(row.cost) / parseFloat(row.takeNum)
    },
    toOutCost (row) {
      if (!row.num || !row.price) {
        return 0
      }
      return row.num * row.price
    }
  },
  computed: {
    toOutTotalPrice () {
      let existMaterList = this.materivalTableForm.filter(
        item => item.num && item.price
      )
      if (!existMaterList.length) {
        return 0
      }
      let totalPrice = 0
      existMaterList.forEach(item => {
        totalPrice += item.num * item.price
      })
      return totalPrice
    }
  }
}
</script>
