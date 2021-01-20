
<template>
  <div class="content">
    <el-form class="formSearch" :model="formSearch" label-width="80px">
      <el-input v-model="formSearch.vin" type="vin" maxlength="200" placeholder="车辆VIN码"></el-input>
      <el-input v-model="formSearch.vehicleNum" maxlength="200" type="vehicleNum" placeholder="车牌号"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="add">新增</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="importTable">导入</el-button>
      <el-button @click="exportTable">导出</el-button>
    </el-form>
    <el-table
      :data="tableData.records"
      style="width: 100%"
      border
      ref="elTable"
      :header-cell-style="{background:'#f8f8f9'}"
      height="428"
      size="mini"
      :cell-style="{height:'35px',padding:'5px 0px'}"
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{scope.$index+(page.current - 1) * page.size + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIN" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.vin }}</template>
      </el-table-column>
      <el-table-column label="车牌号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.vehicleNum }}</template>
      </el-table-column>
      <el-table-column label="终端编号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.terminalModel }}</template>
      </el-table-column>
      <el-table-column label="车型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.vehicleModel }}</template>
      </el-table-column>
      <el-table-column label="入网时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.networkDate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="320" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            style="width:80px"
            v-if="!scope.row.terminalModel"
            size="mini"
            type="success"
            @click="handleBind(scope.$index, scope.row)"
          >绑定终端</el-button>
          <el-button
            v-if="scope.row.terminalModel"
            size="mini"
            type="danger"
            @click="handleUnbind(scope.$index, scope.row)"
          >解绑终端</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(tableData.total)"
      ></el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editFormVisible"
      :fullscreen="true"
      :modal-append-to-body="false"
      :before-close="closeDialog"
    >
      <el-form
        :model="formEdit"
        class="formEdit"
        ref="formEdit"
        :disabled="formEditDisabled"
        :rules="rules"
        label-width="200px"
      >
        <el-col :span="8">
          <el-form-item label="VIN" prop="vin">
            <el-input
              v-model="formEdit.vin"
              :title="formEdit.vin"
              maxlength="17"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号" prop="vehicleNum">
            <el-input
              v-model="formEdit.vehicleNum"
              :title="formEdit.vehicleNum"
              maxlength="8"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端编号" prop="terminalCode">
            <el-select
              v-model="formEdit.terminalId"
              type="type"
              :title="formEdit.terminalId|terminalLabel(terminalList)"
              clearable
              filterable
              placeholder="终端编号"
            >
              <el-option
                v-for="item in terminalList"
                :key="item.id"
                :label="item.terminalCode"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车型" prop="terminalCode">
            <el-select
              v-model="formEdit.vehicleModelId"
              :title="formEdit.vehicleModelId|vehicleModelLabel(modelList)"
              type="type"
              filterable
              clearable
              placeholder="车型"
            >
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.model"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆初始里程数" prop="initialMileage">
            <el-input
              v-model="formEdit.initialMileage"
              :title="formEdit.initialMileage"
              :disabled="dialogType!=='add'"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆颜色" prop="details.CL_CLYS.value">
            <el-input
              v-model="formEdit.details.CL_CLYS.value"
              :title="formEdit.details.CL_CLYS.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车体结构" prop="details.CL_CTJG.value">
            <el-input
              v-model="formEdit.details.CL_CTJG.value"
              :title="formEdit.details.CL_CTJG.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="核定载重" prop="details.CL_HDZZ.value">
            <el-input
              v-model="formEdit.details.CL_HDZZ.value"
              :title="formEdit.details.CL_HDZZ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆尺寸(长)" prop="details.CL_CLCCC.value">
            <el-input
              v-model="formEdit.details.CL_CLCCC.value"
              :title="formEdit.details.CL_CLCCC.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆尺寸(宽)" prop="details.CL_CLCCK.value">
            <el-input
              v-model="formEdit.details.CL_CLCCK.value"
              :title="formEdit.details.CL_CLCCK.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆尺寸(高)" prop="details.CL_CLCCG.value">
            <el-input
              v-model="formEdit.details.CL_CLCCG.value"
              :title="formEdit.details.CL_CLCCG.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总质量" prop="details.CL_ZZL.value">
            <el-input
              v-model="formEdit.details.CL_ZZL.value"
              :title="formEdit.details.CL_ZZL.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆种类" prop="details.CL_CLZL.value">
            <el-input
              v-model="formEdit.details.CL_CLZL.value"
              :title="formEdit.details.CL_CLZL.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行业类型" prop="details.CL_HYSJ.value">
            <el-input
              v-model="formEdit.details.CL_HYSJ.value"
              :title="formEdit.details.CL_HYSJ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买时间" prop="details.CL_GMSJ.value">
            <el-date-picker
              v-model="formEdit.details.CL_GMSJ.value"
              :title="formEdit.details.CL_GMSJ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_GMSJ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行驶证号" prop="details.CL_XSZH.value">
            <el-input
              v-model="formEdit.details.CL_XSZH.value"
              :title="formEdit.details.CL_XSZH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发动机编号" prop="details.CL_FDJBH.value">
            <el-input
              v-model="formEdit.details.CL_FDJBH.value"
              :title="formEdit.details.CL_FDJBH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车质地" prop="details.CL_CZD.value">
            <el-input
              v-model="formEdit.details.CL_CZD.value"
              :title="formEdit.details.CL_CZD.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆技术等级" prop="details.CL_CLJSDJ.value">
            <el-input
              v-model="formEdit.details.CL_CLJSDJ.value"
              :title="formEdit.details.CL_CLJSDJ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出厂日期" prop="details.CL_CCRQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_CCRQ.value"
              :title="formEdit.details.CL_CCRQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_CCRQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="等级评定时间" prop="details.CL_DJPDSJ.value">
            <el-date-picker
              v-model="formEdit.details.CL_DJPDSJ.value"
              :title="formEdit.details.CL_DJPDSJ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_DJPDSJ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="二级维护日期" prop="details.CL_EJWHRQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_EJWHRQ.value"
              :title="formEdit.details.CL_EJWHRQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_EJWHRQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="二级评定日期" prop="details.CL_EJPDRQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_EJPDRQ.value"
              :title="formEdit.details.CL_EJPDRQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_EJPDRQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年审状态" prop="details.CL_NSZT.value">
            <el-input
              v-model="formEdit.details.CL_NSZT.value"
              :title="formEdit.details.CL_NSZT.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="年检有效期" prop="details.CL_NJYXQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_NJYXQ.value"
              :title="formEdit.details.CL_NJYXQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_NJYXQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保险有效期" prop="details.CL_BXYXQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_BXYXQ.value"
              :title="formEdit.details.CL_BXYXQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_BXYXQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养有效期" prop="details.CL_BYYXQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_BYYXQ.value"
              :title="formEdit.details.CL_BYYXQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_BYYXQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属单位名称" prop="details.CL_SSDWMC.value">
            <el-input
              v-model="formEdit.details.CL_SSDWMC.value"
              :title="formEdit.details.CL_SSDWMC.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆联系人" prop="details.CL_CLLXR.value">
            <el-input
              v-model="formEdit.details.CL_CLLXR.value"
              :title="formEdit.details.CL_CLLXR.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆联系电话" prop="details.CL_CLLXDH.value">
            <el-input
              v-model="formEdit.details.CL_CLLXDH.value"
              :title="formEdit.details.CL_CLLXDH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆注册时间" prop="details.CL_CLZCSJ.value">
            <el-date-picker
              v-model="formEdit.details.CL_CLZCSJ.value"
              :title="formEdit.details.CL_CLZCSJ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_CLZCSJ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属组织ID" prop="details.CL_SSZZID.value">
            <el-input
              v-model="formEdit.details.CL_SSZZID.value"
              :title="formEdit.details.CL_SSZZID.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="环保局车辆类型" prop="details.CL_HBHCLLX.value">
            <el-input
              v-model="formEdit.details.CL_HBHCLLX.value"
              :title="formEdit.details.CL_HBHCLLX.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输局车辆类型" prop="details.CL_YSJCLLX.value">
            <el-input
              v-model="formEdit.details.CL_YSJCLLX.value"
              :title="formEdit.details.CL_YSJCLLX.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所有绑定的SIM卡" prop="details.CL_SYBDDSIMK.value">
            <el-input
              v-model="formEdit.details.CL_SYBDDSIMK.value"
              :title="formEdit.details.CL_SYBDDSIMK.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发动机型号" prop="details.CL_FDJXH.value">
            <el-input
              v-model="formEdit.details.CL_FDJXH.value"
              :title="formEdit.details.CL_FDJXH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所有者地址" prop="details.CL_SYZDZ.value">
            <el-input
              v-model="formEdit.details.CL_SYZDZ.value"
              :title="formEdit.details.CL_SYZDZ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌型号" prop="details.CL_CPXH.value">
            <el-input
              v-model="formEdit.details.CL_CPXH.value"
              :title="formEdit.details.CL_CPXH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行政区划" prop="details.CL_XZQH.value">
            <el-input
              v-model="formEdit.details.CL_XZQH.value"
              :title="formEdit.details.CL_XZQH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="行政地址" prop="details.CL_XZDZ.value">
            <el-input
              v-model="formEdit.details.CL_XZDZ.value"
              :title="formEdit.details.CL_XZDZ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总客数" prop="details.CL_ZKS.value">
            <el-input
              v-model="formEdit.details.CL_ZKS.value"
              :title="formEdit.details.CL_ZKS.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="整备质量" prop="details.CL_ZCZL.value">
            <el-input
              v-model="formEdit.details.CL_ZCZL.value"
              :title="formEdit.details.CL_ZCZL.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="列车最大总质量" prop="details.CL_LCZDZZL.value">
            <el-input
              v-model="formEdit.details.CL_LCZDZZL.value"
              :title="formEdit.details.CL_LCZDZZL.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入网证号" prop="details.CL_RWZH.value">
            <el-input
              v-model="formEdit.details.CL_RWZH.value"
              :title="formEdit.details.CL_RWZH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="初次登记日期" prop="details.CL_CCDJRQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_CCDJRQ.value"
              :title="formEdit.details.CL_CCDJRQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_CCDJRQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年检日期" prop="details.CL_NJRQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_NJRQ.value"
              :title="formEdit.details.CL_NJRQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_NJRQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="强制报废日期" prop="details.CL_QZBFRQ.value">
            <el-date-picker
              v-model="formEdit.details.CL_QZBFRQ.value"
              :title="formEdit.details.CL_QZBFRQ.value"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'CL_QZBFRQ')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业简称" prop="details.CL_QYJC.value">
            <el-input
              v-model="formEdit.details.CL_QYJC.value"
              :title="formEdit.details.CL_QYJC.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SN" prop="details.CL_SN.value">
            <el-input
              v-model="formEdit.details.CL_SN.value"
              :title="formEdit.details.CL_SN.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col el-col :span="24">
          <div class="stance"></div>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogType!== 'see'">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 -->
    <el-dialog
      title="绑定终端"
      :visible.sync="dialogTerminalVisible"
      width="260px"
      :modal-append-to-body="false"
      :before-close="closeTerminalDialog"
    >
      <el-form :model="formBindTerminal" ref="formBindTerminal" :rules="rules">
        <el-form-item prop="BindTerminalId">
          <el-select v-model="formBindTerminal.BindTerminalId" filterable placeholder="请选择终端号">
            <el-option
              :label="item.terminalCode"
              :value="item.id"
              :key="item.id"
              v-for="item in terminalList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-bind-terminal-footer">
        <el-button @click="cancelBind">取 消</el-button>
        <el-button type="primary" @click="confirmBind">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "VehicleAdmin",
  data() {
    const ADDVEHICLEDATA = {
      CL_CLYS: {
        //车辆颜色
        value: "",
        propertyId: "CL_CLYS"
      },
      CL_CTJG: {
        //车体结构
        value: "",
        propertyId: "CL_CTJG"
      },
      CL_HDZZ: {
        //核定载重
        value: "",
        propertyId: "CL_HDZZ"
      },
      CL_CLCCC: {
        //车辆尺寸(长)
        value: "",
        propertyId: "CL_CLCCC"
      },
      CL_CLCCK: {
        //车辆尺寸(宽)
        value: "",
        propertyId: "CL_CLCCK"
      },
      CL_CLCCG: {
        //车辆尺寸(高)
        value: "",
        propertyId: "CL_CLCCG"
      },
      CL_ZZL: {
        //总质量
        value: "",
        propertyId: "CL_ZZL"
      },
      CL_CLZL: {
        //车辆种类
        value: "",
        propertyId: "CL_CLZL"
      },
      CL_HYSJ: {
        //行业类型
        value: "",
        propertyId: "CL_HYSJ"
      },
      CL_GMSJ: {
        //购买时间
        value: "",
        propertyId: "CL_GMSJ"
      },
      CL_XSZH: {
        //行驶证号
        value: "",
        propertyId: "CL_XSZH"
      },
      CL_FDJBH: {
        //发动机编号
        value: "",
        propertyId: "CL_FDJBH"
      },
      CL_CZD: {
        //车质地
        value: "",
        propertyId: "CL_CZD"
      },
      CL_CLJSDJ: {
        //车辆技术等级
        value: "",
        propertyId: "CL_CLJSDJ"
      },
      CL_CCRQ: {
        //出厂日期
        value: "",
        propertyId: "CL_CCRQ"
      },
      CL_DJPDSJ: {
        //等级评定时间
        value: "",
        propertyId: "CL_DJPDSJ"
      },
      CL_EJWHRQ: {
        //二级维护日期
        value: "",
        propertyId: "CL_EJWHRQ"
      },
      CL_EJPDRQ: {
        //二级评定日期
        value: "",
        propertyId: "CL_EJPDRQ"
      },
      CL_NSZT: {
        //年审状态
        value: "",
        propertyId: "CL_NSZT"
      },
      CL_NJYXQ: {
        //年检有效期
        value: "",
        propertyId: "CL_NJYXQ"
      },
      CL_BXYXQ: {
        //保险有效期
        value: "",
        propertyId: "CL_BXYXQ"
      },
      CL_BYYXQ: {
        //保养有效期
        value: "",
        propertyId: "CL_BYYXQ"
      },
      CL_SSDWMC: {
        //所属单位名称
        value: "",
        propertyId: "CL_SSDWMC"
      },
      CL_CLLXR: {
        //车辆联系人
        value: "",
        propertyId: "CL_CLLXR"
      },
      CL_CLLXDH: {
        //车辆联系电话
        value: "",
        propertyId: "CL_CLLXDH"
      },
      CL_CLZCSJ: {
        //车辆注册时间
        value: "",
        propertyId: "CL_CLZCSJ"
      },
      CL_SSZZID: {
        //所属组织ID
        value: "",
        propertyId: "CL_SSZZID"
      },
      CL_HBHCLLX: {
        //环保局车辆类型
        value: "",
        propertyId: "CL_HBHCLLX"
      },
      CL_YSJCLLX: {
        //运输局车辆类型
        value: "",
        propertyId: "CL_YSJCLLX"
      },
      CL_SYBDDSIMK: {
        //所有绑定的SIM卡
        value: "",
        propertyId: "CL_SYBDDSIMK"
      },
      CL_FDJXH: {
        //发动机型号
        value: "",
        propertyId: "CL_FDJXH"
      },
      CL_SYZDZ: {
        //所有者地址
        value: "",
        propertyId: "CL_SYZDZ"
      },
      CL_CPXH: {
        //车牌型号
        value: "",
        propertyId: "CL_CPXH"
      },
      CL_XZQH: {
        //行政区划
        value: "",
        propertyId: "CL_XZQH"
      },
      CL_XZDZ: {
        //行政地址
        value: "",
        propertyId: "CL_XZDZ"
      },
      CL_ZKS: {
        //总客数
        value: "",
        propertyId: "CL_ZKS"
      },
      CL_ZCZL: {
        //整备质量
        value: "",
        propertyId: "CL_ZCZL"
      },
      CL_LCZDZZL: {
        //列车最大总质量
        value: "",
        propertyId: "CL_LCZDZZL"
      },
      CL_RWZH: {
        //入网证号
        value: "",
        propertyId: "CL_RWZH"
      },
      CL_CCDJRQ: {
        //初次登记日期
        value: "",
        propertyId: "CL_CCDJRQ"
      },
      CL_NJRQ: {
        //年检日期
        value: "",
        propertyId: "CL_NJRQ"
      },
      CL_QZBFRQ: {
        //强制报废日期
        value: "",
        propertyId: "CL_QZBFRQ"
      },
      CL_QYJC: {
        //企业简称
        value: "",
        propertyId: "CL_QYJC"
      },
      CL_SN: {
        //SN
        value: "",
        propertyId: "CL_SN"
      }
    };
    const validNum = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$/.test(value)) {
        callback(new Error("请输入正确的车辆初始里程数"));
        return;
      }
      callback();
      this.$refs.formEdit.clearValidate("initialMileage");
    };
    const validVin = (rule, value, callback) => {
      let flag = false;
      let vinRule = "IOQioq";
      if (!/^(?![0-9]+$)(?![A-Z]+$)[0-9A-Z]{17}$/.test(value)) {
        flag = true;
      }
      for (var i = 0; i < 6; i++) {
        if (value.indexOf(vinRule.substr(i, 1)) != -1) {
          flag = true;
          break;
        }
      }
      if (flag) {
        callback(new Error("请输入正确的VIN"));
        return;
      }
      callback();
      this.$refs.formEdit.clearValidate("vin");
    };
    return {
      formSearch: {
        vin: "",
        vehicleNum: ""
      },
      addvehicledata: {
        details: ADDVEHICLEDATA
      },
      dialogTerminalVisible: false, //绑定终端弹窗
      formBindTerminal: {
        BindTerminalId: "" //当前绑定terminalId
      },
      formEditDisabled: false, //是否禁用from表单中组件功能
      dialogTitle: "编辑车辆信息", //弹框的标题
      dialogType: "see", //弹框类型
      querys: null, //用来判断是否进行条件搜索
      page: {
        current: 1,
        size: 10
      }, //当前页
      terminalList: [], //终端option
      modelList: [], //车型list
      formEdit: {
        details: JSON.parse(JSON.stringify(ADDVEHICLEDATA))
      },
      provinceList: [], //省份列表
      cityList: [], //城市列表
      editFormVisible: false, //编辑弹出框隐藏
      scopeId: "0", //用来
      tableData: [],
      rules: {
        //校验规则
        vin: [
          { required: true, message: "请输入车辆VIN", trigger: "blur" },
          { validator: validVin, trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" },
          { min: 17, max: 17, message: "请输入17位VIN码", trigger: "blur" }
        ],
        vehicleNum: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message: "请输入正确车牌号"
          }
        ],
        BindTerminalId: [
          { required: true, message: "请选择终端号", trigger: "change" }
        ],
        "details.CL_CLYS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CTJG.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_HDZZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLCCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLCCK.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLCCG.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_ZZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_HYSJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_GMSJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_XSZH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_FDJBH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CZD.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLJSDJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CCRQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_DJPDSJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_EJWHRQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_EJPDRQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_NSZT.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_NJYXQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_BXYXQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_BYYXQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_SSDWMC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLLXR.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLLXDH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CLZCSJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_SSZZID.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_HBHCLLX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_YSJCLLX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_SYBDDSIMK.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_FDJXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_SYZDZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CPXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_XZQH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_XZDZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_ZKS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_ZCZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_LCZDZZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_RWZH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_CCDJRQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_NJRQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_QZBFRQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_QYJC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CL_SN.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        initialMileage: [
          { required: true, message: "请输入车辆初始里程数", trigger: "blur" },
          { validator: validNum, message: "请输入正确的车辆初始里程数", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    reset() {
      this.formSearch = {};
      this.querys = null;
    },
    closeDialog(done) {
      this.$refs.formEdit.clearValidate();
      done();
    },
    importTable() {
      this.$message.warning("导入功能开发中...");
    },
    exportTable() {
      this.$message.warning("导出功能开发中...");
    },
    //取消绑定终端
    cancelBind() {
      this.dialogTerminalVisible = false;
      this.formBindTerminal.BindTerminalId = "";
    },
    //确认绑定终端
    confirmBind() {
      this.$refs.formBindTerminal.validate(valid => {
        if (valid) {
          this.$http
            .put("/baseinfo/vehicle/binding/terminal/" + this.bindTerminal.id, {
              targetId: this.formBindTerminal.BindTerminalId
            })
            .then(({ data }) => {
              if (data.code === "200") {
                this.$message.success("绑定成功");
                this.dialogTerminalVisible = false;
                this.formBindTerminal.BindTerminalId = "";
                this.getTableData();
              } else {
                this.$message.error(data.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    //日期改变，特别是点击清理按钮的处理
    datePickerChange(option, key) {
      if (option == null) {
        this.formEdit.details[key].value = "";
      }
    },
    //  绑定终端
    handleBind(index, row) {
      this.dialogTerminalVisible = true;
      this.getTerminalOption();
      this.bindTerminal = row;
      this.$nextTick(() => {
        this.$refs.formBindTerminal.clearValidate();
      });
    },
    // 关闭绑定终端
    closeTerminalDialog(done) {
      this.$refs.formBindTerminal.clearValidate();
      done();
    },
    //解绑终端
    handleUnbind(index, row) {
      this.$confirm("确定解绑当前车辆终端吗？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http
          .put("/baseinfo/vehicle/binding/terminal/" + row.id, {})
          .then(({ data }) => {
            if (data.code === "200") {
              this.$message.success("解绑成功");
              this.getTableData();
            } else {
              this.$message.error(data.msg);
            }
          });
      });
    },
    search() {
      //条件搜搜
      this.page.current = 1;
      this.querys = [
        {
          like: this.formSearch
        }
      ];
      this.getTableData();
    },

    //新增车辆信息
    add() {
      this.formEdit = JSON.parse(JSON.stringify(this.addvehicledata));
      this.formEditDisabled = false;
      this.dialogType = "add";
      this.dialogTitle = "新增车辆信息";
      this.cityList = [];
      this.editFormVisible = true;
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate();
      });
      this.getOptionInit();
    },
    getTableData() {
      //列表加载
      let params = {
        page: {
          current: this.page.current,
          size: this.page.size,
          orders: [
            {
              asc: false,
              column: "ID"
            }
          ]
        }
      };
      if (this.querys) {
        params.querys = this.querys;
      }
      this.$http.post("/rdbms/vehicle-page/page", params).then(({ data }) => {
        if (data.code === "200") {
          this.tableData = data.data;
          this.$nextTick(() => {
            this.$refs.elTable.doLayout();
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //提交新增或编辑
    editFormConfirm() {
      // this.editFormVisible = false;
      this.$refs.formEdit.validate(valid => {
        if (valid) {
          if (this.dialogType === "add") {
            this.confirmSubmit(this.formEdit);
          } else if (this.dialogType === "edit") {
            console.log(this.formEdit);
            this.confirmEidt(this.formEdit);
            this.$refs.formEdit.clearValidate();
          }
        } else {
          return false;
        }
      });
    },
    //点击清理按钮
    selectChange(option, key) {
      console.log(option == "");
      if (option == "") {
        this.formEdit[key] = "";
        console.log(this.formEdit);
      }
    },
    //删除用户
    handleDelete(index, row) {
      this.$confirm("确定删除该车辆信息？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.delete("/baseinfo/vehicle/" + row.id).then(({ data }) => {
          if (data.code === "200") {
            let totalPage = Math.ceil(
              (Number(this.tableData.total) - 1) / this.page.size
            );
            let currentPage =
              this.page.current > totalPage ? totalPage : this.page.current;
            this.page.current = currentPage < 1 ? 1 : currentPage;
            this.getTableData();
            this.$message.success("删除成功");
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      //当前页
      this.page.current = val;
      this.getTableData();
    },
    //取消确认
    cancelEdit() {
      this.editFormVisible = false;
      this.$refs.formEdit.clearValidate();
    },

    //新增车辆方法
    confirmSubmit(data) {
      this.$http.post("/baseinfo/vehicle", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit();
          this.$message.success("新增成功");
          this.getTableData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //查看车辆
    handleSee(index, row) {
      this.formEditDisabled = true;
      this.dialogType = "see";
      this.dialogTitle = "查看车辆信息";
      this.editFormVisible = true;
      this.getVehicleInfor(row.id);
      this.getOptionInit();
    },
    //编辑车辆信息
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.editFormVisible = true;
      this.dialogType = "edit";
      this.dialogTitle = "编辑车辆信息";
      this.getVehicleInfor(row.id);
      this.getOptionInit();
    },
    //获取车辆详细信息
    getVehicleInfor(id) {
      this.$http.get("/baseinfo/vehicle/" + id).then(({ data }) => {
        if (data.code === "200") {
          this.formEdit = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //编辑车辆方法
    confirmEidt(data) {
      this.$http.put("/baseinfo/vehicle", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit("formEdit");
          this.$message.success("编辑成功");
          this.getTableData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getOptionInit() {
      //初始化下拉选
      this.$http
        .post("/baseinfo/vehicle-model/list", {
          columns: ["ID", "MODEL"]
        })
        .then(({ data }) => {
          if (data.code == "200") {
            this.modelList = data.data;
          } else if (data.code == "401") {
          } else {
            this.$message.error(data.msg);
          }
        });
      this.$http
        .post("/rdbms/terminal-page/list", {
          columns: ["ID", "TERMINAL_CODE"]
        })
        .then(({ data }) => {
          if (data.code == "200") {
            this.terminalList = data.data;
          } else if (data.code == "401") {
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    getTerminalOption() {
      this.$http
        .post("/rdbms/terminal-page/list", {
          columns: ["ID", "TERMINAL_CODE"]
        })
        .then(({ data }) => {
          if (data.code == "200") {
            this.terminalList = data.data;
          } else if (data.code == "401") {
          } else {
            this.$message.error(data.msg);
          }
        });
    }
  },
  //用过滤器对选择框加title
  filters: {
    terminalLabel(id, list) {
      if (id && list.length > 0) {
        return list.find(item => item.id == id).terminalCode;
      }
    },
    vehicleModelLabel(id, list) {
      if (id && list.length > 0) {
        return list.find(item => item.id == id).model;
      }
    }
  },
  activated() {
    this.$refs.elTable.doLayout();
  },
  created() {
    this.getTableData();
  }
};
</script>
<style>
.el-table__fixed-right {
  height: 100% !important;
}
</style>
<style lang="less" scoped>
.content {
  padding: 10px;
  background: #fff;
  width: 100%;
}
.content .el-table {
  margin-top: 10px;
}

.formSearch .el-input {
  width: 200px;
  margin-right: 5px;
}
.formEdit .el-input {
  width: 200px;
  margin-right: 5px;
}
.formEdit .el-select {
  width: 200px;
}
.formSearch .el-select {
  width: 200px;
  margin-right: 5px;
}
.dialog-footer {
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
.dialog-bind-terminal-footer {
  text-align: center;
}
// 分页样式
.content .block {
  margin-top: 8px;
}
.formEdit {
  padding-bottom: 30px;
}
.stance {
  height: 40px;
}
</style>
