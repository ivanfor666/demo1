import React from 'react';
import { connect } from 'dva';
import { Flex,List,Modal, } from 'antd-mobile';
import { createForm } from 'rc-form';
import  '../components/component.less';
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// // GMT is not currently observed in the UK. So use UTC now.
// const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));


class MassageModal extends React.Component{
     state={
       Remind_list:[],
       deal_list:[]
      }

  save=()=>{

  }
  componentDidMount(){
       console.log(this.props)
       this.setState({
         deal_list:this.props.deal_list,
         Remind_list:this.props.Remind_list
       })
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.total!==this.props.total);
    // console.log(nextProps);
       if(nextProps.total!==this.props.total){
          this.setState({
            deal_list:nextProps.deal_list,
            Remind_list:nextProps.Remind_list
          })
       }
  }


  render(){
    const { getFieldProps } = this.props.form;
    const { Remind_list,deal_list } = this.state;

    const tempList_1 = deal_list.map((item,i)=>{
        const sellDate = new Date(item.sellDate);
        const buyDate = new Date(item.buyDate);
        return <Flex key={i}>
          <Flex.Item>用户:  <span style={{color:"#00A0E8"}}> {item.username}</span>  </Flex.Item>
          <Flex.Item>名称:   <span style={{color:"#00A0E8"}}>{item.fund} </span></Flex.Item>
          <Flex.Item>类型:  <span style={item.fundType!=="定投"?{color:"#00A0E8"}:{color:"red"}}>{item.fundType}</span></Flex.Item>
          <Flex.Item>买入金额:<span style={{color:"#00A0E8"}}>{item.Purchase_amount}</span></Flex.Item>
          <Flex.Item>卖出日期:<span style={{color:"#00A0E8"}}>{(sellDate.getMonth()+1)+"-"+sellDate.getDate()}</span></Flex.Item>
          <Flex.Item>主页单号:<span style={{color:"#00A0E8"}}>{item.index+1}</span></Flex.Item>
          <Flex.Item>
          <span style={{cursor:"pointer",color:"red"}}
                onClick={() =>
                  alert('终止', '确定强制终止订单 ???', [
                    { text: 'Cancel', onPress: () => console.log('cancel') },
                    {
                      text: 'Ok',
                      onPress: () =>{

                        this.props.sellOut(item.index)
                      }
                    },
                  ])
                }>处理</span>
          </Flex.Item>
        </Flex>
      }

    )

    const tempList_2 = Remind_list.map((item,i)=>{
        const sellDate = new Date(item.sellDate);
        const buyDate = new Date(item.buyDate);
        return  <Flex key={i}>
            <Flex.Item>用户:  <span style={{color:"#00A0E8"}}> {item.username}</span>  </Flex.Item>
          <Flex.Item>名称:   <span style={{color:"#00A0E8"}}>{item.fund} </span></Flex.Item>
          <Flex.Item>类型:  <span style={item.fundType!=="定投"?{color:"#00A0E8"}:{color:"red"}}>{item.fundType}</span></Flex.Item>
          <Flex.Item>买入金额:<span style={{color:"#00A0E8"}}>{item.Purchase_amount}</span></Flex.Item>
          <Flex.Item>卖出日期:<span style={{color:"#00A0E8"}}>{(sellDate.getMonth()+1)+"-"+sellDate.getDate()}</span></Flex.Item>
          <Flex.Item>主页单号:<span style={{color:"#00A0E8"}}>{item.index+1}</span></Flex.Item>
          <Flex.Item>
          <span style={{cursor:"pointer",color:"red"}}
                onClick={() =>
                  alert('终止', '确定强制终止订单 ???', [
                    { text: 'Cancel', onPress: () => console.log('cancel') },
                    {
                      text: 'Ok',
                      onPress: () =>{
                        this.props.sellOut(item.index)
                      }
                    },
                  ])
                }>处理</span>
          </Flex.Item>
        </Flex>
      }

    )
    return(
      <Modal
        popup
        visible={true}
        onClose={this.props.callback}
        animationType="slide-up"
      >
        <div className="flex-container">

        </div>
        <List style={{ height: 300, overflow: 'scroll' }} renderHeader={() => '今天可处理'}>
          {tempList_1}
          {tempList_1.length==0&&<Item>暂无</Item>}

        </List>

        <List style={{ height: 300, overflow: 'scroll' }} renderHeader={() => '明天应处理'}>
          {tempList_2}
          {tempList_2.length==0&&<Item>暂无</Item>}
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





export default connect()(createForm()(MassageModal));
