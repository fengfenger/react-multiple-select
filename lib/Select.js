import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Dropdown from './Dropdown';
import './assets/style.css';

class Select extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: props.disabled || false,
      labelPlaceholder: props.labelPlaceholder || '请选择选项',
      inputPlaceholder: props.inputPlaceholder || '请输入关键字',
      noContentText: props.noContentText || '暂无匹配项',
      treeData: [],
      selectedValue: [],
      isOpen: false
    };
    this.clickOutsideEvent = document.addEventListener('mousedown', this.onDocumentClick);
    this.defaultValue = []  //不能放入state，避免勾选后勾选点击击确定仍出现默认值问题
  }

  componentWillReceiveProps(nextProps) {
    const treeData = nextProps.data.length ? nextProps.data : []
    const defaultValue = nextProps.defaultValue && nextProps.defaultValue.length ? nextProps.defaultValue : []
    let selectedValue = [];
    treeData.map((item, index) => {
      defaultValue.length && defaultValue.map(c => {
        if (item.value == c.value) {
          item.checked = true;
          selectedValue.push(item);
        }
      })
      return item;
    })
    this.defaultValue = defaultValue
    this.setState({
      selectedValue,
      treeData
    });
  }

  componentWillUnmount() {
    this.clickOutsideEvent.remove();
    this.clickOutsideEvent = null;
  }


  onDocumentClick = (e) => {
    const target = e.target;
    const root = findDOMNode(this);
    if (!this.contains(root, target)) {
      this.setState({
        isOpen: false
      });
    }
  }

  contains = (root, n) => {
    let node = n;
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  onInputClick = () => {
    const { isOpen, selectedValue } = this.state;
    this.setState({
      isOpen: !isOpen,
      defaultValue: selectedValue.length ? selectedValue : this.defaultValue
    });
  }

  submit = (values) => {
    const { onSubmit } = this.props;
    onSubmit && onSubmit(values);
    this.defaultValue = []
    this.setState({
      selectedValue: values,
      isOpen: false
    });
  }

  render() {
    const { selectedValue, treeData, isOpen, defaultValue, labelPlaceholder, inputPlaceholder, noContentText, disabled } = this.state;
    const { className = '', dropdownClassName = '' } = this.props;
    return (
      <div className={`r-multiple-select-list ${className}`}>
        <div className={`r-label-list ${disabled ? 'r-label-list-disabled' : ''}`} onClick={disabled ? null : this.onInputClick}>
          {selectedValue.length ? selectedValue.length === treeData.length ? "全部" : selectedValue.map(item => item.label).join(',') : labelPlaceholder}
          <span className={`r-arrow-span ${isOpen ? "r-arrow-open" : "r-arrow-close"}`}></span>
        </div>
        {isOpen ?
          <Dropdown
            treeData={treeData}
            onOk={this.submit}
            defaultValue={defaultValue}
            inputPlaceholder={inputPlaceholder}
            noContentText={noContentText}
            dropdownClassName={dropdownClassName}
          />
          : null}
      </div>
    );
  }
}

export default Select;