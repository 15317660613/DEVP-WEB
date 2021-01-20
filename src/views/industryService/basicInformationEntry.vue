<!-- 企业基本信息 -->
<template>
  <div class="content">
    <div style="width: 215px;position: absolute;top: 0;bottom:0;left: 15px;padding-top: 15px;border-right: 1px solid #EBEEF5;">
      <div style="font-weight: bold;font-size: 14px">{{$store.state.dropdown.son}}</div>
    <div class="nav">
      <div
        v-for="(item, index) in lbjList"
        :class="{active:istrue==index}"
        @click="toggleLBJ(index, item.type)"
      >{{ item.name }}</div>
    </div>
    </div>
    <div class="table-wrapper">
      <div style="float: left"><span style="font-weight: bold;font-size: 14px;margin-right: 10px">{{lbjList[istrue].name}}</span>
<!--        <span style="color:#8F9399;font-size: 12px;letter-spacing: 2px">已选择{{selitme}}项</span>-->
      </div>
      <div class="tool-btn-group">
        <div style="float: right">
          <el-input
            v-model.trim="modelSearch"
            placeholder="请输入生产企业"
            class="input-with-select"
            size="mini"
            style="width: 280px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="mini"
              type="primary"
              @click="handleFilter"
            >搜索</el-button>
          </el-input>
        </div>
      </div>
      <el-table
        ref="elTable"
        :data="tableData.records"
        height="calc(100vh - 200px)"
        border stripe
        style="width: 100%;"
        class="table-fixed"
        header-row-class-name="tableHeaderStyle"
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index+(queryObj.page.current - 1) * queryObj.page.size + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.tenantName }}</template>
        </el-table-column>
        <el-table-column label="城市" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.tenantCity }}</template>
        </el-table-column>
        <el-table-column label="联系人" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.contacts }}</template>
        </el-table-column>
        <el-table-column label="企业社会信用代码" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.creditCode }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" fixed="right">
          <template slot-scope="scope">
            <span
              v-if="scope.row.state===-2"
              class="statusCircle"
              style="background-color: #B6B6B6"
            />
            <span
              v-if="scope.row.state===-1"
              class="statusCircle"
              style="background-color: #3391EC"
            />
            <span
              v-if="scope.row.state===0"
              class="statusCircle"
              style="background-color: #FD472B"
            />
            <span
              v-if="scope.row.state===1"
              class="statusCircle"
              style="background-color: #00B589"
            />
            {{ scope.row.state | statusFilter }}
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
              @show="getProgressImageli(scope.row.id)"
            >
              <!--<el-timeline>
                <el-timeline-item
                  v-for="(item,index) in progressImageList"
                  :key="index"
                  :timestamp="item.ccTaskItems[0].dealTime"
                  placement="top"
                >
                    {{ item.ccTaskItems[0].assigneeRealName}}<br>
                    {{ item.ccTaskItems[0].remark }}

                </el-timeline-item>
              </el-timeline>-->
              <ul class="tips-content" v-if="progressImageList.length > 0">
                <li v-for="(item) in progressImageList" style="margin-top: 8px;">
                  <span style="font-size: 14px">{{ item.ccTaskItems[0].taskDefName }} - {{ item.ccTaskItems[0].assigneeRealName}}</span><br>
                  <span v-if="item.ccTaskItems[0].status===2">于{{item.ccTaskItems[0].dealTime }}</span>
                  <span v-else>暂无处理意见</span><br>
                  {{ item.ccTaskItems[0].remark }}
                </li>
              </ul>
              <div v-else>暂无数据</div>
              <i slot="reference" class="el-icon-caret-right" />
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          prop="columnProp"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDetail(scope.$index, scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryObj.page.current"
        :limit.sync="queryObj.page.size"
        @pagination="getLBJList()"
      />
    </div>

    <!-- 弹出框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editFormVisible"
      width="700px"
      :modal-append-to-body="false"
      :before-close="closeDialog"
    >
        <el-form ref="formEdit"
                 :model="formEdit"
                 class="formEdit"
                 :disabled="formEditDisabled"
                 :rules="rules"
                 label-width="150px">
        <el-form-item
            label="企业名称"
            prop="tenantName"
          >
            <el-input
              v-model="formEdit.tenantName"
              :title="formEdit.tenantName"
              maxlength="200"
              autocomplete="off"
            />
          </el-form-item>

        <el-form-item label="企业性质">
          <el-select v-model="formEdit.tenantType" placeholder="请选择类别" class="elSelect" @change="changeType">
            <el-option v-for="(item) in lbjList" :key="item.type" :label="item.name" :value="item.type" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input
            v-model="formEdit.contacts"
            :title="formEdit.contacts"
            maxlength="200"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="formEdit.email"
            :title="formEdit.email"
            maxlength="200"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="企业社会信用代码"
          prop="creditCode"
        >
          <el-input
            v-model="formEdit.creditCode"
            :title="formEdit.creditCode"
            maxlength="200"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="注册地"
        >
          <el-col :span="6">
            <el-select
              v-model="formEdit.provinceId"
              class="areaClass"
              filterable
              placeholder="请选择省份"
              @change="provinceChange"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="formEdit.cityId"
              class="areaClass"
              filterable
              placeholder="请选择城市"
              @change="cityChange"
            >
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="formEdit.areaId" class="areaClass" filterable placeholder="请选择区域">
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label prop="address">
          <input type="text" id="address" class="el-input__inner el-input" autocomplete="off"
                 :disabled="addressDisabled ? false : 'disabled'"
                 @input="autoSearch" v-model="formEdit.address"
                 :title="formEdit.address">
        </el-form-item>
        <el-form-item>
          <div class="addressMap" id="addressMap"></div>
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input
            v-model="formEdit.businessScope"
            :title="formEdit.businessScope"
            maxlength="200"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="企业名称" prop="businessScope">
          <el-input
            v-model="formEdit.tenantName"
            :title="formEdit.tenantName"
            maxlength="200"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-time-picker
            is-range
            :title="formEdit.businessHours"
            placeholder="选择时间"
            format="HH:mm"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input
            v-model="formEdit.tel"
            :title="formEdit.tel"
            maxlength="200"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="日加氢能力(kg)"  v-show="dailyShow">
          <el-input-number
            v-model="formEdit.daily"
            :title="formEdit.daily"
            autocomplete="off"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="加注能力(Mpa)" v-show="fillingShow">
          <el-select v-model="formEdit.filling" placeholder="请选择加注能力" class="elSelect">
            <el-option v-for="(item) in fillingList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="category" v-show="categoryShow">
          <el-select v-model="formEdit.category" placeholder="请选择类别" class="elSelect" >
            <el-option label="固定式加氢站" value="1">固定式加氢站</el-option>
            <el-option label="撬装式加氢站" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="uploadTitle">
          <el-input
            v-model="formEdit.attachment"
            :title="formEdit.attachment"
            v-show="false"
            maxlength="200"
            autocomplete="off"
          />
          <!--              <div v-show="formEdit.tenantType==='6'">-->
          <span class="fileName" v-if="formEdit.attachment">{{formEdit.attachment.fileName}}</span>
          <span class="fileName" >{{ this.fileName}}</span>
          <!--                <el-upload class="upload-demo" action="/api-server/upload" style="margin-left: 10px" :on-success="uploadSuccess"-->
          <el-upload class="upload-demo" action="/api/upload" :on-success="uploadSuccess"
                     :multiple="false" :show-file-list="false" :beforeUpload="beforeAvatarUpload">
            <el-button size="small" icon="el-icon-upload" type="primary" plain @click="changeUploadFileId(formEdit.id)">上传资质材料</el-button>
          </el-upload>
          <!--                <el-button size="small" icon="el-icon-delete" type="danger" plain style="margin: 0 10px;" @click="deleteUploadFile(formEdit)">删除</el-button>-->
          <p style="color:rgba(255,113,104,1)">*限制大小在200M以下，支持jpg，png，pdf</p>
          <!--              </div>-->
        </el-form-item>
      </el-form>
      <div v-if="dialogType!== 'see'" slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTenantListByPage, getTenantType, getAreaList } from '@/assets/api/basicInformationEntry'
