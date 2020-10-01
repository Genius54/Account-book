<template>
  <div class="app">
    <div>
      <a-page-header title="小明记账">
        <a-row type="flex">
          <a-statistic title="收入" prefix="￥" :value="income()"
                       :style="{margin: '0 10px'}"
          />
          <a-statistic title="支出" prefix="￥" :value="expenditure()"
                       :style="{margin: '0 10px'}"
          />
          <a-statistic title="余额" prefix="￥" :value="balance()"
                       :style="{margin: '0 10px'}"
          />
          <div>
            <label>全部</label><input name="ra" type="radio" checked @click="serchAll">
            <label>收入</label><input name="ra" type="radio" @click="serchIncome">
            <label>支出</label><input name="ra" type="radio" @click="serchExpenditure">
          </div>
          <select v-model="monthSet">
            <option v-for="x in month" :key="x.key" :value="x.v">{{x.M}}</option>
          </select><br>
          <button @click="serchByMonth">查询</button>
        </a-row>
      </a-page-header>
    </div>
    <div>
      <table class="app-table" id="app-right-table" border="3">
        <tr>
          <td><input style="border: 0px;outline:none; width: 100%;" placeholder="收支描述..." v-model="des"></td>
          <td><input style="border: 0px;outline:none; width: 100%;" placeholder="+表示收入，-表示支出..." v-model="fun"></td>
          <td><input type="date" v-model="time"></td>
          <td><input type="button" :style="style"
                     @click="addItem1"
                     @mouseover="mouseOver"
                     @mouseleave="mouseLeave"
                     value="添加"></td>
        </tr>
        <tbody v-if="columns.length">
        <tr v-for="item in columns" :key="item.key">
          <td>{{item.description}}</td>
          <td>{{item.fund}}</td>
          <td>{{item.time}}</td>
          <td>{{item.action}}</td>
        </tr>
        </tbody>
        <tbody v-if="datas.length">
        <tr v-for="item in datas" :key="item.key">
          <td><input style="border: 0px;outline:none; width: 100%;" placeholder="编辑此处..." v-model="item.description"></td>
          <td><input style="border: 0px;outline:none; width: 100%;" placeholder="编辑此处..." v-model="item.fund"></td>
          <td><input style="border: 0px;outline:none; width: 100%;" placeholder="编辑此处..." v-model="item.time"></td>
          <td>
            <input type="button" :style="style1"
                   @mouseover="mouseOver1"
                   @mouseleave="mouseLeave1"
                   @click="editItem(item)" value="编辑">
            <input type="button" :style="style"
                   @mouseover="mouseOver"
                   @mouseleave="mouseLeave"
                   @click="deleteItem1(item)" value="删除">
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

  const columns = [
    { description: '描述', fund: '出入', time: '时间',action: '操作' }
  ];
  const datas=[];
  const month=[
    {key:1,M:'1月',v:'-01-'},
    {key:2,M:'2月',v:'-02-'},
    {key:3,M:'3月',v:'-03-'},
    {key:4,M:'4月',v:'-04-'},
    {key:5,M:'5月',v:'-05-'},
    {key:6,M:'6月',v:'-06-'},
    {key:7,M:'7月',v:'-07-'},
    {key:8,M:'8月',v:'-08-'},
    {key:9,M:'9月',v:'-09-'},
    {key:10,M:'10月',v:'-10-'},
    {key:11,M:'11月',v:'-11-'},
    {key:12,M:'12月',v:'-12-'}
  ];
  export default {
    data(){
      return{
        k:0,
        item:'',
        des:'',
        fun:'',
        time:'',
        monthSet:'',
        month_key:'',
        month,
        style:'',
        style1:'',
        datas,
        columns,
        income: function () {//总收入
          let sum;
          let result=[];
          result=JSON.parse(localStorage.getItem('list'));
          result=result.filter(item=>item.fund>0);
          sum=eval(result.map((item) => item.fund).join('+'));
          return parseFloat(sum).toFixed(2);
        },
        expenditure: function () {//总支出
          let sum;
          let result=[];
          result=JSON.parse(localStorage.getItem('list'));
          result=result.filter(item=>item.fund<0);
          sum=eval(result.map((item) => item.fund).join('+'));
          return parseFloat(sum).toFixed(2);
        },
        balance: function () {//总收支余额
          let sum;
          let result=[];
          result=JSON.parse(localStorage.getItem('list'));
          sum=eval(result.map((item) => item.fund).join('+'));
          return parseFloat(sum).toFixed(2);
        }
      }
    },
    computed: {
    },
    created() {
      if(localStorage.getItem('list')==null){
        let r=[];
        localStorage.setItem('list',JSON.stringify(r));
      }
      this.datas = JSON.parse(localStorage.getItem('list')) || [];
      if(localStorage.getItem('list')=="[]"){
        this.k=0;
      }else {
        this.k=JSON.parse(localStorage.getItem('list')).pop().key;
      }
      this.datas.sort((a,b)=>{
        if(a.time>b.time){
          return -1
        }else if(a.time<b.time){
          return 1
        }
        return 0
      })
    },
    methods:{
      addItem1(){
        let _this=this;
        _this.k=_this.k+1;
        let ite={key:_this.k,description:_this.des,fund:parseFloat(_this.fun).toFixed(2),time:_this.time};
        _this.datas=JSON.parse(localStorage.getItem('list'));
        _this.datas=_this.datas.concat(ite);
        _this.des='';
        _this.fun='';
        _this.time='';
        /*this.datas.sort((a,b)=>{
          if(a.time>b.time){
            return -1
          }else if(a.time<b.time){
            return 1
          }
          return 0
        })*/
        localStorage.setItem('list',JSON.stringify(_this.datas));
      },
      deleteItem1(e){
        let _this=this;
        const list1=JSON.parse(localStorage.getItem('list'));
        const list=list1.filter(list1=>list1.key!=e.key);
        localStorage.setItem('list',JSON.stringify(list));
        _this.datas=JSON.parse(localStorage.getItem('list'));
      },
      editItem(){
        let _this=this;
        localStorage.setItem('list',JSON.stringify(_this.datas));
        _this.datas=JSON.parse(localStorage.getItem('list'));
      },
      serchAll(){
        let _this=this;
        _this.datas=JSON.parse(localStorage.getItem('list'));
      },
      serchIncome(){
        let _this=this;
        _this.datas=JSON.parse(localStorage.getItem('list'));
        _this.datas=_this.datas.filter(datas=>datas.fund>0);
      },
      serchExpenditure(){
        let _this=this;
        _this.datas=JSON.parse(localStorage.getItem('list'));
        _this.datas=_this.datas.filter(datas=>datas.fund<0);
      },
      serchByMonth(){
        let _this=this;
        _this.datas=JSON.parse(localStorage.getItem('list'));
        _this.datas=_this.datas.filter(datas=>datas.time.indexOf(_this.monthSet)!=-1);
      },
      mouseOver(){
        this.style = "color:red; background-color:transparent;border:0;overflow:visible;padding:0;";
      },
      mouseLeave() {
        this.style = "color:brown; background-color:transparent;border:0;overflow:visible;padding:0;";
      },
      mouseOver1(){
        this.style1 = "color: lightgreen; background-color:transparent;border:0;overflow:visible;padding:0;";
      },
      mouseLeave1() {
        this.style1 = "color: seagreen; background-color:transparent;border:0;overflow:visible;padding:0;";
      },
    }
  }
</script>

<style scoped>
  tr:last-child td {
    padding-bottom: 0;
  }
  .app{
    width: 800px;
    height: 600px;
    border: 1px solid green;
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  .app-table{
    width: 100%;
    border: 0px;
  }
</style>
