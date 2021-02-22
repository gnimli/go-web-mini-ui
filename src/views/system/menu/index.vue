<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="ID" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip prop="title" label="菜单标题" width="150" />
        <el-table-column show-overflow-tooltip prop="name" label="名称" />
        <el-table-column show-overflow-tooltip prop="icon" label="图标" />
        <el-table-column show-overflow-tooltip prop="path" label="访问路径" />
        <el-table-column show-overflow-tooltip prop="component" label="组件路径" />
        <el-table-column show-overflow-tooltip prop="redirect" label="重定向" />
        <el-table-column show-overflow-tooltip prop="sort" label="排序" />
        <el-table-column show-overflow-tooltip prop="status" label="禁用" />
        <el-table-column show-overflow-tooltip prop="hidden" label="隐藏" />
        <el-table-column show-overflow-tooltip prop="noCache" label="缓存" />
        <el-table-column show-overflow-tooltip prop="activeMenu" label="高亮菜单" />
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

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model.trim="dialogFormData.title" placeholder="菜单标题" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="名称" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model.trim="dialogFormData.icon" placeholder="图标" />
          </el-form-item>
          <el-form-item label="访问路径" prop="path">
            <el-input v-model.trim="dialogFormData.path" placeholder="访问路径" />
          </el-form-item>
          <el-form-item label="组件路径" prop="component">
            <el-input v-model.trim="dialogFormData.component" placeholder="组件路径" />
          </el-form-item>
          <el-form-item label="重定向" prop="redirect">
            <el-input v-model.trim="dialogFormData.redirect" placeholder="重定向" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.trim="dialogFormData.sort" placeholder="排序" />
          </el-form-item>
          <el-form-item label="禁用" prop="status">
            <el-input v-model.trim="dialogFormData.status" placeholder="禁用" />
          </el-form-item>
          <el-form-item label="隐藏" prop="hidden">
            <el-input v-model.trim="dialogFormData.hidden" placeholder="隐藏" />
          </el-form-item>
          <el-form-item label="缓存" prop="noCache">
            <el-input v-model.trim="dialogFormData.noCache" placeholder="缓存" />
          </el-form-item>
          <el-form-item label="高亮菜单" prop="activeMenu">
            <el-input v-model.trim="dialogFormData.activeMenu" placeholder="高亮菜单" />
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
import { getMenuTree, createMenu, updateMenuById, batchDeleteMenuByIds } from '@/api/system/menu'

export default {
  name: 'Menu',
  data() {
    return {
      // 表格数据
      tableData: [],
      loading: false,

      // dialog对话框
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        title: '',
        name: '',
        icon: '',
        path: '',
        component: '',
        redirect: '',
        sort: '',
        status: '',
        hidden: '',
        noCache: '',
        activeMenu: ''
      },
      dialogFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        icon: [
          { required: false, message: '请输入图标', trigger: 'blur' },
          { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入访问路径', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        component: [
          { required: false, message: '请输入组件路径', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        redirect: [
          { required: false, message: '请输入重定向', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: false, message: '请输入排序', trigger: 'blur' },
          { min: 1, max: 999, message: '长度在 1 到 999 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '禁用', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        hidden: [
          { required: true, message: '隐藏', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        noCache: [
          { required: true, message: '缓存', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        activeMenu: [
          { required: false, message: '请输入高亮菜单', trigger: 'blur' },
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

    // 获取表格数据
    async getTableData() {
      this.loading = true
      const res = await getMenuTree()
      console.log('getMenuTree---')
      console.log(res)

      if (res.code !== 200) {
        this.loading = false
        return this.$message({
          showClose: true,
          message: res.message,
          type: 'error'
        })
      }
      this.tableData = res.data.menuTree
      this.loading = false
    },

    // 新增
    create() {
      this.dialogFormTitle = '新增菜单'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // 修改
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.title = row.title
      this.dialogFormData.name = row.name
      this.dialogFormData.icon = row.icon
      this.dialogFormData.path = row.path
      this.dialogFormData.component = row.component
      this.dialogFormData.redirect = row.redirect
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status
      this.dialogFormData.hidden = row.hidden
      this.dialogFormData.noCache = row.noCache
      this.dialogFormData.activeMenu = row.activeMenu

      this.dialogFormTitle = '修改菜单'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.loading = true
          if (this.dialogType === 'create') {
            const { code, message } = await createMenu(this.dialogFormData)
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
            const { code, message } = await updateMenuById(this.dialogFormData.ID, this.dialogFormData)
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
            type: 'success'
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
        path: '',
        category: '',
        method: '',
        desc: ''
      }
    },

    // 批量删除
    async batchDelete() {
      this.loading = true
      const apiIds = []
      this.multipleSelection.forEach(x => {
        apiIds.push(x.ID)
      })
      const { code, message } = await batchDeleteMenuByIds({ menuIds: apiIds })
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
      const { code, message } = await batchDeleteMenuByIds({ menuIds: [Id] })
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
