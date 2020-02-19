<template>
  <d2-container>
    <template slot="header">
      <el-row>
        <el-col :span="12">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="queryFormData.text" placeholder="请输入关键词" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-button type="success" @click="$router.push('/task_add')">添加任务</el-button>
          <el-button type="danger" @click="onDeletes()">批量删除</el-button>
          <el-button type="primary" @click="onExportExcel">导出Excel</el-button>
        </el-col>
      </el-row>
    </template>
    <el-table
      v-loading="tableLoading"
      :data="listData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="onSelection"
      max-height="730"
    >
      <el-table-column type="selection" width="55" fixed></el-table-column>
      <el-table-column label="工段" width="80" fixed>
        <template slot-scope="{row}">{{row.department.departmentName}}</template>
      </el-table-column>
      <el-table-column label="任务编号" width="80" fixed>
        <template slot-scope="{row}">{{row.department.initial+row.taskCode}}</template>
      </el-table-column>
      <el-table-column label="数量" prop="number" width="60" fixed></el-table-column>
      <el-table-column label="联系人" prop="linkman" width="80" fixed></el-table-column>
      <el-table-column label="计划工时" prop="planDuration" width="90" fixed></el-table-column>
      <el-table-column label="工作类型" width="120" fixed show-overflow-tooltip>
        <template slot-scope="{row}">{{row.workType.workTypeName}}</template>
      </el-table-column>
      <el-table-column label="计划完成周期" width="120" fixed>
        <template slot-scope="{row}">{{row|toOutPlanWeek}}</template>
      </el-table-column>
      <el-table-column label="状态" width="80" fixed>
        <template slot-scope="{row}">{{row.status|toOutStatusText}}</template>
      </el-table-column>
      <el-table-column prop="taskDescribe" label="任务描述" width="120" fixed show-overflow-tooltip></el-table-column>
      <el-table-column prop="remarks" label="备注" width="100" fixed show-overflow-tooltip></el-table-column>
      <el-table-column
        v-for="(weekLabel,index) in weeks"
        :label="`KW${weekLabel}`"
        :key="weekLabel"
        width="60"
      >
        <template slot-scope="{row}">
          <el-tag
            v-if="row.weekDraw &&row.weekDraw.startWeekDraw <= index+1 && row.weekDraw.endWeekDraw >= index+1"
            :type="row.status?row.status===1?'success':'':'warning'"
            effect="dark"
          >{{ row.weekDraw.workHours}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="{row}">
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
import {
  fetchList as fetchTaskList,
  deleteByIds,
  exportExcel
} from '@api/task.js'
export default {
  name: 'taskList',
  components: {
    Pagination
  },
  data () {
    return {
      tableLoading: false,
      queryFormData: {
        text: ''
      },
      listData: null,
      listTotal: 0,
      query: {
        current: 1,
        size: 20,
        text: ''
      },
      selectedIds: null
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    onSearch () {
      this.query.text = this.queryFormData.text
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
    onExportExcel () {
      let params = {}
      if (this.selectedIds && this.selectedIds.length) {
        params.id = this.selectedIds.map(item => item.id)
      }
      exportExcel(params).then(res => {
        var tempwindow = window.open()
        tempwindow.location.href =
          '/excel/download?type=2&file_name=' + res.msg
      })
    },
    getData () {
      this.tableLoading = true
      let params = {
        page: this.query.current,
        limit: this.query.size,
        status: this.query.status
      }
      if (this.query.text) {
        params.query_text = this.query.text
      }
      fetchTaskList(params)
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
    }
  },
  computed: {
    weeks () {
      return Array.from(new Array(52 + 1).keys()).slice(1)
    }
  },
  filters: {
    toOutPlanWeek (value) {
      const { startYear, endYear, startWeek, endWeek } = value
      let str = ''
      if (startYear === endYear) {
        str = `${startYear}_`
        if (startWeek === endWeek) {
          str += `KW${startWeek}`
        } else {
          str += `KW${startWeek}_KW${endWeek}`
        }
      } else {
        str = `${startYear}_KW${startWeek}_KW${endWeek}`
      }
      return str
    },
    toOutStatusText (value) {
      let statusText = ''
      switch (value) {
        case 0:
          statusText = '等待'
          break
        case 1:
          statusText = '完成'
          break
        default:
          statusText = '其他'
      }
      return statusText
    }
  }
}
</script>
