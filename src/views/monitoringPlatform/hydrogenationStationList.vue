<template>
  <div class="flexBlock">
    <div class="content">
      <!-- <el-row class="content-rowTop">
        <el-button ref="carInfo" type="primary">基本信息</el-button>
        <el-button>零部件</el-button>
        <el-button>车型</el-button>
        <el-button>车辆</el-button>
      </el-row> -->
      <el-row class="content-row backgroundColorFFF">
        <div style="float: left"><span style="font-weight: bold;font-size: 14px;margin-right: 10px">{{$store.state.dropdown.son}}</span>
        </div>
        <div style="float: right">
          <el-input size="small" v-model="hySearch" placeholder="请输入企业用户名" style="width:200px;margin-right: 12px;"></el-input>
          <el-button size="small" type="primary" @click="getList">搜索</el-button>
        </div>
        <el-col :span="24" style="margin-top:9px;">
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            border
            size="mini"
            height="calc(100vh - 210px)"
            header-row-class-name="tableHeaderStyle"
            :cell-style="{height:'35px',padding:'5px 0px'}"
            :header-cell-style="{background:'#f8f8f9'}"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" label="序号" width="60">
              <template slot-scope="scope">
                <span>{{ scope.$index+(page.current - 1) * page.size + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="tenantName" label="企业用户名" style="width: 20%"></el-table-column>
            <el-table-column align="center" prop="tenantCity" label="所属城市" style="width: 5%"></el-table-column>
            <el-table-column align="center" prop="tel" label="联系方式" style="width: 10%"></el-table-column>
            <el-table-column align="center" prop="contacts" label="联系人" style="width: 10%"></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" style="width: 10%"></el-table-column>
            <el-table-column align="center" prop="address" label="详细地址" style="width: 30%"></el-table-column>
            <el-table-column align="center" width="150" label="操作" style="width: 10%">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="goHydrogenationStation(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <pagination v-show="total>0" :total="total" :page.sync="page.current" :limit.sync="page.size" @pagination="getList"/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
    import {getStationList} from "@/assets/api/hydrogenationStationList.js";
    import Pagination from '@/components/common/Pagination'

    export default {
        name: "hydrogenationStationList",
        components: {
            Pagination
        },
        data() {
            let self = this;
            return {
                selitme: 0,
                tableData: [],
                hySearch: '',
                page: {
                    current: 1,
                    size: 10,
                },
                total: 0,
            };
        },
        methods: {
            handleSelectionChange(val) {
                this.selitme = val.length;

                this.multipleSelection = val;
            },
            goHydrogenationStation(data) {
                this.$router.push({
                    name: "HydrogenationStation",
                    query: {platformId: data.id},
                    params: {tenantName: data.tenantName}
                });
            },
            getList() {
                let obj = {}
                obj.page = this.page
                obj.querys = [{
                    likeLeft: {
                        tenantName: this.hySearch,
                    },
                    eq: {
                        tenantType: 6,
                    },

                }]
                getStationList(obj).then(resp => {
                    this.tableData = [];
                    this.total = parseInt(resp.data.total);
                    resp.data.records.forEach(element => {
                        this.tableData.push({
                            'id': element.id,
                            'tenantName': element.tenantName == null ? '一' : element.tenantName,
                            'tenantCity': element.tenantCity == null ? '一' : element.tenantCity,
                            'tel': element.tel == null ? '一' : element.tel,
                            'contacts': element.contacts == null ? '一' : element.contacts,
                            'email': element.email == null ? '一' : element.email,
                            'address': element.address == null ? '一' : element.address
                        });
                    });
                }).catch(error => {
                    this.$message.error("查询失败");
                });
            },
        },
        computed: {},
        watch: {},
        filters: {
            formatVehicleDuration(time) {
                if (time == "null" || time == undefined) {
                    return "-";
                } else {
                    return (time / 3600).toFixed(2);
                }
            }
        },
        created() {
            this.getList();
        },
        mounted() {
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
    height: calc(100vh - 80px);
    overflow: auto;
    background-color: #fff;
    margin: 0 10px 10px 10px;
  }

  .content-rowTop {
    margin: 8px;
  }

  .content-row {
    margin: 0;
    padding: 15px;
  }

  .backgroundColorFFF {
    background-color: #fff;
  }

  .lineBlock {
    background-color: #E6F7FF;
    border: #BAE7FF solid 1px;
    padding: 10px 0;
    border-radius: 5px;
    margin-top: 10px;
  }

  .pagination-container {
    padding: 15px 15px;
  }
</style>
