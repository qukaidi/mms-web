<template>
  <d2-container>
    <template slot="header">角色列表</template>
    <div class="demo-input-suffix search-input">
      <el-input placeholder="请输入角色名" v-model="input">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="序号" sortable width="100"></el-table-column>
      <el-table-column prop="name" label="角色名称" sortable></el-table-column>
      <el-table-column prop="create" label="创建时间" sortable></el-table-column>
      <el-table-column prop="update" label="更新时间" sortable></el-table-column>
      <el-table-column label="操作">
        <!-- <el-button icon="el-icon-edit" @click="outerVisible = true">编辑</el-button> -->
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40,50,60,70,80,90]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      ></el-pagination>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: "page3",
  data() {
    return {
      currentPage: 1,
      input:"",
      tableData: [
        {
          date: "1",
          name: "工长",
          create: "2018-12-04",
          update: "2018-12-04"
        },
        {
          date: "2",
          name: "员工",
          create: "2018-12-08",
          update: "2018-12-09"
        },
        {
          date: "3",
          name: "工长",
          create: "2018-12-05",
          update: "2018-12-06"
        },
        {
          date: "4",
          name: "员工",
          create: "2018-12-04",
          update: "2018-12-05"
        }
      ]
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style lang="scss">
.search-input{
  width: 250px;
  margin-bottom: 20px;
}
</style>
