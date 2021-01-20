<template>
    <div class="historyTaskTable">
        <el-row class="taskCard">
            <div class="head-title">
                <h3>我的已发
                    <el-checkbox v-model="checked">包含已完成流程</el-checkbox>
                    <div class="selectTask">
                    <el-input
                        placeholder="请输入任务名称"
                        prefix-icon="el-icon-search"
                        clearable
                        v-model="input"
                        >
                    </el-input>
                  </div>
                </h3>
                <el-divider></el-divider>
            </div>
            <div class = "demo">
                <el-row>
                    <table-render :tableData="this.tableData" :tableType="this.tableType" :input="this.input"></table-render>
                    <page-render :pageData="this.pageData" :setHistoryTask="this.setRepositoryTask"></page-render>
                </el-row>
            </div>
        </el-row>
    </div>
</template>

<script>
import table from '@/components/process/Table'
import page from '@/components/process/Page'
// import { getRepositoryTask } from '@/api'

export default {
  data () {
    return {
      tableData: [],
      pageData: [],
      tableType: 'RepositoryTask',
      input: '',
      checked: true
    }
  },
  created () {
    this.setRepositoryTask(1, 10)
  },
  methods: {
    /* setRepositoryTask (pageNo, pageSize) {
      getRepositoryTask({
        pageNo: pageNo,
        pageSize: pageSize
      }).then(res => {
        if (res.data.list.length > 0) {
          let list = res.data.list
          for (let i = 0; i < res.data.list.length; i++) {
            if (list[i].status) {
              list[i].status = '已办'
            } else {
              list[i].status = '待办'
            }
            if (list[i].createTimeStr) {
              list[i].createTimeStr = list[i].createTimeStr.split(' ')[0]
            }
            if (list[i].finishTimeStr) {
              list[i].finishTimeStr = list[i].finishTimeStr.split(' ')[0]
            }
          }
        }
        this.tableData = res.data.list
        this.pageData = res.data
      })
    } */
  },
  components: {
    'table-render': table,
    'page-render': page
  }
}
</script>

<style scoped>
.historyTaskTable {
    background: #f0f2f5;
    padding: 10px;
}
.head-title {
  padding-top: 18px;
  font-size: 16px;
  font-weight: bold;
  padding-left: 20px;
}
.taskCard{
    background: white;
}
.demo {
    padding: 20px;
}
.selectTask {
    width: 215px;
    float: right;
    margin-top: -10px;
    margin-right: 20px;
}
</style>

/* 覆盖样式 */
<style>
.el-divider--horizontal{
    margin: 24px 0 0 0 !important;
}
.el-table__row td{
    padding:8px 0;
}
.head-title .el-checkbox {
    margin-left: 20px;
}
</style>
