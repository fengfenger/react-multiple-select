import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Dropdown from './Dropdown'
import './style.css'

class Demo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: props.disabled || false,
      labelPlaceholder: props.labelPlaceholder || '请选择选项',
      inputPlaceholder: props.inputPlaceholder || '请输入关键字',
      noContentText: props.noContentText || '暂无匹配项',
      treeData: props.data || [],
      selectedValue: [],
      isOpen: false,
      defaultValue: props.defaultValue || []
    };
    this.clickOutsideEvent = document.addEventListener('mousedown',
      this.onDocumentClick);
  }

  componentWillReceiveProps(nextPorps) {
    if (this.props.data !== nextPorps.data || this.props.defaultValue !== nextPorps.defaultValue)
      this.setState({
        treeData: nextPorps.data,
        defaultValue: nextPorps.defaultValue || []
      }, () => this.initTreeData())
  }

  initTreeData = () => {
    const { treeData, defaultValue } = this.state;
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
    const { isOpen, selectedValue, defaultValue } = this.state;
    this.setState({
      isOpen: !isOpen,
      defaultValue: selectedValue.length ? selectedValue : defaultValue
    });
  }

  submit = (values) => {
    const { onSubmit } = this.props;
    onSubmit && onSubmit(values);
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

export default Demo;