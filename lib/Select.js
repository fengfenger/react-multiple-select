import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Dropdown from './Dropdown';
import './assets/style.css';

class Select extends Component {

  constructor(props) {
    super(props);
    const {
      disabled = false,
      labelPlaceholder = '请下拉选择',
      inputPlaceholder = '请输入关键字',
      noContentText = '暂无数据',
      allText = '全部'
    } = props;

    this.state = {
      disabled,
      labelPlaceholder,
      inputPlaceholder,
      noContentText,
      allText,
      treeData: props.data || [],
      value: this.getPropsValues(props),
      isOpen: false
    };
    this.clickOutsideEvent = document.addEventListener('mousedown', this.onDocumentClick);
  }

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        value: this.getPropsValues(nextProps),
        treeData: nextProps.data || []
      });
    }
  }

  getPropsValues = (props) => {
    if (props.data) {
      let value = []
      props.data.map((item, index) => {
        props.value && props.value.map(v => {
          if (item.value == v) {
            value.push({ value: item.value, label: item.label, checked: true });
          }
        })
      })
      return value
    }
    return []
  }

  componentWillUnmount() {
    this.clickOutsideEvent && this.clickOutsideEvent.remove();
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
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  submit = (values) => {
    const { onSubmit } = this.props;
    onSubmit && onSubmit(values);
    this.setState({
      value: values,
      isOpen: false
    });
  }

  render() {
    const { value, treeData, isOpen, labelPlaceholder, inputPlaceholder, noContentText, disabled, allText } = this.state;
    const { className = '', dropdownClassName = '', showFilterAll = false } = this.props;
    return (
      <div className={`r-multiple-select-list ${className}`}>
        <div className={`r-label-list ${disabled ? 'r-label-list-disabled' : ''}`} onClick={disabled ? null : this.onInputClick}>
          {value.length ? value.length === treeData.length ? allText : value.map(item => item.label).join(',') : labelPlaceholder}
          <span className={`r-arrow-span ${isOpen ? "r-arrow-open" : "r-arrow-close"}`}></span>
        </div>
        {isOpen ?
          <Dropdown
            treeData={treeData}
            onOk={this.submit}
            value={value}
            inputPlaceholder={inputPlaceholder}
            noContentText={noContentText}
            allText={allText}
            dropdownClassName={dropdownClassName}
            showFilterAll={showFilterAll}
          />
          : null}
      </div>
    );
  }
}

export default Select;