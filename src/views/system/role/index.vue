<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model.trim="params.name" clearable placeholder="角色名称" @clear="search" />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model.trim="params.keyword" clearable placeholder="关键字" @clear="search" />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-select v-model.trim="params.status" clearable placeholder="角色状态" @change="search" @clear="search">
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="name" label="角色名称" />
        <el-table-column show-overflow-tooltip sortable prop="keyword" label="关键字" />
        <el-table-column show-overflow-tooltip sortable prop="sort" label="等级" />
        <el-table-column show-overflow-tooltip sortable prop="status" label="角色状态" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success':'danger'" disable-transitions>{{ scope.row.status === 1 ? '正常':'禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="creator" label="创建人" />
        <el-table-column show-overflow-tooltip sortable prop="desc" label="说明" />
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="删除" effect="dark" placement="top">
              <el-popconfirm title="确定删除吗？" @onConfirm="singleDelete(scope.row.ID)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[1, 5, 10, 30]"
        layout="total, prev, pager, next, sizes"
        background
        style="margin-top: 10px;float:right;margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="580px">
        <el-form ref="dialogForm" :inline="true" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="角色名称" style="width: 420px" />
          </el-form-item>
          <el-form-item label="关键字" prop="keyword">
            <el-input v-model.trim="dialogFormData.keyword" placeholder="关键字" style="width: 420px" />
          </el-form-item>
          <el-form-item label="角色状态" prop="status">
            <el-select v-model.trim="dialogFormData.status" placeholder="请选择角色状态" style="width: 180px">
              <el-option label="正常" value="1" />
              <el-option label="禁用" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="等级(1最高)" prop="sort">
            <el-input-number v-model.number="dialogFormData.sort" controls-position="right" :min="1" :max="999" />
          </el-form-item>
          <el-form-item label="说明" prop="desc">
            <el-input v-model.trim="dialogFormData.desc" style="width: 420px" type="textarea" placeholder="说明" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { getRoles, createRole, updateRoleById, batchDeleteRoleByIds } from '@/api/system/role'

export default {
  name: 'Role',
  data() {
    return {
      // 查询参数
      params: {
        name: '',
        keyword: '',
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      // dialog对话框
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        name: '',
        keyword: '',
        status: '1',
        sort: 999,
        desc: ''
      },
      dialogFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '请输入关键字', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '说明', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ]
      },

      // 删除按钮弹出框
      popoverVisible: false,
      // 表格多选
      multipleSelection: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 查询
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      const res = await getRoles(this.params)
      console.log('getRoles---')
      console.log(res)
      if (res.code !== 200) {
        this.loading = false
        return this.$message({
          showClose: true,
          message: res.message,
          type: 'error'
        })
      }
      this.tableData = res.data.roles
      this.total = res.data.total
      this.loading = false
    },

    // 新增
    create() {
      this.dialogFormTitle = '新增角色'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // 修改
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.name = row.name
      this.dialogFormData.keyword = row.keyword
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status + ''
      this.dialogFormData.desc = row.desc

      this.dialogFormTitle = '修改角色'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.loading = true

          this.dialogFormData.status = parseInt(this.dialogFormData.status)

          console.log('this.dialogFormData---')
          console.log(this.dialogFormData)

          if (this.dialogType === 'create') {
            const { code, message } = await createRole(this.dialogFormData)
            if (code !== 200) {
              this.loading = false
              return this.$message({
                showClose: true,
                message: message,
                type: 'error'
              })
            }
            this.loading = false
            this.resetForm()
            this.getTableData()
            this.$message({
              showClose: true,
              message: message,
              type: 'success'
            })
          } else if (this.dialogType === 'update') {
            const { code, message } = await updateRoleById(this.dialogFormData.ID, this.dialogFormData)
            if (code !== 200) {
              this.loading = false
              return this.$message({
                showClose: true,
                message: message,
                type: 'error'
              })
            }
            this.loading = false
            this.resetForm()
            this.getTableData()
            this.$message({
              showClose: true,
              message: message,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: '未知类型',
              type: 'error'
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '表单校验失败',
            type: 'error'
          })
          return false
        }
      })
    },

    // 提交表单
    cancelForm() {
      this.resetForm()
    },

    resetForm() {
      this.dialogFormVisible = false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        name: '',
        keyword: '',
        status: '1',
        sort: 999,
        desc: ''
      }
    },

    // 批量删除
    async batchDelete() {
      this.loading = true
      const roleIds = []
      this.multipleSelection.forEach(x => {
        roleIds.push(x.ID)
      })
      const { code, message } = await batchDeleteRoleByIds({ roleIds: roleIds })
      if (code !== 200) {
        this.loading = false
        return this.$message({
          showClose: true,
          message: message,
          type: 'error'
        })
      }
      this.loading = false
      this.getTableData()
      this.$message({
        showClose: true,
        message: message,
        type: 'success'
      })
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单个删除
    async singleDelete(Id) {
      this.loading = true
      const { code, message } = await batchDeleteRoleByIds({ roleIds: [Id] })
      if (code !== 200) {
        this.loading = false
        return this.$message({
          showClose: true,
          message: message,
          type: 'error'
        })
      }
      this.loading = false
      this.getTableData()
      this.$message({
        showClose: true,
        message: message,
        type: 'success'
      })
    },

    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
  .container-card{
    margin: 10px;
  }

  .delete-popover{
    margin-left: 10px;
  }
</style>
