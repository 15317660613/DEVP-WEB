<template>
  <div class="content">
    <el-form :inline="true" label-width="80px" @submit.native.prevent>
      <el-input v-model="modelSearch" maxlength="200" placeholder="发动机型号"></el-input>
      <el-button type="primary" @click="searchEngineList">搜索</el-button>
      <el-button @click="addEngine">新增</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="importTable">导入</el-button>
      <el-button @click="exportTable">导出</el-button>
    </el-form>
    <el-table
      border
      ref="elTable"
      :data="tableData"
      tooltip-effect="dark"
      height="444"
      size="mini"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      style="width: 100%"
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="model"
        label="发动机型号"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="business"
        label="发动机生产企业"
        width="120px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="output"
        label="发动机排量（L）"
        width="140px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="airCylinderType"
        label="气缸排列型式"
        width="120px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="maxPower"
        label="最大功率/转速（Nm/r/min）"
        width="200px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="afterAirOut"
        label="排气后处理系统形式"
        width="150px"
        align="center"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="etc" label="ETC循环功" align="center" width="120px"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="wthc"
        label="WTHC循环功"
        align="center"
        width="120px"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="torque" label="参考扭矩" align="center" width="80px"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="calid"
        label="软件标定识别号（CALID）"
        width="200px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="cvn"
        label="标定验证码（CVN）"
        width="150px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="ratedPower"
        label="发动机额定功率"
        width="120px"
        align="center"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="decorate"
        label="发动机布置方式"
        width="120px"
        align="center"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" align="center" width="220px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next,jumper"
        :total="total"
        :page-sizes="[10, 20, 30, 40,50]"
        :current-page="currentPage"
        @current-change="current_change"
        @size-change="size_change"
      ></el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      :modal-append-to-body="false"
      append-to-body
      width="100%"
      :fullscreen="true"
    >
      <!-- <div class="formTitle">
        <span>必填信息</span>
      </div>-->
      <el-form
        ref="addEngineForm"
        :rules="rules"
        :model="engineObj"
        label-width="210px"
        :inline="true"
        :disabled="formEditDisabled"
      >
        <el-form-item prop="model" label="发动机型号">
          <el-input maxlength="200" v-model="engineObj.model" :title="engineObj.model"></el-input>
        </el-form-item>
        <el-form-item prop="business" label="发动机生产企业">
          <el-input maxlength="200" v-model="engineObj.business" :title="engineObj.business"></el-input>
        </el-form-item>
        <el-form-item prop="output" label="发动机排量（L）">
          <el-input maxlength="200" v-model="engineObj.output" :title="engineObj.output"></el-input>
        </el-form-item>
        <el-form-item
          prop="airCylinderType"
          label="气缸排列型式"
        >
          <el-input
            maxlength="200"
            v-model="engineObj.airCylinderType"
            :title="engineObj.airCylinderType"
          ></el-input>
        </el-form-item>
        <el-form-item prop="maxPower" label="最大功率/转速（Nm/r/min）">
          <el-input maxlength="200" v-model="engineObj.maxPower" :title="engineObj.maxPower"></el-input>
        </el-form-item>
        <el-form-item prop="afterAirOut" label="排气后处理系统形式">
          <el-input maxlength="200" v-model="engineObj.afterAirOut" :title="engineObj.afterAirOut"></el-input>
        </el-form-item>
        <el-form-item prop="etc" label="ETC循环功">
          <el-input maxlength="200" v-model="engineObj.etc" :title="engineObj.etc"></el-input>
        </el-form-item>
        <el-form-item prop="wthc" label="WTHC循环功">
          <el-input maxlength="200" v-model="engineObj.wthc" :title="engineObj.wthc"></el-input>
        </el-form-item>
        <el-form-item prop="torque" label="参考扭矩">
          <el-input maxlength="200" v-model="engineObj.torque" :title="engineObj.torque"></el-input>
        </el-form-item>
        <el-form-item prop="calid" label="软件标定识别号（CALID）">
          <el-input maxlength="200" v-model="engineObj.calid" :title="engineObj.calid"></el-input>
        </el-form-item>
        <el-form-item prop="cvn" label="标定验证码（CVN）">
          <el-input maxlength="200" v-model="engineObj.cvn" :title="engineObj.cvn"></el-input>
        </el-form-item>
        <el-form-item prop="ratedPower" label="发动机额定功率">
          <el-input maxlength="200" v-model="engineObj.ratedPower" :title="engineObj.ratedPower"></el-input>
        </el-form-item>
        <el-form-item prop="decorate" label="发动机布置方式">
          <el-input maxlength="200" v-model="engineObj.decorate" :title="engineObj.decorate"></el-input>
        </el-form-item>
        <!-- <div class="formTitle">
          <span>选填信息</span>
        </div>-->
        <el-form-item prop="details.FDJ_SFYFFDJ.value" label="是否有副发动机">
          <el-select
            v-model="engineObj.details.FDJ_SFYFFDJ.value"
            :title="engineObj.details.FDJ_SFYFFDJ.value"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副发动机排放标准" prop="details.FDJ_FFDJPFBZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FFDJPFBZ.value"
            :title="engineObj.details.FDJ_FFDJPFBZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="副发动机生产企业" prop="details.FDJ_FFDJSCQY.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FFDJSCQY.value"
            :title="engineObj.details.FDJ_FFDJSCQY.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="副发动机燃料类型" prop="details.FDJ_FFDJRLLX.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FFDJRLLX.value"
            :title="engineObj.details.FDJ_FFDJRLLX.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="燃烧室结构" prop="details.FDJ_RSSJG.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_RSSJG.value"
            :title="engineObj.details.FDJ_RSSJG.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="容积压缩比" prop="details.FDJ_RJYSB.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_RJYSB.value"
            :title="engineObj.details.FDJ_RJYSB.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="冷却方式" prop="details.FDJ_LQFS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_LQFS.value"
            :title="engineObj.details.FDJ_LQFS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="缸数-缸径×行程(mm)" prop="details.FDJ_GSGJXC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_GSGJXC.value"
            :title="engineObj.details.FDJ_GSGJXC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="发动机缸心距(mm)" prop="details.FDJ_FDJGXJ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FDJGXJ.value"
            :title="engineObj.details.FDJ_FDJGXJ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="缸体构造" prop="details.FDJ_GTGZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_GTGZ.value"
            :title="engineObj.details.FDJ_GTGZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="ECU电控单元生产厂" prop="details.FDJ_DKDYSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_DKDYSCS.value"
            :title="engineObj.details.FDJ_DKDYSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="ECU电控单元(硬件)型号" prop="details.FDJ_DKDYYJXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_DKDYYJXH.value"
            :title="engineObj.details.FDJ_DKDYYJXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="ECU软体生产厂" prop="details.FDJ_RTSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_RTSCS.value"
            :title="engineObj.details.FDJ_RTSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="ECU软体型号" prop="details.FDJ_RYXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_RYXH.value"
            :title="engineObj.details.FDJ_RYXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="EGR生产厂" prop="details.FDJ_SCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_SCS.value"
            :title="engineObj.details.FDJ_SCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="EGR型号" prop="details.FDJ_XH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_XH.value"
            :title="engineObj.details.FDJ_XH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="排气背压(kPa)" prop="details.FDJ_PQBY.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PQBY.value"
            :title="engineObj.details.FDJ_PQBY.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="燃料及硫含量(10-6)" prop="details.FDJ_RLJLHL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_RLJLHL.value"
            :title="engineObj.details.FDJ_RLJLHL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="供油系统形式" prop="details.FDJ_GYXTXS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_GYXTXS.value"
            :title="engineObj.details.FDJ_GYXTXS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="调速器生产厂" prop="details.FDJ_TSQSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_TSQSCS.value"
            :title="engineObj.details.FDJ_TSQSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="调速器型号" prop="details.FDJ_TSQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_TSQXH.value"
            :title="engineObj.details.FDJ_TSQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="怠速转速(r/min)" prop="details.FDJ_DMZS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_DMZS.value"
            :title="engineObj.details.FDJ_DMZS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="发动机点火方式" prop="details.FDJ_FDJDHFS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FDJDHFS.value"
            :title="engineObj.details.FDJ_FDJDHFS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="喷油器生产厂" prop="details.FDJ_PYQSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PYQSCS.value"
            :title="engineObj.details.FDJ_PYQSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="喷油器型号" prop="details.FDJ_PYQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PYQXH.value"
            :title="engineObj.details.FDJ_PYQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="喷油泵生产厂" prop="details.FDJ_PYBSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PYBSCS.value"
            :title="engineObj.details.FDJ_PYBSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="喷油泵型号" prop="details.FDJ_PYBXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PYBXH.value"
            :title="engineObj.details.FDJ_PYBXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="喷油器喷射压力(MPa)" prop="details.FDJ_PYQPSYL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PYQPSYL.value"
            :title="engineObj.details.FDJ_PYQPSYL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="进气方式" prop="details.FDJ_JQFS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_JQFS.value"
            :title="engineObj.details.FDJ_JQFS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="进气阻力(kPa)" prop="details.FDJ_JQZL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_JQZL.value"
            :title="engineObj.details.FDJ_JQZL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="中冷器型号" prop="details.FDJ_ZLQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZLQXH.value"
            :title="engineObj.details.FDJ_ZLQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="中冷器生产厂" prop="details.FDJ_ZLQSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZLQSCS.value"
            :title="engineObj.details.FDJ_ZLQSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="中冷器形式" prop="details.FDJ_ZLQXS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZLQXS.value"
            :title="engineObj.details.FDJ_ZLQXS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="最高出口温度(℃)" prop="details.FDJ_ZGCKWD.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZGCKWD.value"
            :title="engineObj.details.FDJ_ZGCKWD.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="最高空车转速(r/min)" prop="details.FDJ_ZGKCZS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZGKCZS.value"
            :title="engineObj.details.FDJ_ZGKCZS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大净功率/转速" prop="details.FDJ_ZDJGLZS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZDJGLZS.value"
            :title="engineObj.details.FDJ_ZDJGLZS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="额定功率转速时每冲程燃料供给量(ml)" prop="details.FDJ_EDGLZSSMCCRLGGL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_EDGLZSSMCCRLGGL.value"
            :title="engineObj.details.FDJ_EDGLZSSMCCRLGGL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="单缸进/排气阀数" prop="details.FDJ_DGJPQFS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_DGJPQFS.value"
            :title="engineObj.details.FDJ_DGJPQFS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大扭矩转速时每冲程燃料供给量(ml)" prop="details.FDJ_ZDNJZSSMCCRLGGL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZDNJZSSMCCRLGGL.value"
            :title="engineObj.details.FDJ_ZDNJZSSMCCRLGGL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="增压器生产厂" prop="details.FDJ_ZYQSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZYQSCS.value"
            :title="engineObj.details.FDJ_ZYQSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="增压器型号" prop="details.FDJ_ZYQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZYQXH.value"
            :title="engineObj.details.FDJ_ZYQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒捕集器型号" prop="details.FDJ_KLBJQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJQXH.value"
            :title="engineObj.details.FDJ_KLBJQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒捕集器安装位置" prop="details.FDJ_KLBJQAZWZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJQAZWZ.value"
            :title="engineObj.details.FDJ_KLBJQAZWZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒物捕集器结构" prop="details.FDJ_KLBJQJG.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJQJG.value"
            :title="engineObj.details.FDJ_KLBJQJG.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒物捕集器型式" prop="details.FDJ_KLBJQXS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJQXS.value"
            :title="engineObj.details.FDJ_KLBJQXS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒物捕集器容积(ml)" prop="details.FDJ_KLBJQRJ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJQRJ.value"
            :title="engineObj.details.FDJ_KLBJQRJ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="后处理控制器生产厂" prop="details.FDJ_HCLKZQSCS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_HCLKZQSCS.value"
            :title="engineObj.details.FDJ_HCLKZQSCS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="后处理控制器型号" prop="details.FDJ_HCLKZQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_HCLKZQXH.value"
            :title="engineObj.details.FDJ_HCLKZQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="反应剂正常工作温度范围(K)" prop="details.FDJ_FYJZCGZWDFW.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FYJZCGZWDFW.value"
            :title="engineObj.details.FDJ_FYJZCGZWDFW.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="反应剂类型和浓度" prop="details.FDJ_FYJLXHND.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_FYJLXHND.value"
            :title="engineObj.details.FDJ_FYJLXHND.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="再生的温度(K)" prop="details.FDJ_ZSDWD.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZSDWD.value"
            :title="engineObj.details.FDJ_ZSDWD.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="压力范围(kPa)" prop="details.FDJ_YLFW.value">
          <el-input
            maxlength="200"
            k
            v-model="engineObj.details.FDJ_YLFW.value"
            :title="engineObj.details.FDJ_YLFW.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="尿素可用里程理论值" prop="details.FDJ_NSKYLCLLZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_NSKYLCLLZ.value"
            :title="engineObj.details.FDJ_NSKYLCLLZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="尿素可用里程实际值" prop="details.FDJ_NSKYLCSJZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_NSKYLCSJZ.value"
            :title="engineObj.details.FDJ_NSKYLCSJZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="尿素消耗比例理论值" prop="details.FDJ_NSXHBLLLZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_NSXHBLLLZ.value"
            :title="engineObj.details.FDJ_NSXHBLLLZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="尿素消耗比例实际值" prop="details.FDJ_NSXHBLSJZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_NSXHBLSJZ.value"
            :title="engineObj.details.FDJ_NSXHBLSJZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="空滤器生产企业" prop="details.FDJ_KLQSCQY.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLQSCQY.value"
            :title="engineObj.details.FDJ_KLQSCQY.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="空滤器型号" prop="details.FDJ_KLQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLQXH.value"
            :title="engineObj.details.FDJ_KLQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="空气喷射系统型式" prop="details.FDJ_KQPSXTXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KQPSXTXH.value"
            :title="engineObj.details.FDJ_KQPSXTXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="载体孔密度" prop="details.FDJ_ZTKMD.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZTKMD.value"
            :title="engineObj.details.FDJ_ZTKMD.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="载体生产厂" prop="details.FDJ_ZTSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZTSCC.value"
            :title="engineObj.details.FDJ_ZTSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="载体材料及结构" prop="details.FDJ_ZTCLJJG.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZTCLJJG.value"
            :title="engineObj.details.FDJ_ZTCLJJG.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化转化器生产厂" prop="details.FDJ_CHZHQSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHZHQSCC.value"
            :title="engineObj.details.FDJ_CHZHQSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化转化器作用形式/催化器载体材料" prop="details.FDJ_CHZHQZYXS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHZHQZYXS.value"
            :title="engineObj.details.FDJ_CHZHQZYXS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化转化器型号" prop="details.FDJ_CHZHQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHZHQXH.value"
            :title="engineObj.details.FDJ_CHZHQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化转化器装车数量" prop="details.FDJ_CHZHQZCSL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHZHQZCSL.value"
            :title="engineObj.details.FDJ_CHZHQZCSL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化转化器正常温度范围(K)" prop="details.FDJ_CHZHQZCWDFW.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHZHQZCWDFW.value"
            :title="engineObj.details.FDJ_CHZHQZCWDFW.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="贵金属(催化剂)种类" prop="details.FDJ_GJSCHJZL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_GJSCHJZL.value"
            :title="engineObj.details.FDJ_GJSCHJZL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="贵金属(催化剂)总含量(g)" prop="details.FDJ_GJSCHJZHL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_GJSCHJZHL.value"
            :title="engineObj.details.FDJ_GJSCHJZHL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="贵金属(催化剂)比例" prop="details.FDJ_GJSCHJBL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_GJSCHJBL.value"
            :title="engineObj.details.FDJ_GJSCHJBL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化单元数目" prop="details.FDJ_CHDYSM.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHDYSM.value"
            :title="engineObj.details.FDJ_CHDYSM.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="催化转化器容积(ml)" prop="details.FDJ_CHZHQRJ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_CHZHQRJ.value"
            :title="engineObj.details.FDJ_CHZHQRJ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="再生系统2次再生之间的ETC循环次数" prop="details.FDJ_ZSXT.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZSXT.value"
            :title="engineObj.details.FDJ_ZSXT.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="后处理进气口据发动机排气口距离" prop="details.FDJ_HCLJQKJFDJPQKJL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_HCLJQKJFDJPQKJL.value"
            :title="engineObj.details.FDJ_HCLJQKJFDJPQKJL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="保温材料" prop="details.FDJ_BWCL.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_BWCL.value"
            :title="engineObj.details.FDJ_BWCL.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否与发动机认证一致">
          <el-select
            v-model="engineObj.details.FDJ_SFYFDJRZYZ.value"
            :title="engineObj.details.FDJ_SFYFDJRZYZ.value"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后处理是否保温">
          <el-select
            v-model="engineObj.details.FDJ_HCLSFBW.value"
            :title="engineObj.details.FDJ_HCLSFBW.value"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排气消声器生产厂" prop="details.FDJ_PQXSQSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PQXSQSCC.value"
            :title="engineObj.details.FDJ_PQXSQSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="排气消声器型号" prop="details.FDJ_PQXSQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_PQXSQXH.value"
            :title="engineObj.details.FDJ_PQXSQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="氮氧传感器生产厂" prop="details.FDJ_DYCGQSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_DYCGQSCC.value"
            :title="engineObj.details.FDJ_DYCGQSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="氮氧传感器型号" prop="details.FDJ_DYCGQXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_DYCGQXH.value"
            :title="engineObj.details.FDJ_DYCGQXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="涂层生产厂" prop="details.FDJ_TCSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_TCSCC.value"
            :title="engineObj.details.FDJ_TCSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒捕集器生产厂" prop="details.FDJ_KLBJQSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJQSCC.value"
            :title="engineObj.details.FDJ_KLBJQSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="颗粒捕集器再生方法" prop="details.FDJ_KLBJJZSFF.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_KLBJJZSFF.value"
            :title="engineObj.details.FDJ_KLBJJZSFF.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="OBD生产厂" prop="details.FDJ_OBDSCC.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_OBDSCC.value"
            :title="engineObj.details.FDJ_OBDSCC.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="OBD型号" prop="details.FDJ_OBDXH.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_OBDXH.value"
            :title="engineObj.details.FDJ_OBDXH.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="总线协议" prop="details.FDJ_ZXXY.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZXXY.value"
            :title="engineObj.details.FDJ_ZXXY.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="总线类型" prop="details.FDJ_ZXLX.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZXLX.value"
            :title="engineObj.details.FDJ_ZXLX.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="诊断协议" prop="details.FDJ_ZDXY.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ZDXY.value"
            :title="engineObj.details.FDJ_ZDXY.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="接口位置" prop="details.FDJ_JKWZ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_JKWZ.value"
            :title="engineObj.details.FDJ_JKWZ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="外特性-转速(r/min)" prop="details.FDJ_WTXZS.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_WTXZS.value"
            :title="engineObj.details.FDJ_WTXZS.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="外特性-扭矩(N.m)" prop="details.FDJ_WTXNJ.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_WTXNJ.value"
            :title="engineObj.details.FDJ_WTXNJ.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="ETC试验循环功(kWh)" prop="details.FDJ_ETCSYXHG.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_ETCSYXHG.value"
            :title="engineObj.details.FDJ_ETCSYXHG.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="接口类型" prop="details.FDJ_JKLX.value">
          <el-input
            maxlength="200"
            v-model="engineObj.details.FDJ_JKLX.value"
            :title="engineObj.details.FDJ_JKLX.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否加密">
          <el-select
            v-model="engineObj.details.FDJ_SFJM.value"
            :title="engineObj.details.FDJ_SFJM.value"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口照片" class="hover">
          <img v-if="imageUrl" :src="imageUrl" class="pic" />
          <div v-if="imageUrl&&dialogType!=='see'" class="pic_delete">
            <div class="pic_box">
              <span @click="handleRemove">
                <i class="el-icon-delete"></i>
              </span>
            </div>
          </div>
          <el-upload
            ref="upload"
            class="pic-uploader"
            :action="action"
            :show-file-list="false"
            accept="image/jpg, image/jpeg, image/png"
            :before-upload="onBeforeUpload"
            :on-success="handleSucess"
          >
            <i v-if="!imageUrl" class="el-icon-plus pic-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogType!== 'see'">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiConfig from "@/assets/js/config";