import { getProgressImageData } from '@/assets/api/process'
import Pagination from '@/components/common/Pagination'
import AMap from "AMap";
import { mapState } from 'vuex'

export default {
  name: 'BasicInformationEntry',
  components: {
    Pagination
  },
  filters: {
    statusFilter (type) {
      // -2 草稿 -1待审核 0 禁用 1启用
      const keyValue = {
        '-2': '草稿',
        '-1': '待审核',
        0: '禁用',
        1: '启用'
      }
      return keyValue[type]
    }
  },
  data () {
    return {
      istrue: 0,
      lbjList: [],
      tableData: [],
      tableHeader: [],
      progressImageList: [],
      fillingList:[{
        value: '70MPa',
        label: '70MPa'
      }, {
        value: '35MPa',
        label: '35MPa'
      }],
      total: 0,
      tableHeight: window.innerHeight - 205,
      queryObj: {
        page: {
          current: 1,
          size: 10,
          orders: [
            {
              asc: false,
              column: 'ID'
            }
          ]
        },
        querys: [
          {
            like: {
              tenantType: '',
              tenantName: ''
            }
          }
        ]
      },
      page: {
        current: 1,
        size: 10,
        orders: [
          {
            asc: false,
            column: 'ID'
          }
        ]
      },
      temp: {
        property: []
      },
      formEdit: {
        provinceId: ''
      },
      dialogTitle: '企业详情',
      dialogType: 'see', // 弹框类型
      editFormVisible: false,
      formEditDisabled: false, // 是否禁用from表单中组件功能
      modelSearch: '',
      dialogVisible: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      map: null,
      mapZoom: 11,
      marker: '',
      uploadFlag:'',
      uploadTitle: '企业资质',
      fileName: '',
      startProcessBatch: {
        businessKey: ''
      },
      propertyList: [],
      dailyShow:false,
      fillingShow:false,
      categoryShow:false,
      addressDisabled: true,
      rules: {
        // 校验规则
        tenantName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur",
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        tenantShort: [
          { required: true, message: '请输入公司简称', trigger: 'blur' },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        tenantCode: [
          { required: true, message: '请输入公司代码', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9]{3,10}$/,
            message: '允许输入3-10位英文与数字'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        tel: [
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确电话号',
            trigger: 'blur'
          }
        ],
        address: [
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        web: [
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        mail: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '请选择企业省份', trigger: 'change' }
        ],
        cityId: [
          { required: true, message: '请选择企业市区', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.init()
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.elTable.$el.offsetTop - 205
      // 监听窗口大小变化
      let self = this;
      window.onresize = function () {
        self.tableHeight = window.innerHeight - self.$refs.elTable.$el.offsetTop - 205
      }
    })
    console.log( this.$store.state.tenantType)
   /* let tenantType = this.$store.state.tenantType
    if(tenantType == 4 || tenantType == 5 || tenantType ==6){
      this.$router.push('/industryService/basicCompanyEntry');
    }*/
    // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
  },
  computed:{
    fobu() {
      if (this.formEdit.businessHours) {
        return this.formEdit.businessHours.split('-')
      } else {
        return ''
      }
    },
    ...mapState({
      userId: state => state.userId
    })
  },
  methods: {
    async init () {
      await this.getTenantType()
      // this.getTableHeader()
      this.getLBJList()
      await this.getProvinceList()
      await this.getCityList()
      await this.getRegionList()
    },
    // 搜索栏
    handleFilter () {
      this.queryObj.page.current = 1
      this.queryObj.querys[0].like.tenantName = this.modelSearch
      this.getLBJList()
    },
    // 获取企业类型
    async getTenantType () {
      await getTenantType().then((res) => {
        this.lbjList = res.data
        this.queryObj.querys[0].like.tenantType = res.data[0].type
      })
    },
    // 获取企业列表信息
    getLBJList () {
      getTenantListByPage(this.queryObj).then((data) => {
        if (data.code === '200') {
          this.tableData = data.data
          this.total = parseInt(data.data.total)
          this.tableData.orders = [{ asc: false, column: 'ID' }]
          this.$nextTick(() => {
            this.$refs.elTable.doLayout()
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    toggleLBJ (index, type) {
      this.istrue = index
      this.queryObj.querys = [{
        like: {
          tenantType: type
        }
      }]
      // this.tableData = []
      // this.getTableHeader({ tenantType: pid })
      this.queryObj.page.current = 1
      this.getLBJList()
    },
    // 更新类型
    changeType (){
      console.log( this.formEdit.tenantType)
      let tenantType = this.formEdit.tenantType
      if(tenantType === 6){
        this.dailyShow = this.fillingShow = this.categoryShow = true
        this.getProperty()
      }else{
        this.dailyShow = this.fillingShow = this.categoryShow = false
      }
    },
    // 预览
    handleDetail (index, row) {
      this.formEditDisabled = true
      this.dialogType = 'see'
      this.dialogTitle = '预览企业信息'
      this.addressDisabled = false
      this.formEdit = row
      this.editFormVisible = true;
      this.$nextTick(()=>{this.mapInit()})
    },
    // 编辑
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.dialogType = "edit";
      this.dialogTitle = "编辑企业信息";
      this.formEdit = row;
      this.editFormVisible = true;
      this.addressDisabled = true;
      this.$nextTick(() => {
        this.mapInit();
      });
    },
    // 取消确认
    cancelEdit () {
      this.editFormVisible = false
      this.$refs.formEdit.clearValidate()
    },
    // 编辑公司方法
    confirmEidt (data) {
      if(this.formEdit.businessHours){
        this.formEdit.businessHours = this.formEdit.businessHours.toString();
      }
      this.propertyList=[];
      this.propertyList.push({"id": 6001, "value": this.formEdit.daily}) //加氢能力
      this.propertyList.push({"id": 6002, "value": this.formEdit.category})  //类别
      this.propertyList.push({"id": 6003, "value": this.formEdit.filling})  // 加注
      console.log( this.propertyList　)
      this.formEdit.propertyList = this.propertyList;
      this.$http.put('/system/tenant/update', data).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit('formEdit')
          this.$message.success('编辑成功')
          this.getLBJList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 关闭前回调
    closeDialog (done) {
      this.$refs.formEdit.clearValidate()
      done()
    },
    // 提交新增或编辑
    editFormConfirm () {
      this.$refs.formEdit.validate(valid => {
        if (valid) {
          if (this.dialogType === 'edit') {
            this.confirmEidt(this.formEdit)
            this.$refs.formEdit.clearValidate()
          }
        } else {
          return false
        }
      })
    },
    // 流程图绘制
    getProgressImageli (businessKey) {
    // processInstanceId
      let params = { businessKey: businessKey }
      getProgressImageData(params).then((res) => {
        if (res.ok === true) {
          this.progressImageList = res.data.reverse()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取省份列表
    getProvinceList () {
      let params = {};
      params.page = this.page;
      params.querys = [
        {
          eq: {
            areaLevel: 'A'
          },
          like:{
            id:'0000'
          }
        }
      ]
      getAreaList(params).then(({ data }) => {
        this.provinceList = data
      })
    },
    // 省份信息更新
    provinceChange(val){
      console.log( 111);
      console.log( arguments );
      this.$set(this.formEdit,'cityId','')
      this.$set(this.formEdit,'areaId','')
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate('cityId')
        this.$refs.formEdit.clearValidate('areaId')
      })
      this.getCityList ()
      let obj = {};
      obj = this.provinceList.find((item)=>{//这里的userList就是上面遍历的数据源
        return item.id === val;//筛选出匹配数据
      });
      this.formEdit.tenantCity = obj.name;

    },
    // 获取城市列表
    getCityList () {
      let parentId = this.formEdit.provinceId
      let params = {};
      params.page = this.page;
      params.querys = [
        {
          eq: {
            parentId: parentId
          }
        }
      ]
      getAreaList(params)
        .then(({ data }) => {
          this.cityList = data
        })
    },
    // 市信息更新
    cityChange(){
      this.$set(this.formEdit,'areaId','')
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate('areaId')
      })
      this.getRegionList()
    },
    // 获取城市列表
    getRegionList () {
      let parentId = this.formEdit.cityId
      let params = {};
      params.page = this.page;
      params.querys = [
        {
          eq: {
            parentId: parentId
          }
        }
      ]
      getAreaList(params).then(({ data }) => {
        this.areaList = data
      })
    },
    // 地图初始化
    mapInit(){
      // this.$message('onCloseonCloseonClose')
      console.log( this.formEdit.lng)
      this.map = new AMap.Map('addressMap', {
        zoom:12,//级别
        floorControl: false, //是否显示楼层
        center: [this.formEdit.lng,this.formEdit.lat], // 中心点坐标
        resizeEnable: true
      });

      this.marker = new AMap.Marker();

      AMap.plugin(
        ["AMap.ToolBar", "AMap.Geolocation", "AMap.ControlBar"],
        () => {
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          this.map.addControl(
            new AMap.ToolBar({
              // 简易缩放模式，默认为 false
              liteStyle: true,
              defaultType: 0,
              offset: new AMap.Pixel(14, 150),
              position: "RB",
            })
          );
          this.map.addControl(
            new AMap.Geolocation({
              buttonOffset: new AMap.Pixel(18, 170),
              buttonPosition: "RB",
            })
          );
          // 添加 3D 罗盘控制
          this.map.addControl(
            new AMap.ControlBar({
              showZoomBar: !1,
              showControlButton: !0,
              position: {
                right: "0px",
                bottom: "100px",
              },
            })
          );
        }
      );
    },
    // 搜索地址信息
    autoSearch(){
      let that = this
      AMap.plugin(
        ['AMap.Autocomplete','AMap.PlaceSearch'],
        () => {
          let adcode = that.formEdit.provinceId || '110000'
          let autoOptions = {
            adcode: adcode,
            input: 'address'
          }
          let autocomplete = new AMap.Autocomplete(autoOptions);
          AMap.event.addListener(autocomplete, "select", function (e) {
            let lnglat = e.poi.location;
            that.formEdit.lng = lnglat.lng;
            that.formEdit.lat = lnglat.lat
            that.marker.setPosition(e.poi.location);
            that.map.add(that.marker);
            that.map.setFitView(that.marker);
          });
        }
      )

    },
    // 上传成功调用
    uploadSuccess(res, file, fileList) {
      if (res.ok) {
        console.log( res )
        this.$message.success("上传成功")
        this.formEdit.attachment = res.data.id
        this.fileName = res.data.name
      } else {
        this.$message.error(res.message)
      }
    },
    // 更新上传信息
    changeUploadFileId(id) {
      this.uploadFlag = id;
    },
    // 上传信息时拦截
    beforeAvatarUpload(file) {
      if ((file.size / 1024) / 1024 > 200) {
        this.$message.error('上传文件不能超过200M');
        return false;
      }
      let isJPG;
      isJPG = (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png');
      // const isLt2M = file.size / 1024 < 2;
      if (!isJPG) {
        this.$message.error('文件类型错误，上传图片只能是PDF/JPG/PNG格式');
      }
      return isJPG;
    },
    // 删除文件
    deleteUploadFile(item1) {
      this.formEdit.attachment = ''
    },
    get


  }
}
</script>

<style lang="less" scoped>
  .btn-group {
    display: flex;
    margin: 10px 10px 10px 20px;
  }

  .btn-group .btn {
    width: 108px;
    height: 40px;
    line-height: 40px;
    color: #6a9edb;
    font-size: 14px;
    text-align: center;
    margin-right: 10px;
    background-color: #FFF;
    border-radius: 1px;
    border: 1px solid rgba(214, 214, 214, 1);
    box-shadow: 0 0 5px rgba(214, 214, 214, 1);
    cursor: pointer;
  }

  .btn-group .btn.activeBtn {
    color: #FFF;
    background-color: #4a90e4;
  }

  /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*height:600px;*/
    max-height: calc(100% - 10%);
    max-width: calc(100% - 30px);
  }

  /deep/ .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
  .content {
    width: 100%;
    margin: 0 10px 10px 10px;
    background-color: #FFF;
    height: calc(100vh - 85px);
    border-radius:4px;
    /*padding: 20px 30px;*/
    position: relative;
    .addressMap {
      width:380px; height: 200px;
      /*height: 100%;*/
      /*width: 100%;*/
    }
    overflow: hidden;;
  }


  .table-wrapper {
    margin-left: 240px;
    padding-top: 10px;
    margin-right: 10px;
    /*height: 100%;*/
    overflow: auto;
  }

  .table-wrapper .tool-btn-group {
    margin-bottom: 10px;
    float: right;
  }

  .nav {
    font-size: 14px;
    width: 200px;
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    height: calc(100vh - 130px);
    background-color: rgba(248, 248, 248, 0.4);
  }

  .nav div {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .nav .active {
    background: rgba(74, 144, 226, 0.1);
    border-right: 5px solid #4A90E2;
    color: #4A90E2;
  }

  .table-fixed /deep/ .el-table__fixed-right {
    height: 100% !important;
  }

  .table-fixed /deep/ .el-table__fixed {
    height: 100% !important;
  }

  .el-form .el-form-item .el-input {
    /*width: 60%;*/
    width: 380px;
  }

  .upload-demo {
    display: inline-block;
  }

  /deep/ .el-dialog__footer {
    text-align: center;
  }

  .input-with-select /deep/ .el-input-group__append {
    background-color: #4A90E2;
    color: #FFF;
  }
  .statusCircle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #ff0000;
  }
  .areaClass /deep/ .el-input{
    width: 122px;
  }
  .elSelect /deep/ .el-input{
    width: 380px;
  }
  /deep/ .el-date-editor{
    width: 380px;
  }
  .tips-content{
    font-size: 12px;
  }
</style>
