<template>
  <d2-container>
    <template slot="header">字典列表</template>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="序号" sortable width="100"></el-table-column>
      <el-table-column prop="name" label="字典名称" sortable></el-table-column>
      <el-table-column prop="type" label="字典类型" sortable></el-table-column>
      <el-table-column prop="remark" label="备注" sortable></el-table-column>
      <el-table-column label="操作">
        <el-button icon="el-icon-edit" @click="outerVisible = true">编辑</el-button>
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

    <el-dialog title="修改列表" :visible.sync="outerVisible" width="60%" :before-close="handleClose">
      <span>
        <el-button icon="el-icon-circle-plus" @click="innerVisible = true" class="button-mb"></el-button>
      </span>
      <span>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="序号" sortable width="100"></el-table-column>
          <el-table-column prop="name" label="名称" sortable></el-table-column>
          <el-table-column prop="type" label="归属部门" sortable></el-table-column>
          <el-table-column prop="remark" label="首字字母" sortable></el-table-column>
          <el-table-column label="操作" min-width="150">
            <el-button icon="el-icon-edit" @click="fixerVisible = true">编辑</el-button>
            <el-button icon="el-icon-delete">删除</el-button>
          </el-table-column>
        </el-table>
      </span>
      <!-- 添加弹出框 -->
      <el-dialog
        title="信息"
        :visible.sync="innerVisible"
        width="40%"
        :before-close="handleClose"
        append-to-body
      >
        <el-form label-position="right" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="归属部门">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="任务代码首字母">
            <el-input v-model="input"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改弹出框 -->
      <el-dialog
        title="信息"
        :visible.sync="fixerVisible"
        width="40%"
        :before-close="handleClose"
        append-to-body
      >
        <el-form label-position="right" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="一级部门">
            <el-input v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="任务代码首字母">
            <el-input v-model="input"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fixerVisible = false">取 消</el-button>
          <el-button type="primary" @click="fixerVisible = false">确 定修改</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="outerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
export default {
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      fixerVisible: false,
      currentPage: 1,
      input:"",
      tableData: [
        {
          date: "1",
          name: "department",
          type: "{id:value}",
          remark: "需求部门字典"
        },
        {
          date: "2",
          name: "workType",
          type: "{id:value}",
          remark: "工作类型字典"
        },
        {
          date: "3",
          name: "materialType",
          type: "{id:value}",
          remark: "材料类型字典"
        },
        {
          date: "4",
          name: "project",
          type: "{id:value}",
          remark: "项目字典"
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
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>
<style lang="scss">
.el-table th {
  background: #f5f7fa;
}
.button-mb {
  margin-bottom: 20px;
}
</style>
