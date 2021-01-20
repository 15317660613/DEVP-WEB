<template>
  <div class="flexBlock">
    <div class="content">
      <el-row class="content-row backgroundColorFFF">
        <div style="float: left"><span style="font-weight: bold;font-size: 14px;margin-right: 10px">车辆管理</span>
         <!-- <span style="color:#8F9399;font-size: 12px;letter-spacing: 2px">
        已选择{{selitme}}项</span>-->
        </div>
        <div style="float: right">
          <el-input size="small" v-model="bicycleSearch" placeholder="请输入VIN码" style="width: 200px;margin-right: 10px"></el-input>

          <el-button size="small" type="primary" @click="getList">搜索</el-button>
        </div>

<!--        <el-col :span="24">-->
<!--          <div class="lineBlock">-->
<!--            <div style="padding-left:3%"><img src="@/assets/img/shape.png"> 已选择 <span style="color:#1890FF">{{selitme}}</span> 项</div>-->
<!--          </div>-->
<!--        </el-col>-->
        <el-col :span="24" style="margin-top:10px;">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
            stripe
            border
            header-row-class-name="tableHeaderStyle"
            @selection-change="handleSelectionChange">
<!--            <el-table-column-->
<!--              align="center"-->
<!--              type="selection"-->
<!--              style="width: 2%">-->
<!--            </el-table-column>-->
            <el-table-column
              align="center"
              prop="tenantName"
              label="车企用户"
              style="width: 20%">
            </el-table-column>
            <el-table-column
              align="center"
              prop="vehicleNum"
              label="车牌号"
              style="width: 15%">
            </el-table-column>
            <el-table-column
              align="center"
              prop="vehicleModelId"
              label="车型编号"
              style="width: 15%">
            </el-table-column>
            <el-table-column
              align="center"
              prop="vin"
              label="车辆VIN码"
              style="width: 15%">
            </el-table-column>
            <el-table-column
              align="center"
              prop="states"
              label="审批状态"
              width="120">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="goBicycle(scope.row.vin)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <pagination v-show="total>0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                        @pagination="getList()"/>
            <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="prev, pager, next,sizes, jumper"
                :total="total">
              </el-pagination> -->
          </div>

        </el-col>
      </el-row>


    </div>
  </div>
</template>

<script>
    import {getBicycleList} from "@/assets/api/bicycleList.js";
    import Pagination from '@/components/common/Pagination'

    export default {
        name: "bicycleList",
        components: {
            Pagination
        },
        data() {
            let self = this;
            return {
                screen: 1,
                selitme: 0,
                tableData: [],
                bicycleSearch: '',
                pageSize: 10,
                currentPage: 1,
                total: 100,
                vin: '',
            };
        },
        methods: {
            handleSelectionChange(val) {
                this.selitme = val.length;

                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                this.getList();
            },
            goBicycle(data) {
                this.$router.push({
                    name: "Bicycle",
                    query: {vin: data}
                });
            },

            getList() {
                getBicycleList({
                    page: {
                        current: this.currentPage,
                        size: this.pageSize,

                    },
                    querys: [
                        {
                            like: {
                                vin: this.bicycleSearch,
                                status: '1'
                            }

                        },
                    ],
                })
                    .then(resp => {
                        this.tableData = [];
                        console.log(resp);
                        this.total = parseInt(resp.data.total);
                        this.currentPage = parseInt(resp.data.current);
                        this.pageSize = parseInt(resp.data.size);

                        resp.data.records.forEach(element => {
                            let states = '';
                            switch (element.status) {
                                case '0':
                                    states = '待审核';
                                    break;
                                case '1':
                                    states = '批准';
                                    break;
                                case '2':
                                    states = '拒绝';
                                    break;
                                case '3':
                                    states = '审核中';
                                    break;
                            }
                            this.tableData.push({
                                'tenantName': element.tenantName == null ? '一' : element.tenantName,
                                'vehicleNum': element.vehicleNum == null ? '一' : element.vehicleNum,
                                'vehicleModelId': element.vehicleModelId == null ? '一' : element.vehicleModelId,
                                'vin': element.vin == null ? '一' : element.vin,
                                'states': element.status == null ? '一' : states
                            });
                        });
                    })

                    .catch(error => {
                        this.$message.error("查询失败");
                    });
            },

        },
        computed: {},
        watch: {},

        filters: {},

        created() {

        },

        mounted() {
            this.getList();
        },

    };
</script>

<style lang='less' scoped>
  img {
    vertical-align: middle;
  }

  .flexBlock {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .content {
    width: 100%;
    height: 99%;
    overflow: auto;
    background-color: #fff;
    margin: 0 0.5% 0.5% 0.5%;
  }

  .content-rowTop {
    margin: 0.5%;
  }

  .content-row {
    margin: 0!important;
    padding: 15px;
    padding-top: 1%;
  }

  .backgroundColorFFF {
    background-color: #fff;
  }

  .lineBlock {
    background-color: #E6F7FF;
    border: #BAE7FF solid 1px;
    padding: 1% 0;
    border-radius: 5px;
    margin-top: 1%;
  }
</style>
