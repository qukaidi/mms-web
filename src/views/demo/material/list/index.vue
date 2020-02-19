<template>
  <d2-container>
    <template slot="header">
      <el-row>
        <el-col :span="6">
          <el-button type="success" @click="$router.push('/material_add')" size="small">新建物料信息</el-button>
          <el-button type="danger" @click="onDeletes()" size="small">批量删除</el-button>
          <el-button type="primary" @click="onExportExcel" size="small">
            <i class="el-icon-s-grid"></i>导出Excel
          </el-button>
        </el-col>
        <el-col :span="18" class="header-col">
          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="queryFormData.text" placeholder="请输入关键词" size="small"></el-input>
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
      <el-table-column type="selection" width="40" fixed="left"></el-table-column>
      <el-table-column label="序号" width="50" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.id}}</template>
      </el-table-column>
      <el-table-column label="场内代码" width="80" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.materialCode}}</template>
      </el-table-column>
      <el-table-column label="类型" width="120" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.materialTypeName}}</template>
      </el-table-column>
      <el-table-column label="名称" width="120" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.name}}</template>
      </el-table-column>
      <el-table-column label="最低储备" width="100" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.minNum}}</template>
      </el-table-column>
      <el-table-column label="单位" width="40" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.unit}}</template>
      </el-table-column>
      <el-table-column label="照片" width="120" fixed="left">
        <template slot-scope="{row}">
          <el-image style="width: 60px; height: 60px" :src="row.vMaterial.imgUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" width="95" fixed="left">
        <template slot-scope="{row}">{{row.vMaterial.gmtUpdate|dateFormat}}</template>
      </el-table-column>
      <el-table-column
        :label="depart.departmentName"
        v-for="(depart,departIndex) in departmentList"
        :key="depart.id"
      >
        <el-table-column label="数量" width="70">
          <template slot-scope="{row}">
            <el-tag
              :type="row.departmentStorages[departIndex].num<1?'danger':'success'"
              effect="dark"
            >{{row.departmentStorages[departIndex].num}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="70">
          <template slot-scope="{row}">{{row.departmentStorages[departIndex].unitPrice|thousand}}</template>
        </el-table-column>
        <el-table-column label="总价" width="70">
          <template slot-scope="{row}">{{row.departmentStorages[departIndex].totalPrice|thousand}}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column fixed="right" label="平均单价" width="100">
        <template slot-scope="{row}">{{row.departmentStorages|toOutAvgPrice|thousand}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="现有数量" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.vMaterial|toNowNumColor" effect="dark">{{row.vMaterial.nowNum}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" size="small">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="onDeletes(row.vMaterial.id)"
            size="small"
          >删除</el-button>
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
import Pagination from "@/components/Pagination.vue";
import { fetchList as fetchDepartList } from "@api/department.js";
import {
  fetchListByDep as fetchMaterialListByDep,
  deleteByIds
} from "@api/material.js";
export default {
  name: "materialList",
  components: {
    Pagination
  },
  data() {
    return {
      tableLoading: false,
      queryFormData: {
        text: ""
      },
      departmentList: null,
      listData: null,
      listTotal: 0,
      query: {
        current: 1,
        size: 20,
        text: ""
      },
      selectedIds: null
    };
  },
  methods: {
    getData() {
      this.tableLoading = true;
      let params = {
        page: this.query.current,
        limit: this.query.size
      };
      if (this.query.text) {
        params.text = this.query.text;
      }
      fetchMaterialListByDep(params)
        .then(res => {
          this.listTotal = res.total;
          this.listData = res.data;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    initParams() {
      this.query.current = 1;
      this.query.size = 5;
      this.listTotal = 0;
    },
    onSearch() {
      this.query.text = this.queryFormData.text;
      this.initParams();
      this.getData();
    },
    onDeletes(value) {
      let idList;
      if (value) {
        idList = [value];
      } else {
        if (this.selectedIds && this.selectedIds.length) {
          idList = this.selectedIds.map(item => item.id);
        }
      }
      if (idList && idList.length) {
        this.$alert("确认要删除吗？", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            if (action === "confirm") {
              deleteByIds(idList).then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.initParams();
                this.getData();
              });
            } else {
              this.$message({
                type: "warning",
                message: "取消删除"
              });
            }
          }
        });
      } else {
        this.$message({
          message: "未选中",
          type: "warning"
        });
      }
    },
    onCurrentChange(value) {
      this.query.current = value;
      this.getData();
    },
    onSizeChange(value) {
      this.query.size = value;
      this.getData();
    },
    onSelection(selection) {
      this.selectedIds = selection;
    },
    onExportExcel() {}
  },
  mounted() {
    fetchDepartList().then(res => {
      this.departmentList = res.data;
    });
    this.getData();
  },
  filters: {
    toOutAvgPrice: function(value) {
      let price = 0;
      let count = 0;
      if (value && value.length) {
        value.forEach(item => {
          let result = parseFloat(item.unitPrice);
          if (result !== 0) {
            price += result;
            count++;
          }
        });
        if (count) {
          return price / count;
        }
      }
      return 0;
    },
    toNowNumColor(vMaterial) {
      let { nowNum, minNum } = vMaterial;
      if (nowNum <= minNum + 10 && nowNum > minNum) {
        return "warning";
      } else if (nowNum <= minNum) {
        return "danger";
      } else {
        return "success";
      }
    }
  }
};
</script>
