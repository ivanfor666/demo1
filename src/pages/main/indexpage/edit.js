import React from 'react';
import { connect } from 'dva';
import { SearchBar,List,Modal,Button,InputItem,Picker,DatePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import  '../components/component.less';
import {Toast} from "antd-mobile/lib/index";
const Item = List.Item;
const Brief = Item.Brief;


const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class MyEdit extends React.Component{
     state = {
       FundValue: ["万家"],
       FundType: ["债券"],
       date:now,
       user:["自己"],
       SearchVal:""
      }


  edit=()=>{
    const { FundValue,FundType,date,user }=this.state
    this.props.form.validateFields((err, values) => {
      if (!err&&date) {
        //86400000
        // console.log(values)
        // console.log(date)
        const  SearchVal  =  JSON.parse(JSON.stringify(this.state.SearchVal));
        let timestamp = date.valueOf();  //转为时间戳
        let hour =  date.getHours();
        let week = date.getDay();//0-6  0为星期日
        // console.log(FundType);
        // console.log(hour)
        // console.log(week)
        // console.log(timestamp)
        if(FundType[0]!=="货币"&&FundType[0]!=="定投"){
          if(hour>=15){
            if(week>=1&&week<=3){
              timestamp += 86400000  * 8;
            }
            if(week==4){
              timestamp += 86400000  * 11;
            }else if(week==5){
              timestamp += 86400000  * 10;
            }else if(week==6){
              timestamp += 86400000  * 9;
            }else if(week==0){
              timestamp += 86400000  * 8;
            }

          }else {
            if(week>=1&&week<=4){
              timestamp += 86400000  * 7;
            }else if(week==5){
              timestamp += 86400000  * 10;
            } else if(week==6){
              timestamp += 86400000  * 9;
            } else if(week==0){
              timestamp += 86400000  * 8;
            }
          }
        }else if(FundType[0]==="货币") {

          if(hour>=15){
            if(week==1||week==2){
              timestamp += 86400000  * 3;
            }
            if(week==3){
              timestamp += 86400000  * 5;
            }else if(week==4){
              timestamp += 86400000  * 5;
            }else if(week==5){
              timestamp += 86400000  * 5;
            }else if(week==6){
              timestamp += 86400000  * 4;
            }else if(week==0){
              timestamp += 86400000  * 3;
            }

          }else {
            if(week>=1&&week<=3){
              timestamp += 86400000  * 2;
            }else if(week==4){
              timestamp += 86400000  * 4;
            } else if(week==5){
              timestamp += 86400000  * 4;
            } else if(week==6){
              timestamp += 86400000  * 4;
            }else if(week==0){
              timestamp += 86400000  * 3;
            }
          }

        }else if(FundType[0]==="定投"){
          timestamp += 86400000  * 7;

        }

        const nowDate = new Date(timestamp);
        // console.log(nowDate)

        let tempObj = {
          username:user[0],
          fund:FundValue[0],
          fundType:FundType[0],
          buyDate:date.valueOf(),
          sellDate:timestamp,
          Purchase_amount:Number(values.Purchase_amount),
          Profit_amount:Number(values.Profit_amount)
        }
        this.props.editDate(tempObj,SearchVal)
        this.props.callback();
      }else {
        console.log(err)
        let tempItem;
        for(let item in err){
          tempItem = item
          break;
        }
        // message.info(err[tempItem].errors[0].message);
        Toast.fail(err[tempItem].errors[0].message);
      }
    })
  }

  onChangeFund = (Val) => {
       // console.log(Val)
    this.setState({
      FundValue: Val,
    });
  };
  onChangeFundType = (Val) => {
    // console.log(Val)
    this.setState({
      FundType: Val,
    });
  };

  onChangeUser= (Val) => {
    // console.log(Val)
    this.setState({
      user: Val,
    });
  };

  dateChange=(date)=>{
    // console.log(date)
    this.setState({ date })
  }

  OnSearch=(val)=>{
    this.setState({ SearchVal:val })
  }

  Search=()=>{
    const  SearchVal  =  this.state.SearchVal
    const list =  JSON.parse(JSON.stringify(this.props.list));

    const tempNum = Number(SearchVal);

    if(tempNum>list.length){
      return  Toast.fail("超出总订单长度")
    }

    if(SearchVal==""||tempNum==0){  //不能取0
      console.log("ok")
    }else {
      const tempDate = new Date(list[tempNum-1].buyDate);
      this.props.form.setFieldsValue({
        Purchase_amount:list[tempNum-1].Purchase_amount,
        Profit_amount:list[tempNum-1].Profit_amount,
      })
      this.setState({
        FundValue:[`${list[tempNum-1].fund}`],
        FundType:[`${list[tempNum-1].fundType}`],
        user:[`${list[tempNum-1].username}`],
        date:tempDate,
      })
    }


  }

  render(){
    const { getFieldProps } = this.props.form;
    const { FundValue,FundType,date,user,SearchVal } = this.state;

    return(
      <Modal
        popup
        visible={true}
        onClose={this.props.callback}
        animationType="slide-up"
      >
        <List renderHeader={() => <div>基金编辑</div>} className="popup-list">
            <SearchBar placeholder="Search" maxLength={3} value={SearchVal} onChange={this.OnSearch}/>
          <Button type="primary" inline size="small" style={{marginLeft:16}} onClick={this.Search}>查询</Button>
          <List>
            <Picker
              data={users}
              value={user}
              cols={1}
              onChange={this.onChangeUser}
            >
              <List.Item arrow="horizontal">用户</List.Item>
            </Picker>
            <Picker
              data={funds}
              value={FundValue}
              cols={1}
              onChange={this.onChangeFund}
            >
              <List.Item arrow="horizontal">基金名称</List.Item>
            </Picker>

            {/*<InputItem*/}
              {/*className="ivanItem"*/}
              {/*{...getFieldProps('Purchase_amount')}*/}
              {/*clear*/}
              {/*placeholder="请输入"*/}
            {/*>买入金额</InputItem>*/}

            <InputItem
              {...getFieldProps('Purchase_amount', {
                normalize: (v, prev) => {
                  if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                    if (v === '.') {
                      return '0.';
                    }
                    return prev;
                  }
                  return v;
                },
                rules: [{ required: true }],
              })}
              type="money"
              placeholder="请输入"
              ref={el => this.inputRef = el}
              onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
              clear
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            >买入金额</InputItem>

            {/*<InputItem*/}
              {/*className="ivanItem"*/}
              {/*{...getFieldProps('Profit_amount')}*/}
              {/*clear*/}
              {/*placeholder="请输入"*/}
            {/*>红利金额</InputItem>*/}

            <InputItem
              {...getFieldProps('Profit_amount', {
                normalize: (v, prev) => {
                  if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                    if (v === '.') {
                      return '0.';
                    }
                    return prev;
                  }
                  return v;
                },
                rules: [{ required: true }],
              })}
              type="money"
              placeholder="请输入"
              ref={el => this.inputRef = el}
              onVirtualKeyboardConfirm={v => console.log('onVirtualKeyboardConfirm:', v)}
              clear
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            >红利金额</InputItem>

            <DatePicker
              value={date}
              onChange={this.dateChange}
            >
              <List.Item arrow="horizontal" className="ivanDatePicker">买入时间</List.Item>
            </DatePicker>
            <Picker
              data={types}
              value={FundType}
              cols={1}
              onChange={this.onChangeFundType}
            >
              <List.Item arrow="horizontal">类型</List.Item>
            </Picker>

          </List>
          <List.Item style={{marginTop:48,marginBottom:24}}>
            <Button type="primary" onClick={this.edit}>编辑</Button>
          </List.Item>
        </List>
      </Modal>
    )
  }
}

