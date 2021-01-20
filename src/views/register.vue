<template>
    <div class="register">
      <div class="register_header">
        <img class="logo" src="@/assets/img/login/logo_word.png" alt="logo">
      </div>
      <div class="register_content" :style="{ backgroundImage: 'url('+bgImg+')'}">
        <div class="container">
          <div class="container_header">
            <span class="tit">欢迎注册</span>
            <el-link :underline="false" href="/devWeb/#/views/Login" type="primary" style="float: right;line-height: 70px;margin-right:20px; ">去登录 <i class="el-icon-arrow-right"></i> </el-link>
          </div>

          <div class="line" />
          <el-form ref="formEdit"
                   :model="formEdit"
                   class="register_form"
                   :disabled="formEditDisabled"
                   :rules="rules"
                   label-width="130px">
            <el-form-item label="企业名称" prop="tenantName">
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
            <el-form-item label="城市">
              <el-select v-model="formEdit.tenantCity" placeholder="请选择城市" class="elSelect">
                <el-option v-for="(item) in provinceList" :key="item.id" :label="item.name" :value="item.name" ></el-option>
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
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formEdit.email"
                :title="formEdit.email"
                maxlength="200"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="企业社会信用代码" prop="creditCode">
              <el-input
                v-model="formEdit.creditCode"
                :title="formEdit.creditCode"
                maxlength="200"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="注册地">
              <el-col :span="8">
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
              <el-col :span="8">
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
              <el-col :span="8">
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
                     @input="autoSearch" v-model="formEdit.address"  :title="formEdit.address">
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
            <el-form-item label="营业时间" prop="businessHours">
              <el-time-picker
                is-range
                v-model="formEdit.businessHours"
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
            <el-button type="primary" @click="editFormConfirm" style="width: 300px;">提交</el-button>
          </div>
        </div>

      </div>
      <div class="register_footer">
        版权所有：中国汽车技术研究中心数据资源中心 版本号：V1.0.0
      </div>
    </div>
</template>

