import React from 'react';
import { connect } from 'dva';
import { List,Modal,InputItem,} from 'antd-mobile';
import { createForm } from 'rc-form';
import  '../components/component.less';
const Item = List.Item;
const Brief = Item.Brief;


const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// // GMT is not currently observed in the UK. So use UTC now.
// const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));


class DetailModal extends React.Component{
     state={

      }

  save=()=>{
       const { FundValue,FundType,date }=this.state

  }



  render(){
    const { getFieldProps } = this.props.form;
    const { sum,total,ProfitTotal,data } = this.props.data;
    const { historyProfit } = data;
    return(
      <Modal
        popup
        visible={true}
        onClose={this.props.callback}
        animationType="slide-up"
      >
        <List>
          <InputItem
            placeholder="start from right"
            clear
            value={sum+" 元"}
            onChange={(v) => { console.log('onChange', v); }}
          >总金额：</InputItem>
        </List>
        <List>
          <InputItem
            placeholder="start from right"
            clear
            value={total+" 单"}
            onChange={(v) => { console.log('onChange', v); }}
          >总定单：</InputItem>
        </List>
        <List>
          <InputItem
            placeholder="start from right"
            clear
            value={ProfitTotal+" 元"}
            onChange={(v) => { console.log('onChange', v); }}
          >盈利总额：</InputItem>
        </List>
        <List>
          <InputItem
            placeholder="start from right"
            clear
            value={(ProfitTotal*40/sum*100).toFixed(2) + "%"}
            onChange={(v) => { console.log('onChange', v); }}
          >利率：</InputItem>
        </List>
        <List>
          <InputItem
            placeholder="start from right"
            clear
            value={historyProfit.toFixed(2)+" 元"}
            onChange={(v) => { console.log('onChange', v); }}
          >历史盈利总额：</InputItem>
        </List>
      </Modal>
    )
  }
}






export default connect()(createForm()(DetailModal));