const  Mystyle = {
  title :{
    marginRight:48
  },
  content :{
    color:"green"
  },

}

const users = [
  {
    label:
      (<div key="自己">
        <span>自己</span>
      </div>),
    value: "自己",
  },
  {
    label:
      (<div key="小号">
        <span>小号</span>
      </div>),
    value: "小号",
  },
  {
    label:
      (<div key="别的">
        <span>别的</span>
      </div>),
    value: "别的",
  },
]

const types = [
  {
    label:
      (<div key="债券">
        <span>债券</span>
      </div>),
    value: "债券",
  },
  {
    label:
      (<div key="货币">
        <span>货币</span>
      </div>),
    value: "货币",
  },
  {
    label:
      (<div key="定投">
        <span>定投</span>
      </div>),
    value: "定投",
  },
  {
    label:
      (<div key="股票">
        <span>股票</span>
      </div>),
    value: "股票",
  },

]

const funds = [
  {
    label:
      (<div key="万家">
        <span>万家</span>
      </div>),
    value: "万家",
  },
  {
    label:
      (<div key="光大">
        <span>光大</span>
      </div>),
    value: "光大",
  },
  {
    label:
      (<div  key="华夏">
        <span>华夏</span>
      </div>),
    value: "华夏",
  },
  {
    label:
      (<div key="中欧">
        <span>中欧</span>
      </div>),
    value: "中欧",
  },
  {
    label:
      (<div key="鹏华">
        <span>鹏华</span>
      </div>),
    value: "鹏华",
  },{
    label:
      (<div  key="广发">
        <span>广发</span>
      </div>),
    value: "广发",
  },
  {
    label:
      (<div   key="天弘">
        <span>天弘</span>
      </div>),
    value: "天弘",
  },
  {
    label:
      (<div   key="全兴">
        <span>全兴</span>
      </div>),
    value: "全兴",
  },
  {
    label:
      (<div   key="华安">
        <span>华安</span>
      </div>),
    value: "华安",
  },{
    label:
      (<div   key="招商">
        <span>招商</span>
      </div>),
    value: "招商",
  },{
    label:
      (<div   key="富国">
        <span>富国</span>
      </div>),
    value: "富国",
  },
  {
    label:
      (<div   key="国泰">
        <span>国泰</span>
      </div>),
    value: "国泰",
  },{
    label:
      (<div   key="上投">
        <span>上投</span>
      </div>),
    value: "上投",
  },{
    label:
      (<div   key="建信">
        <span>建信</span>
      </div>),
    value: "建信",
  },{
    label:
      (<div   key="嘉实">
        <span>嘉实</span>
      </div>),
    value: "嘉实",
  },
  {
    label:
      (<div   key="华宝">
        <span>华宝</span>
      </div>),
    value: "华宝",
  },{
    label:
      (<div   key="银华">
        <span>银华</span>
      </div>),
    value: "银华",
  },{
    label:
      (<div   key="国投">
        <span>国投</span>
      </div>),
    value: "国投",
  },{
    label:
      (<div   key="民生">
        <span>民生</span>
      </div>),
    value: "民生",
  },
];



export default connect()(createForm()(MyEdit));
