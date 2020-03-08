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
        <el-table :data="tableData" border style="width: 99%">
          <el-table-column prop="sort" label="序号" width="60"></el-table-column>
          <el-table-column prop="orederNo" label="订单号" width="120"></el-table-column>
          <el-table-column prop="productNo" label="产品编号"></el-table-column>
          <el-table-column prop="orederDay" label="订单日期"></el-table-column>
          <el-table-column prop="status" label="订单状态" width="80"></el-table-column>
          <el-table-column prop="approver" label="审核人" width="80"></el-table-column>
          <el-table-column prop="name" label="描述"></el-table-column>
          <el-table-column prop="address" label="操作" width="260">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openOrederView(scope.row)">预览</el-button>
              <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
              <el-button type="primary" size="mini" @click="closeOreder(scope.row)">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabPage">
          <el-pagination
            @current-change="changeOrePage"
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
          <span @click="openProShow">
            <el-input v-model="orederForm.productName" readonly></el-input>
          </span>
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="orederForm.productNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="orederForm.unitPrice"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="orederForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="供应商">
          <span @click="openSupShow">
            <el-input v-model="orederForm.supplierName" readonly></el-input>
          </span>
        </el-form-item>
        <el-form-item label="供应商编号">
          <el-input v-model="orederForm.supplierNo" disabled></el-input>
        </el-form-item>
        <el-form-item label=" 审核人">
          <el-select v-model="orederForm.approver" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-select v-model="orederForm.creatName" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
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
          <el-date-picker v-model="orederForm.orederDay" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
          <!-- <el-input v-model="orederForm.orederDay"></el-input> -->
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
      :visible.sync="orederViewShow"
      width="90%"
    >
      <div class="conView">
        <div class="headView">
          <span></span>
          <span>
            <p>请于24小时内以电子邮件的方式确认；</p>
            <p>
              请核对内容，确认无误后邮件回复：
              <b>盖章后的订购单作为附件，邮件内容统一为“订单收到，将按订单要求发货”；</b>
            </p>
            <p>若不能按订单要求交货，请回复具体原因以及确认到货日期；</p>
            <p>如被接受，我公司将会更新到货日期；如不可接受，会与贵司销售人员联系，达成一致到货日期后再更新。</p>
          </span>
        </div>
        <div class="orederInfor">
          <div class="tabHead">
            <span>
              <b style="letter-spacing:10px;font-size:18px;">订购单</b>
            </span>
            <span>日期：{{orederView.orderInfoData.orderDay}}</span>
          </div>
          <div class="tabcont">
            <table>
              <tr class="padLeft">
                <td colspan="4">
                  <b>订单号：</b>
                  {{viewOrederNo}}
                </td>
                <td colspan="7">授权人：{{orederView.orderInfoData.arrivalDate}}</td>
              </tr>
              <tr class="padLeft">
                <td colspan="4">
                  <ul class="supplier">
                    <li>
                      <b>供应商编号：</b>
                      {{orederView.supplierData.accountNo}}
                    </li>
                    <li>
                      <b>供应商名称：</b>
                      {{orederView.supplierData.manageName}}
                    </li>
                    <li>供应商地址：{{orederView.supplierData.address}}</li>
                  </ul>
                  <ul class="contacts">
                    <li style="width:25%">联系人：{{orederView.supplierUserData.name}}</li>
                    <li style="width:28%">电话：{{orederView.supplierUserData.telNo}}</li>
                    <li style="width:40%">传真：{{orederView.supplierUserData.fax}}</li>
                    <li style="width:30%">手机：{{orederView.supplierUserData.phoneNo}}</li>
                    <li>邮箱：{{orederView.supplierUserData.email}}</li>
                  </ul>
                  <ul class="payment">
                    <li>
                      <b>付款信息：</b>
                    </li>
                    <li>开户行：{{orederView.supplierData.openingBank}}</li>
                    <li>账号：{{orederView.supplierData.manageNo}}</li>
                    <li>付款期限：收到全部产品与对应的原始增值税专用发票后{{orederView.supplierData.payTerm}}天</li>
                    <li>货币：{{orederView.supplierData.currenCy}}</li>
                  </ul>
                </td>
                <td colspan="7">
                  <ul class="consignee">
                    <li style="width:100%">
                      <b>收货信息：</b>
                    </li>
                    <li style="width:100%">收货地址：{{orederView.orderInfoData.address}}</li>
                    <li style="width:20%">收货人：{{orederView.orderInfoData.name}}</li>
                    <li style="width:70%">手机：{{orederView.orderInfoData.phoneNo}}</li>
                    <li style="width:20%">座机：{{orederView.orderInfoData.telNo}}</li>
                    <li>邮箱：{{orederView.orderInfoData.email}}</li>
                  </ul>
                  <ul class="invoice">
                    <li>
                      <b>开票资料（请在发票备注栏注明订单号；发票单价与订单保持一致，小数点后最多保留4位）：</b>
                    </li>
                    <li>名称：{{orederView.invoiceData.invoiceName}}</li>
                    <li>税号：{{orederView.invoiceData.invoiceNo}}</li>
                    <li>注册地址：{{orederView.invoiceData.ivoiceAddress}}</li>
                    <li>开户行及账号：{{orederView.invoiceData.invoiceBank}}{{orederView.invoiceData.invoiceAccountNo}}</li>
                  </ul>
                  <ul class="address">
                    <li style="width:80%">
                      <b>发票寄送：</b>
                    </li>
                    <li>
                      <b>地址：</b>
                      {{orederView.invoiceData.invoiceDescribe}}
                    </li>
                  </ul>
                </td>
              </tr>
              <tr style="text-align: center;">
                <td>
                  <b>项次</b>
                </td>
                <td>
                  <b>内容</b>
                </td>
                <td>
                  <b>产品规格与描述</b>
                </td>
                <td>
                  <b>订购数量</b>
                </td>
                <td>
                  <b>单位</b>
                </td>
                <td>
                  <b>单价（不含税）</b>
                </td>
                <td>
                  <b>单位</b>
                </td>
                <td>
                  <b>金额</b>
                </td>
                <td>
                  <b>税率</b>
                </td>
                <td>
                  <b>税额</b>
                </td>
                <td>
                  <b>到货日期</b>
                </td>
              </tr>
              <tr style="text-align: center;" v-for="(item,i) in orederView.productDatas">
                <td>{{i+1}}</td>
                <td>{{item.productName}}</td>
                <td>{{item.productDecribe}}</td>
                <td>{{item.number}}</td>
                <td>{{item.unitPrice}}</td>
                <td>{{item.taxRate}}</td>
                <td>{{item.unitPrice}}</td>
                <td>{{item.unitPrice}}</td>
                <td>{{item.taxRate}}</td>
                <td>{{item.taxAmount}}</td>
                <td>{{item.arrivalDate}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="footView">
          <b>送货须知：</b>
          <br />1. 请在送货单及船运文件上注明订单号，产品名称及数量。
          <br />2. 请随货发送产品质量证明文件（纸质版）。随货发送的文件电子版需在到货前发送至收货人电子邮箱。
          <br />3. 供应商自行承担费用将符合产品质量标准的产品在订单要求的到货日期（当日或提前）交付至订单指定的地点。
          <br />4. 所有货物包装必须按照国家有关部门的规定进行标识，卖方保证给予买方的价格已包含上述包装所需的费用。
          <br />5. 接收全部或部分货物不视为买方下述权利的放弃：1）取消或退回未经确认的订购单中的货物、有缺陷的货物、有潜在或其他违反卖方保证的货物；
          <br />2）要求赔偿的权利。包括生产成本，利润及其他损害。上述权利不排除法律赋予卖方的其他救济。
        </div>
      </div>
    </el-dialog>

    <!-- 产品列表 -->
    <el-dialog top="10vh" title="产品信息" :visible.sync="productShow" width="50%">
      <div class="diaTab">
        <el-table :data="productList" border style="width: 99%">
          <el-table-column prop="sort" label="序号" width="60"></el-table-column>
          <el-table-column prop="modelNo" label="产品型号" width="120"></el-table-column>
          <el-table-column prop="productNo" label="产品号"></el-table-column>
          <el-table-column prop="productName" label="产品名称"></el-table-column>
          <el-table-column prop="address" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="choicePro(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabPage">
          <el-pagination
            @current-change="changeProPage"
            :current-page.sync="proPage"
            layout="prev, pager, next, jumper"
            :page-size="7"
            :total="proTotal"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>

    <!-- 供应商信息 -->
    <el-dialog top="10vh" title="供应商信息" :visible.sync="supplierShow" width="40%">
      <div class="diaTab">
        <el-table :data="supplierList" border style="width: 99%">
          <el-table-column prop="sort" label="序号" width="60"></el-table-column>
          <el-table-column prop="manageName" label="供应商名称" width="140"></el-table-column>
          <el-table-column prop="manageNo" label="供应商编号"></el-table-column>
          <el-table-column prop="address" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="choiceSup(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabPage">
          <el-pagination
            @current-change="changeSupPage"
            :current-page.sync="supPage"
            layout="prev, pager, next, jumper"
            :page-size="7"
            :total="supTotal"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs';
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
      // 创建编辑订单
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
      orederViewShow: false,
      viewOrederNo: "",
      orederView: {
        //订单预览
        invoiceData: {
          invoiceName: "上海加鑫净化设备有限公司",
          invoicePhoneno: "021-62115062",
          invoiceAccountNo: "452059215440",
          invoiceNo: "91310117743271506H ",
          ivoiceAddress: "上海市松江区南乐路158号1幢1层Z1室",
          invoiceDescribe: "杭州市西湖区，摇啊摇，17612176964",
          invoiceBank: "中国银行上海市杨思支行"
        },
        supplierData: {
          address: "湖南省郴州市",
          payTerm: "45",
          accountNo: "1212345678",
          manageName: "湖南省凯纳方科技有限公司",
          currenCy: "RMB",
          manageNo: "HNKNF001",
          openingBank: "中国银行"
        },
        orderInfoData: {
          address: "奉贤",
          shippingInfo: "送货须知",
          name: "张大大",
          phoneNo: "187121212",
          telNo: "101-12122",
          email: "ius@126.com",
          orderDay: "2020-02-25"
        },
        supplierUserData: {
          name: "何老板",
          fax: "432000",
          telNo: "137901920",
          phoneNo: "122122",
          email: "111@126.com"
        },
        productDatas: [
          {
            unitPrice: "50.0000",
            number: "1000",
            taxRate: "0.1300",
            productDecribe: "导电布啊啊啊",
            taxAmount: "1111111",
            productName: "导电布测试",
            remarks: "1231",
            arrivalDate: "2020-02-26"
          },
          {
            unitPrice: "88.0000",
            number: "88",
            taxRate: "8.0000",
            productDecribe: "无纺布",
            taxAmount: "2222",
            productName: "无纺布测试",
            remarks: "8",
            arrivalDate: "2020-02-29"
          }
        ]
      },
      // 产品信息
      productShow: false,
      productList: [],
      proPage: 1,
      proTotal: 0,
      // 供应商
      supplierShow: false,
      supplierList: [],
      supPage: 1,
      supTotal: 0,
      // 审核人名单
      userList: []
    };
  },
  mounted() {
    this.getTabList();
    this.getUserList();

    // this.searchOrders();//搜索订单
    // this.queryUserList();// 用户管理查询用户列表
    // this.addUser(); //用户管理 —— "添加用户"
    // this.modifyUser();  //用户管理 —— “编辑”保存用户
    // this.queryUser(); // "编辑"用户，根据前端传过来的id查询用户

  },
  methods: {
    // "编辑"用户，根据前端传过来的id查询用户
    queryUser(){
      var that = this;
      that.axios
        .post("jx_manage/user/queryUser",qs.stringify(
          {id:"38"}
          ))
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            // that.userList = res.data;
            // {"code":0}
            } else {
            // that.errorMsg(res.msg);
            // {"code": 0,"msg":"xxxx"}
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

 //用户管理 —— “编辑”用户，（“修改密码”还是这个接口，只需要传 id 和 passWord给后端）
    modifyUser() {
      var that = this;
      that.axios
        .post("jx_manage/user/modify",qs.stringify(
          {id:"38",userName:"ylyao",passWord:"JXmimao",email:"yisyd@126.com",remark:"改一下啊啊",telNo:"011-121212",phoneNo:"2871291287"}
          ))
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            // that.userList = res.data;
            // {"code":0}
            } else {
            // that.errorMsg(res.msg);
            // {"code": 0,"msg":"xxxx"}
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

       //用户管理 —— "添加用户"，页面展示 ：用户名userName、邮箱email、座机号telNo、电话号码phoneNo、备注remark
      addUser() {
      var that = this;
      that.axios
        .post("jx_manage/user/add",qs.stringify({userName:"ylyao",email:"yisyd@126.com",remark:"好好好",telNo:"011-121212",phoneNo:"2871291287"}))
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            // that.userList = res.data;
            // {"code":0}
            } else {
            // that.errorMsg(res.msg);
            // {"code": 0,"msg":"xxxx"}
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //用户管理 —— 查询用户列表
      queryUserList() {
      var that = this;
      that.axios
        .post("jx_manage/user/queryList",qs.stringify({page:1,limit:7}))
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            // that.userList = res.data;
            // 列表展示字段 姓名name、邮箱email、电话号码phoneNo、座机号码telNo、备注remark、创建时间createTime
    //{"code": 0,"page": {"totalCount": 11,"pageSize": 7,"totalPage": 2,"currPage": 1,"list": [{
		// "id": 1,"name": "admin","passWord": "1","email": "1195997183@qq.com","type": 1,"createTime": "2018-06-27 09:54:44.0","updateTime": "2018-06-27 15:54:44.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark":  null},{
		// "id": 2,"name": "test1","passWord": "e10adc3949ba59abbe56e057f20f883e","email": null,"type": 2,"createTime": "2019-09-24 08:00:00.0","updateTime": "2019-10-14 16:59:07.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark": null},{
		// "id": 4,"name": "test3","passWord": "e10adc3949ba59abbe56e057f20f883e","email": null,"type": 2,"createTime": "2018-10-09 09:54:44.0","updateTime": "2019-10-10 09:10:20.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark":  null},{
		// "id": 5,"name": "test4","passWord": "e10adc3949ba59abbe56e057f20f883e","email": null,"type": 2,"createTime": "2019-10-10 09:12:18.0","updateTime": "2019-10-14 16:58:42.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark":  null},{
		// "id": 16,"name": "test5","passWord": "e10adc3949ba59abbe56e057f20f883e","email": null,"type": 2,"createTime": "2019-10-12 15:54:30.0","updateTime": "2019-10-12 15:54:30.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark":  null},{
		// "id": 24,"name": "test6","passWord": "e10adc3949ba59abbe56e057f20f883e","email": null,"type": 2,"createTime": "2019-10-12 16:01:13.0","updateTime": "2019-10-12 16:01:13.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark":  null},{
		// "id": 25,"name": "test7","passWord": "e10adc3949ba59abbe56e057f20f883e","email": null,"type": 2,"createTime": "2019-10-12 16:01:20.0","updateTime": "2019-10-12 16:01:20.0","state": "1","flag": null,"phoneNo": null,"telNo": null,"remark": null}]}}

          } else {
            // that.errorMsg(res.msg);
            // {"code": 0,"msg":"xxxx"}
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

  //搜索订单
    searchOrders() {
      var that = this;
      that.axios
        .post("/jx_manage/orderManage/searchOrders", qs.stringify(
          {page:"1",limit:"7",orderNo:"JX2020"}
          ))
        .then(function(res) {
          // var res = JSON.parse(res);
          console.log(">>>>>>",res.data.code);
          if (res.data.code == 0) {
            // that.$router.push("/finishOrder");

          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },  

    // 产品列表
    openProShow() {
      var that = this;
      that.productShow = true;
      that.proPage = 1;
      that.getProList();
    },
    getProList() {
      var that = this;
      that.axios
        .post(
          "/jx_manage/product/queryList",
          qs.stringify({
            page: that.proPage,
            limit: 7
          })
        )
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            that.productList = res.page.list;
            that.proTotal = res.page.totalCount;
            that.productList.map(function(item, i) {
              item.sort = that.proPage * 7 - 6 + i;
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    changeProPage(val) {
      that.proPage = val;
      that.getProList();
    },
    choicePro(val) {
      var that = this;
      that.orederForm.productName = val.productName;
      that.orederForm.productNo = val.productNo;
      that.productShow = false;
    },
    // 供应商列表
    openSupShow() {
      var that = this;
      that.supplierShow = true;
      that.supPage = 1;
      that.getSupList();
    },
    getSupList() {
      var that = this;
      that.axios
        .post(
          "/jx_manage/supplier/queryList",
          qs.stringify({
            page: that.proPage,
            limit: 7
          })
        )
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            that.supplierList = res.page.list;
            that.supTotal = res.page.totalCount;
            that.supplierList.map(function(item, i) {
              item.sort = that.supPage * 7 - 6 + i;
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    changeSupPage(val) {
      that.supPage = val;
      that.getSupList();
    },
    choiceSup(val) {
      var that = this;
      that.supplierShow = false;
      that.orederForm.supplierName = val.manageName;
      that.orederForm.supplierNo = val.manageNo;
    },
    // 审核人名单

    getUserList() {
      var that = this;
      that.axios
        .post("jx_manage/user/queryList")
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            that.userList = res.data;
          } else {
            that.errorMsg(res.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 订单列表
    getTabList() {
      var that = this;
      that.axios
        .post(
          "/jx_manage/orderManage/query",
          qs.stringify({
            page: that.tabPage,
            limit: 7
          })
        )
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            // that.$router.push("/finishOrder");
            that.tableData = res.page.list;
            that.totalPage = res.page.totalCount;
            that.tableData.map(function(item, i) {
              item.sort = that.proPage * 7 - 6 + i;
            });
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      // this.axios({
      //   type: "POST",
      //   url: "/jx_manage/orderManage/query",
      //   data: {
      //     page: that.tabPage,
      //     limit: 7
      //   },
      //   success: {}
      // });
    },
    changeOrePage(num) {
      this.tabPage = num;
      this.getTabList();
    },

    // 创建编辑订单
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
        .post(url, that.orederForm)
        .then(function(res) {
          var res = res.data;
          that.cancelClose();
          if (res.code == 0) {
            var msg =
              this.orederForm.orderDialogTitle == "创建订单"
                ? "订单创建成功"
                : "订单编辑成功";
            that.successMsg(msg);
          } else {
            that.errorMsg(res.msg);
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

    // 关闭订单
    closeOreder(val) {
      this.closeOrederForm.show = true;
      this.closeOrederForm.orederNo = val.orederNo;
    },
    confirmClose() {
      var that = this;
      that.axios
        .post("/jx_manage/orderManage/close", qs.stringify(that.closeOrederForm))
        .then(function(res) {
          var res = res.data;
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
    // 预览事件
    openOrederView(val) {
      var that = this;
      that.orederViewShow = true;
      that.viewOrederNo = val.orederNo;
      that.axios
        .post("/jx_manage/orderManage/preview", qs.stringify({ orderNo: val.orederNo }))
        .then(function(res) {
          var res = res.data;
          if (res.code == 0) {
            that.orederView = res.data;
          } else {
            errorMsg(res.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
  /* border: 1px solid #ccc; */
}
.orederView .conView > .headView {
  width: 100%;
  height: 80px;
  /* border: 1px solid #4ac; */
}
.orederView .conView > .headView > span:first-child {
  width: 100px;
  height: 100%;
  display: inline-block;
  background: url("../../static/img/logo.png") no-repeat;
  background-size: 90% 90%;
}
.orederView .conView > .headView > span:last-child {
  width: 706px;
  height: 100%;
  float: right;
  display: inline-block;
}
.orederView .conView > .orederInfor > .tabHead {
  height: 24px;
  width: 100%;
}
.orederView .conView > .orederInfor > .tabHead > span {
  height: 100%;
  width: 38%;
  display: inline-block;
}
.orederView .conView > .orederInfor > .tabcont {
  height: 380px;
  width: 100%;
  /* border: 1px solid #999; */
}
.orederView .conView > .orederInfor > .tabcont > table {
  height: 100%;
  width: 100%;
  border: 1px solid #999;
  border-collapse: collapse;
}
.orederView .conView > .orederInfor > .tabcont > table > .padLeft td {
  padding-left: 8px;
}
.orederView .conView > .orederInfor > .tabcont > table td {
  border: 1px solid #999;
}
/* 供应商 */
.orederView .conView > .orederInfor > .tabcont > table .supplier {
  display: inline-block;
  width: 100%;
  height: 70px;
}
.orederView .conView > .orederInfor > .tabcont > table .supplier > li {
  display: inline-block;
  width: 100%;
}
/* 联系人 */
.orederView .conView > .orederInfor > .tabcont > table .contacts {
  display: inline-block;
  width: 100%;
  height: 50px;
}
.orederView .conView > .orederInfor > .tabcont > table .contacts > li {
  display: inline-block;
  float: left;
  /* border: 1px solid #ccc; */
  box-sizing: border-box;
}
/* 付款信息 */
.orederView .conView > .orederInfor > .tabcont > table .payment {
  display: inline-block;
  width: 100%;
  height: 110px;
}
.orederView .conView > .orederInfor > .tabcont > table .payment > li {
  display: inline-block;
  width: 100%;
}
/* 收货信息 */
.orederView .conView > .orederInfor > .tabcont > table .consignee {
  display: inline-block;
  height: 86px;
}
.orederView .conView > .orederInfor > .tabcont > table .consignee > li {
  display: inline-block;
  float: left;
  /* border: 1px solid #ccc; */
  box-sizing: border-box;
}
/* 开票信息 */
.orederView .conView > .orederInfor > .tabcont > table .invoice {
  display: inline-block;
  width: 100%;
  height: 106px;
}
.orederView .conView > .orederInfor > .tabcont > table .invoice > li {
  display: inline-block;
  width: 100%;
}

/* 发票寄送地址 */
.orederView .conView > .orederInfor > .tabcont > table .address {
  display: inline-block;
  height: 30px;
}
.orederView .conView > .orederInfor > .tabcont > table .address > li {
  display: inline-block;
  float: left;
  /* border: 1px solid #ccc; */
  box-sizing: border-box;
  margin-right: 15px;
}

.orederView .footView {
  margin-top: 15px;
}
</style>
