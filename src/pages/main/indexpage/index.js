import React from 'react';
import { connect } from 'dva';
import { TextareaItem,List,Button,Toast,Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import MyModal from  "./Modal";
import MyEdit from  "./edit";
import DetailModal from  "./DetailModal";
import MassageModal from  "./massage";
const Item = List.Item;
const Brief = Item.Brief;
let tempData;
const alert = Modal.alert;
const fundList = [
  "万家", "光大", "华夏", "中欧", "鹏华", "广发", "天弘", "鹏华", "全兴", "华安", "上投","嘉实", "建信", "华宝", "招商", "富国", "国泰", "银华", "国投", "民生",
]


class Index extends React.Component{
     state={
       data:{
         list:[],
         historyProfit:0
       },
       Remind_list:[],
       deal_list:[],
       sum:0,   //总额
       total:0,   //定单总量
       ProfitTotal:0,   //盈利总额
       openModal:false,
       openModal_2:false,
       openModal_3:false,
       openModal_4:false,
      }
  componentDidMount() {
    tempData = null;
  }

  count=()=>{
    const { list } = this.state.data;
    let  sum=0,total=0,ProfitTotal=0;
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    let Remind_list=[],deal_list=[];
    if(list.length>0){
      list.forEach((item,i)=>{
        if(item.Purchase_amount){
          sum += item.Purchase_amount ;
        }
        if(item.Profit_amount){
          ProfitTotal += item.Profit_amount;
        }

        //提醒功能
        // console.log(item.sellDate,"sellDate");
        const sellDate = new Date(item.sellDate);
           if(sellDate.getFullYear()===now.getFullYear()&&sellDate.getMonth()===now.getMonth()){

             if(now.getDate()+1 == sellDate.getDate()){
               Remind_list.push({...item,index:i})
               //明日应处理
             }else if(now.getDate()+1 > sellDate.getDate()){
               //今日可处理
               deal_list.push({...item,index:i})
             }
           }

        // console.log(sellDate,"sellDate");
      })

    }
    this.setState({
      sum,
      total:list.length>0?list.length:0,
      ProfitTotal,
      Remind_list,
      deal_list
    })
  }


  callback=()=>{
    this.setState({openModal:false})
  }
  callback_2=()=>{
    this.setState({openModal_2:false})
  }
  callback_3=()=>{
    this.setState({openModal_3:false})
  }

  callback_4=()=>{
    this.setState({openModal_4:false})
  }

  saveDate=(item)=>{
   const {data,total,sum} = this.state;
    data.historyProfit += item.Profit_amount;
   data.list.push(item)
   this.setState({
     data,
   },()=>{
     this.count();
     let temp = JSON.stringify(this.state.data);
     window.localStorage.setItem('data', temp);
   })
  }

  editDate=(item,SearchVal)=>{
    const {data,total,sum} = this.state;

    data.historyProfit = data.historyProfit + item.Profit_amount - data.list[SearchVal-1].Profit_amount;
    const newItem = JSON.parse(JSON.stringify(item));
    data.list.splice(SearchVal-1,1,newItem)

    this.setState({
      data,
    },()=>{
      this.count();
      let temp = JSON.stringify(this.state.data);
      window.localStorage.setItem('data', temp);
    })
  }

  sellOut=(index,important)=>{
    const { data } = this.state;
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    const temp = JSON.parse(JSON.stringify(data.list[index].sellDate));
    const sellDate = new Date(temp);

    if((sellDate.getFullYear()===now.getFullYear()&&sellDate.getMonth()===now.getMonth())||important){
       if((now.getDate()+1 > sellDate.getDate()||(now.getDate()+1 == sellDate.getDate()&&now.getHours()>=15))|| important){  // 可卖出  前一天 15点前不可卖出 || 15点后可卖出
         if(data.list[index].fundType==="定投"&&!important){
           data.list[index].sellDate +=   86400000  * 7
         } else {
           data.list.splice(index,1);
         }
         this.setState({
           data
         },()=>{
           this.count();
           let temp = JSON.stringify(this.state.data);
           window.localStorage.setItem('data', temp);
         })
      }else {
         Toast.fail('时间不够，不能卖出', 1);
      }
    }


  }

  insertData=()=>{
    if(tempData){
      this.setState({
        data:JSON.parse(tempData)
      },()=>{
        window.localStorage.setItem('data', tempData);
        this.count();
      })
    }else if(!tempData&&window.localStorage.getItem('data')){
      this.setState({
        data:JSON.parse(window.localStorage.getItem('data'))
      },()=>{
        this.count();
      })
    }
  }

  render(){
    const { getFieldProps } = this.props.form;
    const { list } = this.state.data;
    const { openModal,openModal_2,openModal_3,openModal_4,deal_list,Remind_list,total,data } = this.state;


    const tempList = list.map((item,i)=>{
       const sellDate = new Date(item.sellDate);
        const buyDate = new Date(item.buyDate);
      return <List  renderHeader={() => `NO. ${i+1}`} className="my-list" key={i}>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>用户</span>
          <span style={Mystyle.content} onClick={()=>{}}>{item.username}</span>
        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>名称</span>
          <span style={Mystyle.content} onClick={()=>{}}>{item.fund}</span>
        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>类型</span>
          <span style={Mystyle.content} onClick={()=>{}}>{item.fundType}</span>
        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>买入日期</span>
          <span style={Mystyle.content} onClick={()=>{}}>{buyDate.getFullYear()+"-"+(buyDate.getMonth()+1)+"-"+buyDate.getDate()}</span>
        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>买入金额</span>
          <span style={Mystyle.content} onClick={()=>{}}>{item.Purchase_amount}</span>
        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>盈利金额</span>
          <span style={Mystyle.content} onClick={()=>{}}>{item.Profit_amount}</span>
        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>卖出日期</span>
          <span style={Mystyle.content} onClick={()=>{}}>{sellDate.getFullYear()+"-"+(sellDate.getMonth()+1)+"-"+sellDate.getDate()}</span>

        </Item>
        <Item>
          <span style={Mystyle.title} onClick={()=>{}}>操作</span>
          <span style={{...Mystyle.content,cursor:"pointer"}} onClick={()=>{this.sellOut(i)}}>卖出</span>
          <span style={{...Mystyle.content,cursor:"pointer",marginLeft:48}}
                onClick={() =>
                  alert('终止', '确定强制终止订单 ???', [
                    { text: 'Cancel', onPress: () => console.log('cancel') },
                    {
                      text: 'Ok',
                      onPress: () =>{
                        this.sellOut(i,true)
                      }
                    },
                  ])
                }>终止定投</span>
        </Item>
      </List>
    }

    )

    return(
      <div>
        <div className="flex-container">
          <List renderHeader={() => <div onClick={this.insertData}>导入</div>}>
            <TextareaItem
              placeholder="insert data"
              data-seed="logId"
              ref={el => this.autoFocusInst = el}
              onChange={(e)=>{
               tempData = e;
               console.log(tempData)
              }}
            />
          </List>
          <List renderHeader={() =><div onClick={()=>{this.props.form.setFieldsValue({data: JSON.stringify(this.state.data)})}}>导出</div>}>
            <TextareaItem
              {...getFieldProps('data')}
              placeholder="export data"
              count={10}
            />
          </List>

          <List  style={{marginTop:16}}>
            <Button type="primary"  inline size="large" onClick={()=>{this.setState({openModal_3:true})}}>消息</Button>
            <Button type="primary" inline size="large" style={{marginTop:16,marginLeft:16}} onClick={()=>{this.setState({openModal_2:true})}}>详情统计</Button>
            <Button type="primary" inline size="large" style={{marginTop:16,marginLeft:16}} onClick={()=>{this.setState({openModal:true})}}>买入</Button>
            <Button type="primary" inline size="large" style={{marginTop:16,marginLeft:16}} onClick={()=>{this.setState({openModal_4:true})}}>编辑</Button>
            {openModal&&<MyModal callback={this.callback}  saveDate={this.saveDate}/>}
            {openModal_2&&<DetailModal data={this.state} callback={this.callback_2} />}
            {openModal_3&&<MassageModal deal_list={deal_list} Remind_list={Remind_list} total={total} callback={this.callback_3} sellOut={this.sellOut}/>}
            {openModal_4&&<MyEdit callback={this.callback_4} list={list} editDate={this.editDate}/>}
          </List>


          {tempList}


        </div>
      </div>
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


export default connect()(createForm()(Index));
