<template>
  <div id="page">
    <div class="top">
      <ul>
        <li>
          <span>订单号：</span>
          <span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </span>
        </li>
        <li>
          <span>订单号：</span>
          <span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </span>
        </li>
        <li>
          <div>
            <el-button type="primary" size="mini">查询</el-button>
            <el-button type="danger" size="mini">重置</el-button>
          </div>
        </li>
      </ul>
      <div class="addBtn">
        <el-button type="primary" size="mini" @click="addOreder">创建订单</el-button>
      </div>
    </div>
    <div class="content">
      <div class="table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="orederNo" label="订单号" width="120"></el-table-column>
          <el-table-column prop="productNo" label="产品编号"></el-table-column>
          <el-table-column prop="orederDay" label="订单日期"></el-table-column>
          <el-table-column prop="status" label="订单状态" width="80"></el-table-column>
          <el-table-column prop="approver" label="审核人" width="80"></el-table-column>
          <el-table-column prop="name" label="描述"></el-table-column>
          <el-table-column prop="address" label="操作" width="260">
            <template slot-scope="scope">
              <el-button type="primary" size="mini">预览</el-button>
              <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
              <el-button type="primary" size="mini" @click="closeOreder(scope.row)">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabPage">
          <el-pagination
            @current-change="changePage"
            :current-page.sync="tabPage"
            layout="prev, pager, next, jumper"
            :page-size="7"
            :total="totalPage"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 创建，编辑订单 -->
    <el-dialog
      :title="orederForm.orderDialogTitle"
      custom-class="orederDialog"
      :visible.sync="orederForm.show"
      :before-close="cancelOreder"
    >
      <el-form :model="orederForm" label-width="100px">
        <el-form-item label="产品名称">
          <el-input v-model="orederForm.orederNo"></el-input>
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="orederForm.productNo"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="orederForm.unitPrice"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="orederForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="orederForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商编号">
          <el-input v-model="orederForm.supplierNo"></el-input>
        </el-form-item>
        <el-form-item label=" 审核人">
          <el-input v-model="orederForm.approver"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="orederForm.creatName"></el-input>
        </el-form-item>
        <el-form-item label="税率">
          <el-input v-model="orederForm.taxRate"></el-input>
        </el-form-item>
        <el-form-item label="税额">
          <el-input v-model="orederForm.taxAmount"></el-input>
        </el-form-item>
        <el-form-item label="价税总额">
          <el-input v-model="orederForm.totalSum"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="orederForm.orederDay"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="orederForm.orederRemarks"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          ></el-input>
        </el-form-item>
        <el-form-item label="送货须知">
          <el-input
            v-model="orederForm.shippingInfo"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
          ></el-input>
        </el-form-item>
        <el-form-item class="formBtn">
          <el-button type="primary" @click="onSubmitOreder">提交</el-button>
          <el-button @click="cancelOreder">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 关闭订单 -->
    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrederForm.show"
      width="30%"
      :before-close="cancelClose"
    >
      <span>
        <el-form :model="closeOrederForm" label-width="60px">
          <el-form-item label="订单号">
            <el-input readonly v-model="closeOrederForm.orederNo"></el-input>
          </el-form-item>
          <el-form-item label="原因">
            <el-input v-model="closeOrederForm.reason" type="textarea" :rows="6"></el-input>
          </el-form-item>
          <el-form-item class="formBtn">
            <el-button type="primary" @click="confirmClose">确认</el-button>
            <el-button @click="cancelClose">取消</el-button>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>

    <!-- 订单预览 -->
    <el-dialog
      top="1vh"
      custom-class="orederView"
      title="订单预览"
      :visible.sync="orederView.show"
      width="90%"
      :before-close="cancelClose"
    >
      <div class="conView">
        <div class="headView">
          <span></span>
          <span></span>
        </div>
        <div class="orederInfor"></div>
        <div class="footView"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  data() {
    return {
      input: "",
      tabPage: 1,
      totalPage: 0,
      tableData: [
        {
          id: "4",
          orederNo: "4",
          productNo: "4",
          approver: "4",
          orederDay: "2020-02-22",
          supplierNo: "4",
          unitPrice: "4",
          amount: "4.0000",
          taxRate: "4.0000",
          taxAmount: "4.0000",
          totalSum: "4.0000",
          status: "4",
          orederRemarks: "4",
          shippingInfo: "4",
          createUser: "4",
          createTime: "2020-02-22 23:37:02.0",
          updateTime: "2020-02-22 23:37:02.0"
        },
        {
          id: "3",
          orederNo: "3",
          productNo: "3",
          approver: "3",
          orederDay: "2020-03-23",
          supplierNo: "3",
          unitPrice: "3",
          amount: "3.0000",
          taxRate: "3.0000",
          taxAmount: "3.0000",
          totalSum: "3.0000",
          status: "3",
          orederRemarks: "3",
          shippingInfo: "3",
          createUser: "3",
          createTime: "2020-02-22 23:36:45.0",
          updateTime: "2020-02-22 23:36:45.0"
        }
      ],
      orederForm: {
        show: false,
        orderDialogTitle: "",
        orederNo: "", // 订单号
        productNo: "", // 产品编号
        approver: "", // 审核人
        orederDay: "", // 订单日期（默认当天）
        supplierNo: "", // 供应商编号
        supplierName: "", // 供应商
        unitPrice: "", // 单价
        amount: "", // 金额
        taxRate: "", // 税率
        taxAmount: "", // 税额
        totalSum: "", // 价税总额
        orederRemarks: "", // 订单备注
        shippingInfo: "" // 送货须知
      },
      closeOrederForm: {
        show: false,
        orederNo: "",
        reason: ""
      },
      orederView: {
        show: false
      },
      ruleForm: {
        userName: "ylyao",
        passWord: "1"
      }
    };
  },
  
  mounted() {
    // this.orderList(); //获取订单列表
    // this.submitForm(); //登录接口
    // this.newOrder();
    // this.closeOrder();
    // this.productQureyOrder();//创建订单页面获取 产品型号、产品号、产品名称
    this.supplierList();
    
  },

  methods: {
      supplierList() {
      var that = this;
      that.axios
        .post("/jx_manage/user/queryList", qs.stringify(
          
          ))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
      productQureyOrder() {
      var that = this;
      that.axios
        .post("/jx_manage/product/query", qs.stringify(
          {orderNo:"YYL002",reason:"老板说不要了"}
          ))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
      closeOrder() {
      var that = this;
      that.axios
        .post("/jx_manage/orderManage/close", qs.stringify(
          {orderNo:"YYL002",reason:"老板说不要了"}
          ))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
      newOrder() {
      var that = this;
      that.axios
        .post("/jx_manage/orderManage/modify", qs.stringify(
          {orderNo :"YYL002",productNo :"YYL002",approver:"姚义庐002",orderDay:"2020-02-29",
          supplierNo:"YYL002",unitPrice:"50",
          amount:"100",taxRate:"111",taxAmount:"222",totalSum:"222",orderRemarks:"YYL002",shippingInfo:"YYL002"}
          ))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

      orderList() {
      var that = this;
      // that.$router.push("/finishOrder");
      that.axios
        .post("/jx_manage/orderManage/query", qs.stringify(
          {page :"1",limit :"7"}
          ))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
      submitForm() {
      var that = this;
      // that.$router.push("/finishOrder");
      that.axios
        // .post("/jx_manage/user/login", qs.stringify({userName :"admin",passWord :"1"}))
         .post("/jx_manage/user/getUser", qs.stringify())
        //  .post("/jx_manage/user/logout", qs.stringify({userName :"111"}))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    getTabList() {
      var that = this;
      this.axios({
        type: "POST",
        url: "/jx_manage/orderManage/query",
        data: {
          page: that.tabPage,
          limit: 7
        },
        success: {}
      });
      // this.$axios.post("/jx_manage/orederManage/query", {
      //   page: that.tabPage,
      //   limit: 7
      // })
      // .then(res => {
      //   var obj = JSON.parse(res);
      //   that.totalPage = obj.totalCount;
      //   that.tableData = obj#page.list;
      //   that.tableData.map((item, index) => {
      //     item.index = that.tabPage * 7 + index - 6;
      //   });
      // });
    },
    changePage(num) {
      this.tabPage = num;
      this.getTabList();
    },
    edit(val) {
      this.orederForm.orederNo = val.orederNo; // 订单号
      this.orederForm.productNo = val.productNo; // 产品编号
      this.orederForm.approver = val.approver; // 审核人
      this.orederForm.orederDay = val.orederDay; // 订单日期（默认当天）
      this.orederForm.supplierNo = val.supplierNo; // 供应商编号
      this.orederForm.supplierName = val.supplierName; // 供应商
      this.orederForm.unitPrice = val.unitPrice; // 单价
      this.orederForm.amount = val.amount; // 金额
      this.orederForm.taxRate = val.taxRate; // 税率
      this.orederForm.taxAmount = val.taxAmount; // 税额
      this.orederForm.totalSum = val.totalSum; // 价税总额
      this.orederForm.orederRemarks = val.orederRemarks; // 订单备注
      this.orederForm.shippingInfo = val.shippingInfo; // 送货须知
      this.orederForm.orderDialogTitle = "编辑订单";
      this.orederForm.show = true;
    },
    addOreder() {
      this.orederForm.show = true;
      this.orederForm.orderDialogTitle = "创建订单";
    },
    onSubmitOreder() {
      var that = this;
      var url =
        this.orederForm.orderDialogTitle == "创建订单"
          ? "/jx_manage/orderManage/save"
          : "/jx_manage/orderManage/modify";
      that.axios
        .post(url, qs.stringify(that.orederForm))
        .then(function(res) {
          // var res = JSON.parse(res);
           console.log(res.data.code);
          that.cancelClose();
          if (res.data.code == 0) {
            var msg =
              this.orederForm.orderDialogTitle == "创建订单"
                ? "订单创建成功"
                : "订单编辑成功";
                //  console.log(this.orederForm.orderDialogTitle);
            // that.successMsg(msg);
            that.successMsg("创建订单成功");
          } else {
            that.errorMsg(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancelOreder() {
      this.orederForm.show = false;
      this.orederForm.orederNo = ""; // 订单号
      this.orederForm.productNo = ""; // 产品编号
      this.orederForm.approver = ""; // 审核人
      this.orederForm.orederDay = ""; // 订单日期（默认当天）
      this.orederForm.supplierNo = ""; // 供应商编号
      this.orederForm.supplierName = ""; // 供应商
      this.orederForm.unitPrice = ""; // 单价
      this.orederForm.amount = ""; // 金额
      this.orederForm.taxRate = ""; // 税率
      this.orederForm.taxAmount = ""; // 税额
      this.orederForm.totalSum = ""; // 价税总额
      this.orederForm.orederRemarks = ""; // 订单备注
      this.orederForm.shippingInfo = ""; // 送货须知
    },
    closeOreder(val) {
      this.closeOrederForm.show = true;
      this.closeOrederForm.orederNo = val.orederNo;
    },
    confirmClose() {
      var that = this;
      that.axios
        .post("/jx_manage/orderManage/close", that.closeOrederForm)
        .then(function(res) {
          var res = JSON.parse(res);
          that.cancelClose();
          if (res.code == 0) {
            that.successMsg("订单关闭成功");
          } else {
            that.errorMsg(res.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancelClose() {
      this.closeOrederForm.show = false;
      this.closeOrederForm.reason = "";
    },
    successMsg(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: "success"
      });
    },
    errorMsg(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: "error",
        duration: 0
      });
    }
  }
};
</script>

<style>
.orederDialog .el-form-item {
  display: inline-block;
  width: 49%;
}
.formBtn {
  width: 100% !important;
}
.formBtn .el-form-item__content {
  text-align: center;
  margin-left: 0 !important;
}
.orederView {
  margin: 1vh auto 0 !important;
}
.orederView .el-dialog__body {
  padding: 0px 20px 30px;
}
.orederView .conView {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
}
.orederView .conView > .headView {
  width: 100%;
  height: 80px;
  border: 1px solid #4ac;
}
.orederView .conView > .headView > span:last-child {
  width: 100px;
  height: 100%;
  display: inline-block;
  background: url("../../static/img/logo.png") no-repeat;
  background-size: 90% 90%;
}
</style>
