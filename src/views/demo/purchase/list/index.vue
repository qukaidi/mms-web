<template>
  <d2-container>
    <template slot="header">
      <el-row>
        <el-col :span="5">
          <el-button type="success" @click="$router.push('/pur_add')" size="small">新建采购单</el-button>
          <el-button type="danger" @click="onDeletes()" size="small">批量删除</el-button>
        </el-col>
        <el-col :span="19" class="header-col">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-radio v-model="queryFormData.status" :label="1">正常</el-radio>
              <el-radio v-model="queryFormData.status" :label="2">异常</el-radio>
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="queryFormData.department" placeholder="请选择" :clearable="true" size="small">
                <el-option
                  v-for="dep in departList"
                  :key="dep.id"
                  :label="dep.departmentName"
                  :value="dep.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提单时间">
              <el-date-picker
                v-model="queryFormData.data"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="small"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch" size="small">搜索</el-button>
            </el-form-item>
          </el-form>
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
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="序号" width="120"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="需求部门" width="120">
        <template slot-scope="scope">{{scope.$index}}</template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供货方" width="120"></el-table-column>
      <el-table-column label="提单时间" width="120">
        <template slot-scope="scope">{{scope.row.gmtTake|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="postId" label="订单号" width="120"></el-table-column>
      <el-table-column prop="po" label="PO" width="120"></el-table-column>
      <el-table-column prop="cost" label="金额" width="120"></el-table-column>
      <el-table-column label="收货时间" width="120">
        <template slot-scope="scope">{{scope.row.gmtBill|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="useIllustration" label="用途说明" width="120"></el-table-column>
      <el-table-column label="收货状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status?'success':'danger'">{{scope.row.status?'正常':'异常'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="onDeletes(scope.row.id)" size="mini">删除</el-button>
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
import { fetchList as fetchPurcList, deleteByIds } from '@api/purchase.js'
export default {
  name: 'purList',
  components: {
    Pagination
  },
  data () {
    return {
      tableLoading: false,
      queryFormData: {
        department: null,
        data: null,
        status: 1
      },
      listData: null,
      listTotal: 0,
      query: {
        current: 1,
        size: 20,
        department: null,
        data: null,
        status: 1
      },
      departList: null,
      selectedIds: null
    }
  },
  mounted () {
    this.getData()
    fetchDepartList().then(res => {
      this.departList = res.data
    })
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
      fetchPurcList(params)
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
    }
  }
}
</script>
<style lang="scss">
.header-col{
   display: flex;
   justify-content: right;
 }
</style>
