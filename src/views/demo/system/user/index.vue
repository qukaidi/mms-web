<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryFormData.text" placeholder="请输入关键词" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-button type="info" icon="el-icon-edit" class="button-mb" @click="addVisible=true">添加用户</el-button>
    <el-button type="primary" icon="el-icon-delete" class="button-mb" @click="onDeletes()">批量删除</el-button>
    <el-table
      :data="listData"
      border
      style="width: 100%"
      v-loading="tableLoading"
      tooltip-effect="dark"
      @selection-change="onSelection"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" sortable width="100">
        <template slot-scope="{row}">{{row.id}}</template>
      </el-table-column>
      <el-table-column label="角色名称" sortable>
        <template slot-scope="{row}">{{row.username}}</template>
      </el-table-column>
      <el-table-column label="创建时间" sortable>
        <template slot-scope="{row}">{{row.gmtCreate|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="更新时间" sortable>
        <template slot-scope="{row}">{{row.gmtUpdate|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="onDeletes(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <pagination
        :total="listTotal"
        :current="query.current"
        :size="query.size"
        @currentChange="onCurrentChange"
        @sizeChange="onSizeChange"
      ></pagination>
    </template>
    <el-dialog title="添加用户" :visible.sync="addVisible" width="20%" :before-close="handleClose">
      <span>
        <el-form label-position="right" label-width="80px">
          <el-form-item label="登陆名">
            <el-input placeholder="将会成为您唯一的登入名" v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="sizeForm.type">
              <el-checkbox-button label="厂长" name="type"></el-checkbox-button>
              <el-checkbox-button label="员工" name="type"></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="密码">
            <el-input placeholder="6到16个字符" show-password v-model="addFormData.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input placeholder="6到16个字符" show-password v-model="verifypassword"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="outerVisible" width="20%" :before-close="handleClose">
      <span>
        <el-form label-position="right" label-width="60px">
          <el-form-item label="登陆名">
            <el-input placeholder="将会成为您唯一的登入名" v-model="input"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="sizeForm.type">
              <el-checkbox-button label="厂长" name="type"></el-checkbox-button>
              <el-checkbox-button label="员工" name="type"></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="outerVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import {
  fetchList as fetchUserList,
  deleteUserIds,
  addUser
} from "@api/userlist.js";
export default {
  name: "user-list",
  components: {
    Pagination
  },
  data() {
    return {
      outerVisible: false,
      addVisible: false,
      currentPage: 1,
      input: "",
      verifypassword: "",
      addFormData: {
        username: '',
        password: '',
      },
      sizeForm: {
        type: []
      },
      listData: null,
      listTotal: 0,
      queryFormData: {
        text: ""
      },
      tableLoading: false,
      query: {
        current: 1,
        size: 5,
        text: ""
      },
      selectedIds: null
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onSearch() {
      this.query.text = this.queryFormData.text;
      this.initParams();
      this.getData();
    },
    getData() {
      this.tableLoading = true;
      let params = {
        page: this.query.current,
        limit: this.query.size,
        status: this.query.status
      };
      if (this.query.text) {
        params.query_text = this.query.text;
      }
      fetchUserList(params)
        .then(res => {
          this.listData = res.data;
          this.listTotal = res.total;
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
    onCurrentChange(value) {
      this.query.current = value;
      this.getData();
    },
    onSizeChange(value) {
      this.query.size = value;
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
              deleteUserIds(idList).then(res => {
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
    onSelection(selection) {
      this.selectedIds = selection;
    },
    onSubmit() {
      let requestBody = {};
      addUser(requestBody).then(res => {
        console.log(res)
        this.$message({
          type: "success",
          message: res.msg
        });
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss">
.search-input {
  width: 250px;
  margin-bottom: 20px;
}
</style>