<script>
  import { getTenantType, getAreaList, addCompany } from '@/assets/api/basicInformationEntry'
  import { getProgressImageData, startProcessBatch } from '@/assets/api/process'
  import AMap from "AMap";
  export default {
    name: 'register',
    data () {
      return {
        bgImg: require("@/assets/img/login/r_bg.png"),
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
        dialogType: 'register', // 弹框类型
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
          email: [
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
      // this.$refs.table.$el.offsetTop：表格距离浏览器的高度
    },
    computed:{
      fobu() {
        if (this.formEdit.businessHours) {
          return this.formEdit.businessHours.split('-')
        } else {
          return this.formEdit.businessHours
        }
      }
    },
    methods: {
      async init () {
        await this.getTenantType()
        await this.getProvinceList()
        await this.getCityList()
        await this.getRegionList()
        await this.mapInit()
      },
      // 获取企业类型
      async getTenantType () {
        await getTenantType().then((res) => {
          this.lbjList = res.data
          this.queryObj.querys[0].like.tenantType = res.data[0].type
        })
      },
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
        this.formEdit = row
        // this.formEdit.BusinessHours = this.formEdit.BusinessHours.split('-')
        // this.getCityList()
        this.editFormVisible = true;
        this.editFormVisible = true
        this.$nextTick(()=>{this.mapInit()})
      },
      // 编辑
      handleEdit(index, row) {
        this.formEditDisabled = false;
        this.dialogType = "edit";
        this.dialogTitle = "编辑企业信息";
        this.formEdit = row;
        this.editFormVisible = true;
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
        this.$http.put('/system/tenant/update', data).then(({ data }) => {
          if (data.code === '200') {
            // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
            this.cancelEdit('formEdit')
            this.$message.success('编辑成功')
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
            this.registerCompany()
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
      // 注册增加企业信息
      registerCompany(){
       // 新增企业
        if(this.formEdit.businessHours){
          this.formEdit.businessHours = this.formEdit.businessHours.toString();
        }
        this.propertyList=[];
        this.propertyList.push({"id": 6001, "value": this.formEdit.daily}) //加氢能力
        this.propertyList.push({"id": 6002, "value": this.formEdit.category})  //类别
        this.propertyList.push({"id": 6003, "value": this.formEdit.filling})  // 加注
        console.log( this.propertyList　)
        this.formEdit.propertyList = this.propertyList;

        this.$http.post('/system/tenant/register',  this.formEdit ).then(({data}) => {
          console.log( data )
          if (data.code === '200') {
            console.log(data.data.id)
            this.startProcessBatch.businessKey = data.data.id
            // 根据企业id 启动流程
            this.$http.post('/api/activiti/noLogin/repository/startProcess/ENTERPRISE_REGIST',
              this.startProcessBatch ).then(({data}) => {
              if (data.code === '200') {
                this.$message.success('注册成功,请等待通知！')
              } else {
                this.$message.error(data.msg)
              }
            })

          } else {
            this.$message.error(data.msg)
          }

        })

        // await
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
      provinceChange(){
        console.log( 111);
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
        this.map = new AMap.Map('addressMap', {
          zoom:12,//级别
          floorControl: false, //是否显示楼层
          // center: [this.formEdit.lng,this.formEdit.lat], // 中心点坐标
          center: [117.209065,39.135184], // 中心点坐标
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
      // 获取字段信息
      getProperty () {
        let type = this.formEdit.tenantType
        this.$http.get('/system/tenant/getProperty/'+type).then(( data ) => {

        })

      }
    }
  }
</script>

<style scoped lang="less">
  .register{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .register_header{
    height: 8%;
    min-height: 74px;
    width: 100%;
    img{
      position: absolute;
      left: 56px;
      top: 22px;
      width: 250px;
    }
  }
  .register_content{
    height: 74%;
    min-height: 490px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .leftImg{
      width: 637px;
      height: 439px;
      margin-left: 78px;
      margin-top: 36px;
    }
  }
  .container {
    border-radius: 6px;
    position: absolute;
    top: 16%;
    left: 28%;
    width: 560px;
    /*padding: 0px 25px 15px 25px;*/
    background:rgba(255,255,255,1);
    border:1px solid rgba(219,219,219,0.2);

    .container_header{
      text-align: center;
    }
    .line{
      width: 100%;
      height: 1px;
      background-color: #DBDBDB;
      opacity:0.5;
      margin-bottom: 10px;
    }
    .tit{
      height: 60px;
      margin-left: 15%;
      line-height: 60px;
      text-align: center;
      font-size:20px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(47,47,47,1);;
    }
    .register_form{
      padding: 0px 25px 15px 25px;
      overflow-y: scroll;
      height: 320px;
      .addressMap {
        width:374px; height: 200px;
      }
    }

    .dialog-footer{
      padding-top: 8px;
      padding-bottom: 16px;
    }
    .linkButtton{
      font-weight:500;
      color:rgba(255,255,255,0.85);
      cursor: pointer;
    }
    /deep/.el-form-item__label{
      color:rgba(96,98,102,1);
      font-size: 14px;
    }
    /deep/.el-form--label-top .el-form-item__label {
      padding: 0;
    }
    .areaClass /deep/ .el-input{
      width: 122px;
    }
    /deep/ .el-input, /deep/ .el-date-editor, /deep/ .el-input-number{ width: 374px; }
    /deep/ .el-form-item{ margin-bottom: 18px; }
    .loginNameStyle{
      margin-bottom: 0;
    }
  }

  .register_footer{
    height: 8%;
    min-height: 60px;
    line-height: 60px;
    width: 100%;
    font-size:12px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(143,147,153,1);
    text-align: center;

  }

  .upload-demo {
    display: inline-block;
  }


  @media screen and (min-width: 1900px) {
    .register_content {
      height: 83%;
      .container {
        width: 600px;
        left: 35%;
        top: 14%;
        .register_form{
          height: 520px;
          .addressMap {
            width:398px;
          }
        }
        .areaClass /deep/ .el-input{width: 122px;}
        /deep/ .el-input, /deep/ .el-date-editor, /deep/ .el-input-number{ width: 398px; }

      }

    }

  }
</style>