import { getEnginePage } from "@/assets/api/information.js";
export default {
  name: "EngineAdmin",
  data() {
    const ENGINEOBJ = {
      afterAirOut: "",
      airCylinderType: "",
      business: "",
      calid: "",
      cvn: "",
      decorate: "",
      etc: "",
      maxPower: "",
      model: "",
      output: "",
      ratedPower: "",
      torque: "",
      wthc: "",
      details: {
        FDJ_FFDJPFBZ: {
          propertyId: "FDJ_FFDJPFBZ",
          value: ""
        },
        FDJ_SFYFFDJ: {
          propertyId: "FDJ_SFYFFDJ",
          value: ""
        },
        FDJ_FFDJSCQY: {
          propertyId: "FDJ_FFDJSCQY",
          value: ""
        },
        FDJ_FFDJRLLX: {
          propertyId: "FDJ_FFDJRLLX",
          value: ""
        },
        FDJ_RSSJG: {
          propertyId: "FDJ_RSSJG",
          value: ""
        },
        FDJ_RJYSB: {
          propertyId: "FDJ_RJYSB",
          value: ""
        },
        FDJ_LQFS: {
          propertyId: "FDJ_LQFS",
          value: ""
        },
        FDJ_GSGJXC: {
          propertyId: "FDJ_GSGJXC",
          value: ""
        },
        FDJ_FDJGXJ: {
          propertyId: "FDJ_FDJGXJ",
          value: ""
        },
        FDJ_GTGZ: {
          propertyId: "FDJ_GTGZ",
          value: ""
        },
        FDJ_DKDYSCS: {
          propertyId: "FDJ_DKDYSCS",
          value: ""
        },
        FDJ_DKDYYJXH: {
          propertyId: "FDJ_DKDYYJXH",
          value: ""
        },
        FDJ_RTSCS: {
          propertyId: "FDJ_RTSCS",
          value: ""
        },
        FDJ_RYXH: {
          propertyId: "FDJ_RYXH",
          value: ""
        },
        FDJ_SCS: {
          propertyId: "FDJ_SCS",
          value: ""
        },
        FDJ_XH: {
          propertyId: "FDJ_XH",
          value: ""
        },
        FDJ_PQBY: {
          propertyId: "FDJ_PQBY",
          value: ""
        },
        FDJ_RLJLHL: {
          propertyId: "FDJ_RLJLHL",
          value: ""
        },
        FDJ_GYXTXS: {
          propertyId: "FDJ_GYXTXS",
          value: ""
        },
        FDJ_TSQSCS: {
          propertyId: "FDJ_TSQSCS",
          value: ""
        },
        FDJ_TSQXH: {
          propertyId: "FDJ_TSQXH",
          value: ""
        },
        FDJ_DMZS: {
          propertyId: "FDJ_DMZS",
          value: ""
        },
        FDJ_FDJDHFS: {
          propertyId: "FDJ_FDJDHFS",
          value: ""
        },
        FDJ_PYQSCS: {
          propertyId: "FDJ_PYQSCS",
          value: ""
        },
        FDJ_PYQXH: {
          propertyId: "FDJ_PYQXH",
          value: ""
        },
        FDJ_PYBSCS: {
          propertyId: "FDJ_PYBSCS",
          value: ""
        },
        FDJ_PYBXH: {
          propertyId: "FDJ_PYBXH",
          value: ""
        },
        FDJ_PYQPSYL: {
          propertyId: "FDJ_PYQPSYL",
          value: ""
        },
        FDJ_JQFS: {
          propertyId: "FDJ_JQFS",
          value: ""
        },
        FDJ_JQZL: {
          propertyId: "FDJ_JQZL",
          value: ""
        },
        FDJ_ZLQXH: {
          propertyId: "FDJ_ZLQXH",
          value: ""
        },
        FDJ_ZLQSCS: {
          propertyId: "FDJ_ZLQSCS",
          value: ""
        },
        FDJ_ZLQXS: {
          propertyId: "FDJ_ZLQXS",
          value: ""
        },
        FDJ_ZGCKWD: {
          propertyId: "FDJ_ZGCKWD",
          value: ""
        },
        FDJ_ZGKCZS: {
          propertyId: "FDJ_ZGKCZS",
          value: ""
        },
        FDJ_ZDJGLZS: {
          propertyId: "FDJ_ZDJGLZS",
          value: ""
        },
        FDJ_EDGLZSSMCCRLGGL: {
          propertyId: "FDJ_EDGLZSSMCCRLGGL",
          value: ""
        },
        FDJ_DGJPQFS: {
          propertyId: "FDJ_DGJPQFS",
          value: ""
        },
        FDJ_ZDNJZSSMCCRLGGL: {
          propertyId: "FDJ_ZDNJZSSMCCRLGGL",
          value: ""
        },
        FDJ_ZYQSCS: {
          propertyId: "FDJ_ZYQSCS",
          value: ""
        },
        FDJ_ZYQXH: {
          propertyId: "FDJ_ZYQXH",
          value: ""
        },
        FDJ_KLBJQXH: {
          propertyId: "FDJ_KLBJQXH",
          value: ""
        },
        FDJ_KLBJQAZWZ: {
          propertyId: "FDJ_KLBJQAZWZ",
          value: ""
        },
        FDJ_KLBJQJG: {
          propertyId: "FDJ_KLBJQJG",
          value: ""
        },
        FDJ_KLBJQXS: {
          propertyId: "FDJ_KLBJQXS",
          value: ""
        },
        FDJ_KLBJQRJ: {
          propertyId: "FDJ_KLBJQRJ",
          value: ""
        },
        FDJ_HCLKZQSCS: {
          propertyId: "FDJ_HCLKZQSCS",
          value: ""
        },
        FDJ_HCLKZQXH: {
          propertyId: "FDJ_HCLKZQXH",
          value: ""
        },
        FDJ_FYJZCGZWDFW: {
          propertyId: "FDJ_FYJZCGZWDFW",
          value: ""
        },
        FDJ_FYJLXHND: {
          propertyId: "FDJ_FYJLXHND",
          value: ""
        },
        FDJ_ZSDWD: {
          propertyId: "FDJ_ZSDWD",
          value: ""
        },
        FDJ_YLFW: {
          propertyId: "FDJ_YLFW",
          value: ""
        },
        FDJ_NSKYLCLLZ: {
          propertyId: "FDJ_NSKYLCLLZ",
          value: ""
        },
        FDJ_NSKYLCSJZ: {
          propertyId: "FDJ_NSKYLCSJZ",
          value: ""
        },
        FDJ_NSXHBLLLZ: {
          propertyId: "FDJ_NSXHBLLLZ",
          value: ""
        },
        FDJ_NSXHBLSJZ: {
          propertyId: "FDJ_NSXHBLSJZ",
          value: ""
        },
        FDJ_KLQSCQY: {
          propertyId: "FDJ_KLQSCQY",
          value: ""
        },
        FDJ_KLQXH: {
          propertyId: "FDJ_KLQXH",
          value: ""
        },
        FDJ_KQPSXTXH: {
          propertyId: "FDJ_KQPSXTXH",
          value: ""
        },
        FDJ_ZTKMD: {
          propertyId: "FDJ_ZTKMD",
          value: ""
        },
        FDJ_ZTSCC: {
          propertyId: "FDJ_ZTSCC",
          value: ""
        },
        FDJ_ZTCLJJG: {
          propertyId: "FDJ_ZTCLJJG",
          value: ""
        },
        FDJ_CHZHQSCC: {
          propertyId: "FDJ_CHZHQSCC",
          value: ""
        },
        FDJ_CHZHQZYXS: {
          propertyId: "FDJ_CHZHQZYXS",
          value: ""
        },
        FDJ_CHZHQXH: {
          propertyId: "FDJ_CHZHQXH",
          value: ""
        },
        FDJ_CHZHQZCSL: {
          propertyId: "FDJ_CHZHQZCSL",
          value: ""
        },
        FDJ_CHZHQZCWDFW: {
          propertyId: "FDJ_CHZHQZCWDFW",
          value: ""
        },
        FDJ_GJSCHJZL: {
          propertyId: "FDJ_GJSCHJZL",
          value: ""
        },
        FDJ_GJSCHJZHL: {
          propertyId: "FDJ_GJSCHJZHL",
          value: ""
        },
        FDJ_GJSCHJBL: {
          propertyId: "FDJ_GJSCHJBL",
          value: ""
        },
        FDJ_CHDYSM: {
          propertyId: "FDJ_CHDYSM",
          value: ""
        },
        FDJ_CHZHQRJ: {
          propertyId: "FDJ_CHZHQRJ",
          value: ""
        },
        FDJ_ZSXT: {
          propertyId: "FDJ_ZSXT",
          value: ""
        },
        FDJ_HCLJQKJFDJPQKJL: {
          propertyId: "FDJ_HCLJQKJFDJPQKJL",
          value: ""
        },
        FDJ_BWCL: {
          propertyId: "FDJ_BWCL",
          value: ""
        },
        FDJ_SFYFDJRZYZ: {
          propertyId: "FDJ_SFYFDJRZYZ",
          value: ""
        },
        FDJ_HCLSFBW: {
          propertyId: "FDJ_HCLSFBW",
          value: ""
        },
        FDJ_PQXSQSCC: {
          propertyId: "FDJ_PQXSQSCC",
          value: ""
        },
        FDJ_PQXSQXH: {
          propertyId: "FDJ_PQXSQXH",
          value: ""
        },
        FDJ_DYCGQSCC: {
          propertyId: "FDJ_DYCGQSCC",
          value: ""
        },
        FDJ_DYCGQXH: {
          propertyId: "FDJ_DYCGQXH",
          value: ""
        },
        FDJ_TCSCC: {
          propertyId: "FDJ_TCSCC",
          value: ""
        },
        FDJ_KLBJQSCC: {
          propertyId: "FDJ_KLBJQSCC",
          value: ""
        },
        FDJ_KLBJJZSFF: {
          propertyId: "FDJ_KLBJJZSFF",
          value: ""
        },
        FDJ_OBDSCC: {
          propertyId: "FDJ_OBDSCC",
          value: ""
        },
        FDJ_OBDXH: {
          propertyId: "FDJ_OBDXH",
          value: ""
        },
        FDJ_ZXXY: {
          propertyId: "FDJ_ZXXY",
          value: ""
        },
        FDJ_ZXLX: {
          propertyId: "FDJ_ZXLX",
          value: ""
        },
        FDJ_ZDXY: {
          propertyId: "FDJ_ZDXY",
          value: ""
        },
        FDJ_JKWZ: {
          propertyId: "FDJ_JKWZ",
          value: ""
        },
        FDJ_JKZP: {
          propertyId: "FDJ_JKZP",
          value: ""
        },
        FDJ_JKLX: {
          propertyId: "FDJ_JKLX",
          value: ""
        },
        FDJ_SFJM: {
          propertyId: "FDJ_SFJM",
          value: ""
        },
        FDJ_WTXZS: {
          propertyId: "FDJ_WTXZS",
          value: ""
        },
        FDJ_WTXNJ: {
          propertyId: "FDJ_WTXNJ",
          value: ""
        },
        FDJ_ETCSYXHG: {
          propertyId: "FDJ_ETCSYXHG",
          value: ""
        }
      }
    };
    return {
      //弹窗是否显示
      dialogVisible: false,
      loading: null,
      //搜索条件
      modelSearch: "",
      engineTypeSearch: "",
      dialogType: "add",
      formEditDisabled: false, //默认为不禁用
      dialogTitle: "编辑发动机信息", //弹框的标题
      tableData: [], //表格数据
      currentPage: 1, //当前页
      pagesize: 10, //页数据条数
      total: 0, //总数
      imageId: "", //c接口图片id
      dialogTitle: "", //弹窗标题
      action: apiConfig.API_CONFIG + "/upload",
      engineData: ENGINEOBJ,
      engineObj: JSON.parse(JSON.stringify(ENGINEOBJ)),
      rules: {
        //校验规则
        model: [
          { required: true, message: "请输入发动机型号" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        business: [
          { required: true, message: "请输入发动机生产企业" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        output: [
          { required: true, message: "请输入发动机排量" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        airCylinderType: [
          { required: true, message: "请输入气缸排列型式" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        maxPower: [
          { required: true, message: "请输入最大功率/转速" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        afterAirOut: [
          { required: true, message: "请输入排气后处理系统形式" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        etc: [
          { required: true, message: "请输入ETC循环功" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        wthc:[
          { required: true, message: "请输入WTHC循环功" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        torque: [
          { required: true, message: "请输入参考扭矩" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        calid: [
          { required: true, message: "请输入软件标定识别号" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        cvn: [
          { required: true, message: "请输入标定验证码" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        ratedPower: [
          { required: true, message: "请输入发动机额定功率" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        decorate: [
          { required: true, message: "请输入发动机布置方式" },
          { max: 200, min: 0, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FFDJPFBZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_SFYFFDJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FFDJSCQY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FFDJRLLX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_RSSJG.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
           "details.FDJ_RJYSB.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        
        "details.FDJ_LQFS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_GSGJXC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FDJGXJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_GTGZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_DKDYSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_DKDYYJXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_RTSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_RYXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_SCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_XH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PQBY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_RLJLHL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_GYXTXS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_TSQSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_TSQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_DMZS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FDJDHFS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PYQSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PYQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PYBSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PYBXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PYQPSYL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_JQFS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_JQZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZLQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZLQSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZLQXS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
           "details.FDJ_ZGCKWD.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        
        "details.FDJ_ZGKCZS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZDJGLZS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_EDGLZSSMCCRLGGL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_DGJPQFS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZDNJZSSMCCRLGGL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZYQSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZYQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJQAZWZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJQJG.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJQXS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_QDXSJWZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJQRJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_HCLKZQSCS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_HCLKZQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FYJZCGZWDFW.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_FYJLXHND.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZSDWD.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_YLFW.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_NSKYLCLLZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_NSKYLCSJZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_NSXHBLLLZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_NSXHBLSJZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLQSCQY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KQPSXTXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZTKMD.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZTSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZTCLJJG.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHZHQSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHZHQZYXS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHZHQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHZHQZCSL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHZHQZCWDFW.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_GJSCHJZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_GJSCHJZHL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_GJSCHJBL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHDYSM.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_CHZHQRJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZSXT.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_HCLJQKJFDJPQKJL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_BWCL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_SFYFDJRZYZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_HCLSFBW.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PQXSQSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_PQXSQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_DYCGQSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_DYCGQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_TCSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJQSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_KLBJJZSFF.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_OBDSCC.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_OBDXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZXXY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZXLX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ZDXY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_JKWZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_JKZP.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_JKLX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_SFJM.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_WTXZS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_WTXNJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.FDJ_ETCSYXHG.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    imageUrl() {
      if (this.imageId) {
        return apiConfig.API_CONFIG + "/download/preview/" + this.imageId;
      } else {
        return null;
      }
    }
  },
  mounted() {
    this.searchEngineList();
  },
  methods: {
    reset() {
      this.engineTypeSearch = "";
      this.modelSearch = "";
    },
    importTable() {
      this.$message.warning("导入功能开发中...");
    },
    exportTable() {
      this.$message.warning("导出功能开发中...");
    },
    //关闭前回调
    closeDialog(done) {
      this.$refs.addEngineForm.clearValidate();
      done();
    },
    searchEngineList() {
      this.engineTypeSearch = this.modelSearch;
      this.currentPage = 1;
      this.getPages();
    },
    getPages() {
      getEnginePage( {
          page: {
            current: this.currentPage,
            size: this.pagesize,
            orders: [
              {
                asc: false,
                column: "ID"
              }
            ]
          },
          querys: [
            {
              like: {
                model: this.engineTypeSearch
              }
            }
          ]
        })
        .then(resp => {
          if (resp.data.ok) {
            this.tableData = resp.data.data.records;
            this.total = parseInt(resp.data.data.total);
            this.$nextTick(() => {
              this.$refs.elTable.doLayout();
            });
          } else {
            this.$message.error(resp.data.message);
          }
        })
        .catch(error => {
          this.$message.error("查询失败");
        });
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage;
      this.getPages();
    },
    size_change(size) {
      this.pagesize = size;
      this.getPages();
    },
    addEngine() {
      this.formEditDisabled = false;
      this.dialogType = "add";
      this.dialogVisible = true;
      this.dialogTitle = "新增发动机信息";
      this.imageId = "";
      this.addEngine
      this.engineObj = JSON.parse(JSON.stringify(this.engineData));
      this.$nextTick(() => {
        this.$refs.addEngineForm.clearValidate();
      });
    },
    //上传前回调
    onBeforeUpload(file) {
      const isIMAGE =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt1M = file.size < 2 * 1024 * 1024;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      if (isIMAGE && isLt1M) {
        this.loading = this.$loading({
          lock: true,
          text: "Loading...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        return true;
      } else {
        return false;
      }
    },
    //删除接口图片
    handleRemove() {
      this.imageId = "";
      this.engineObj.details.FDJ_JKZP.value = this.imageId;
    },
    handleSucess(res) {
      //图片上传成功回调
      if (res.code === "200") {
        this.imageId = res.data.id;
        this.engineObj.details.FDJ_JKZP.value = this.imageId;
      } else {
        this.$message.error(res.msg);
      }
      let isIE10 = false;
      if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        // 判断ie10以及以下
        isIE10 = true;
      } else {
        isIE10 = false;
      }
      let ele = this.$refs.upload.$el.getElementsByTagName("input")[0];
      if (isIE10) {
        let form = document.createElement("form");
        let beforInput = ele.nextSibling;
        let parentInput = ele.parentNode;
        form.appendChild(ele);
        form.reset();
        parentInput.insertBefore(ele, beforInput);
      } else {
        ele.value = null;
      }
      this.loading.close();
    },
    //查看发动机信息
    handleSee(index, row) {
      this.formEditDisabled = true;
      this.dialogType = "see";
      this.dialogTitle = "查看发动机信息";
      this.getEngineInfor(row.id);
      this.dialogVisible = true;
    },
    //编辑发动机信息
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.dialogTitle = "编辑发动机信息";
      this.getEngineInfor(row.id);
    },
    //删除发动机信息
    handleDelete(index, row) {
      this.$confirm("确定删除该发动机信息？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.delete("/baseinfo/engine/" + row.id).then(({ data }) => {
          if (data.code === "200") {
            let totalPage = Math.ceil((Number(this.total) - 1) / this.pagesize);
            let currentPage =
              this.currentPage > totalPage ? totalPage : this.currentPage;
            this.currentPage = currentPage < 1 ? 1 : currentPage;
            this.searchEngineList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //获取发动机详情
    getEngineInfor(id) {
      this.$http.get("/baseinfo/engine/" + id).then(({ data }) => {
        if (data.code === "200") {
          this.engineObj = data.data;
          console.log(this.engineObj);
          this.imageId = this.engineObj.details.FDJ_JKZP.value;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //取消确认
    cancelEdit() {
      this.dialogVisible = false;
      this.$refs.addEngineForm.clearValidate();
    },
    //新增车辆方法
    confirmSubmit(data) {
      this.$http.post("/baseinfo/engine", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit();
          this.$message.success("新增成功");
          this.searchEngineList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //编辑终端方法
    confirmEidt(data) {
      this.$http.put("/baseinfo/engine", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit();
          this.$message.success("编辑成功");
          this.searchEngineList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //确定
    save() {
      this.$refs.addEngineForm.validate(valid => {
        if (valid) {
          if (this.dialogType === "add") {
            this.confirmSubmit(this.engineObj);
          } else if (this.dialogType === "edit") {
            this.confirmEidt(this.engineObj);
            this.$refs.addEngineForm.clearValidate();
          }
        } else {
          return false;
        }
      });
    }
  },
  activated() {}
};
</script>

<style lang='less' scoped>
.content {
  width: 100%;
  background: #fff;
  padding: 10px;
}

/deep/ .el-table__fixed-right {
  height: 100% !important;
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
  max-height: calc(100% - 10px);
  max-width: calc(100% - 10px);
}

/deep/ .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.formTitle {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 10px;
}
.el-form .el-input {
  width: 200px;
  margin-right: 5px;
}
.el-form .el-select {
  width: 200px;
  margin-right: 5px;
}
.content .el-table {
  margin-top: 10px;
}
.formTitle span {
  padding-left: 10px;
  border-left: 3px solid #66b1ff;
}
.dialog-footer {
  text-align: center;
  width: 100%;
  background: #fff;
}
/deep/ .hover .el-form-item__content {
  width: 100px;
  height: 100px;
  vertical-align: middle;
  line-height: 100px;
  text-align: center;
}
.hover .pic_delete {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 20px;
  background: rgba(255, 255, 255, 0);
  .pic_box {
    width: 100%;
    height: 100%;
    i {
      display: none;
      cursor: pointer;
    }
  }
}
.hover .pic_delete .pic_box:hover {
  background: rgba(0, 0, 0, 0.5);
  i {
    display: inherit;
  }
}
/deep/ .pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
// 分页样式
.content .block {
  margin-top: 8px;
}
.pic {
  max-height: 100px;
  max-width: 100px;
  line-height: 100px;
  vertical-align: middle;
}
</style>
