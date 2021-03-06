import React, { Component } from 'react'
import _ from 'lodash'

class DropDown extends Component {
  constructor(props) {
    super(props);
    const treeData = props.treeData.length ? props.treeData : []
    this.state = {
      defaultList: _.cloneDeep(treeData),
      treeData: _.cloneDeep(treeData),
      isCheckedAll: false,
      isSeacrh: false
    };
  }

  componentDidMount() {
    const { treeData, defaultList } = this.state;
    const { value = [] } = this.props
    treeData.map((item, index) => {
      value.length && value.map(v => {
        if (item.value == v.value) {
          treeData[index].checked = true;
          defaultList[index].checked = true;
        }
      })
      return item;
    })
    this.setState({
      treeData,
      defaultList,
      isCheckedAll: treeData.length === (treeData.filter(item => item.checked === true)).length
    });
  }

  onSearch = (e) => {
    const { defaultList } = this.state;
    let value = e.target.value;
    let treeData = defaultList.filter((item) => item.label.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    this.setState({
      treeData,
      isSeacrh: !!value,
      isCheckedAll: treeData.length === (treeData.filter(item => item.checked === true)).length
    });
  }

  onCheckedAll = () => {
    let { isCheckedAll, treeData, defaultList, isSeacrh } = this.state;
    treeData = treeData.map(item => {
      item.checked = !isCheckedAll;
      return item;
    })
    for (let i = 0; i < treeData.length; i++) {
      for (let j = 0; j < defaultList.length; j++) {
        if (treeData[i].value == defaultList[j].value) {
          defaultList[j].checked = treeData[i].checked
        }
      }
    }
    this.setState({
      isCheckedAll: !isCheckedAll,
      treeData,
      defaultList
    });
  }

  save = () => {
    const { defaultList } = this.state;
    let values = [];
    defaultList.map((item) => {
      if (item.checked === true) {
        values.push({ value: item.value, label: item.label })
      }
    });
    this.props.onOk(values);
  }

  onCheckboxChange = (itemIndex) => {
    const { treeData, defaultList } = this.state;
    treeData[itemIndex].checked = !treeData[itemIndex].checked;
    let newDefaultList = defaultList.map(item => {
      if (item.value === treeData[itemIndex].value) {
        item.checked = treeData[itemIndex].checked;
      }
      return item;
    });
    this.setState({
      treeData,
      defaultList: newDefaultList,
      isCheckedAll: treeData.every(item => item.checked === true)
    });
  }


  getSelectedLength = () => {
    const { defaultList } = this.state;
    let len = (defaultList.filter(item => item.checked === true)).length;
    return len;
  }

  render() {
    const { isSeacrh, isCheckedAll, treeData } = this.state;
    const { inputPlaceholder, noContentText, dropdownClassName, showFilterAll, allText } = this.props;
    return (
      <div>
        {!isSeacrh && !treeData.length ?
          <div className="r-dorpdown-list r-select-not-found">{noContentText}</div>
          :
          <div className={`r-dorpdown-list ${dropdownClassName}`}>
            <div className="r-search-input-div">
              <input placeholder={inputPlaceholder} onChange={this.onSearch} className="r-search-input" />
            </div>
            <div className="r-checkbox-list-div">
              {
                !isSeacrh || (isSeacrh && showFilterAll && treeData.length) ?
                  <div className='r-checkbox-item' onClick={this.onCheckedAll}>
                    <span className={`r-checkbox-inner ${isCheckedAll ? 'r-checkbox-checked' : ''}`}></span>
                    <span>{allText}</span>
                  </div>
                  : null
              }
              {
                isSeacrh && treeData.length === 0 ? <div className="r-no-data-tips">{noContentText}</div> : treeData.map((item, itemIndex) =>
                  <div key={item.value} className="r-checkbox-item" onClick={() => this.onCheckboxChange(itemIndex)}>
                    <span className={`r-checkbox-inner ${item.checked ? "r-checkbox-checked" : ""}`}></span>
                    <span>{item.label}</span>
                  </div>
                )
              }
            </div>
            <div className="r-footer">
              <span>已选择：</span>
              <span className="r-selected-num">{this.getSelectedLength()}</span>
              <button type="button" className="r-sure-button" onClick={this.save}>确定</button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default DropDown;