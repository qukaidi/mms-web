<template>
  <d2-container>
    <template slot="header">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true">
            <el-form-item label="部门">
              <el-select v-model="queryFormData.department" placeholder="请选择" :clearable="true">
                <el-option
                  v-for="dep in departList"
                  :key="dep.id"
                  :label="dep.departmentName"
                  :value="dep.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="制作时间">
              <el-date-picker
                v-model="queryFormData.data"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-button type="success" @click="$router.push('/outbound_add')">添加工作日志</el-button>
          <el-button type="danger" @click="onDeletes()">批量删除</el-button>
          <el-button type="primary" @click="onExportExcel()">
            <i class="el-icon-s-grid"></i>导出Excel
          </el-button>
        </el-col>
      </el-row>
    </template>

    <el-table
      v-loading="tableLoading"
      :data="listData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="onSelection"
      max-height="730"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column prop="id" label="序号" width="40"></el-table-column>
      <el-table-column prop="departmentName" label="需求部门" width="85"></el-table-column>
      <el-table-column prop="workTypeName" label="工作类型" width="120"></el-table-column>
      <el-table-column prop="totalPrice" label="金额" width="70"></el-table-column>
      <el-table-column label="照片" width="100">
        <template slot-scope="{row}">
          <el-image style="width: 60px; height: 60px" :src="row.imgUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="交付时间" width="90">
        <template slot-scope="{row}">{{row.gmtCreate|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="number" label="数量" width="60"></el-table-column>
      <el-table-column prop="makeDuration" label="制作工时" width="60"></el-table-column>
      <el-table-column prop="taskIllustration" label="任务描述" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="{row}">
          <el-button icon="el-icon-edit" circle></el-button>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="onDeletes(row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="listTotal"
      :current="query.current"
      :size="query.size"
      @currentChange="onCurrentChange"
      @sizeChange="onSizeChange"
    ></pagination>
  </d2-container>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
import { fetchList as fetchDepartList } from '@api/department.js'
import {
  fetchList as fetchWorkList,
  deleteByIds,
  exportExcel
} from '@api/work.js'
export default {
  name: 'outboundList',
  components: {
    Pagination
  },
  data () {
    return {
      tableLoading: false,
      queryFormData: {
        department: '',
        data: ''
      },
      listData: null,
      listTotal: 0,
      query: {
        current: 1,
        size: 20,
        department: null,
        data: null
      },
      departList: null,
      selectedIds: null
    }
  },
  methods: {
    getData () {
      this.tableLoading = true
      let params = {
        page: this.query.current,
        limit: this.query.size,
        status: this.query.status
      }
      if (this.query.department) {
        params.departmentId = this.query.department
      }
      if (this.query.data) {
        params.s = this.query.data[0] + ' 00:00:00'
        params.e = this.query.data[1] + ' 00:00:00'
      }
      fetchWorkList(params)
        .then(res => {
          this.listTotal = res.total
          this.listData = res.data
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    initParams () {
      this.query.current = 1
      this.query.size = 5
      this.listTotal = 0
    },
    onSearch () {
      this.query.department = this.queryFormData.department
      this.query.data = this.queryFormData.data
      this.query.status = this.queryFormData.status
      this.initParams()
      this.getData()
    },
    onDeletes (value) {
      let idList
      if (value) {
        idList = [value]
      } else {
        if (this.selectedIds && this.selectedIds.length) {
          idList = this.selectedIds.map(item => item.id)
        }
      }
      if (idList && idList.length) {
        this.$alert('确认要删除吗？', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              deleteByIds(idList).then(res => {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.initParams()
                this.getData()
              })
            } else {
              this.$message({
                type: 'warning',
                message: '取消删除'
              })
            }
          }
        })
      } else {
        this.$message({
          message: '未选中',
          type: 'warning'
        })
      }
    },
    onCurrentChange (value) {
      this.query.current = value
      this.getData()
    },
    onSizeChange (value) {
      this.query.size = value
      this.getData()
    },
    onSelection (selection) {
      this.selectedIds = selection
    },
    onExportExcel () {
      let params = {}
      if (this.selectedIds && this.selectedIds.length) {
        params.id = this.selectedIds.map(item => item.id)
      } else {
        if (this.query.department) {
          params.departmentId = this.query.department
        }
        if (this.query.data) {
          params.s = this.query.data[0] + ' 00:00:00'
          params.e = this.query.data[1] + ' 00:00:00'
        }
      }
      exportExcel(params).then(res => {
        var tempwindow = window.open()
        tempwindow.location.href =
          '/excel/download?type=1&file_name=' + res.msg
      })
    }
  },
  mounted () {
    this.getData()
    fetchDepartList().then(res => {
      this.departList = res.data
    })
  }
}
</script>
