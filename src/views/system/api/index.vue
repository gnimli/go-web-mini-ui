<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="访问路径">
          <el-input v-model="params.path" placeholder="访问路径" />
        </el-form-item>
        <el-form-item label="所属类别">
          <el-input v-model="params.category" placeholder="所属类别" />
        </el-form-item>
        <el-form-item label="请求方法">
          <el-select v-model="params.method" placeholder="请求方式">
            <el-option label="GET[获取资源]" value="GET" />
            <el-option label="POST[新增资源]" value="POST" />
            <el-option label="PUT[全部更新]" value="PUT" />
            <el-option label="PATCH[增量更新]" value="PATCH" />
            <el-option label="DELETE[删除资源]" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="params.creator" placeholder="创建人" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="path" label="访问路径" />
        <el-table-column prop="category" label="所属类别" />
        <el-table-column prop="method" label="请求方式" />
        <el-table-column prop="creator" label="创建人" />
        <el-table-column prop="desc" label="说明" />
      </el-table>

    </el-card>
  </div>
</template>

<script>
import { getApis } from '@/api/system/api'

export default {
  name: 'Api',
  data() {
    return {
      params: {
        path: '',
        method: '',
        category: '',
        creator: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    search() {
      this.getTableData()
    },

    async getTableData() {
      const res = await getApis(this.params)
      console.log('res---')
      console.log(res)
      if (res.code !== 200) {
        return this.$message({
          showClose: true,
          message: res.message,
          type: 'error'
        })
      }
      this.tableData = res.data.apis
      this.total = res.total
    }
  }
}
</script>

<style scoped>
.container-card{
  margin: 10px;
}
</style>
