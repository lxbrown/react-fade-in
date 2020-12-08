import React, { Component } from "react";
import classNames from 'classnames';

export default class FadeIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxIsVisible: 0,
      assetsLoaded: !props.children.some((child) => (child.type == 'FadeInImage'))
    };
  }

  get delay() {
    return this.props.delay || 50;
  }

  get transitionDuration() {
    return this.props.transitionDuration || 400;
  }

  componentDidMount() {
    const count = React.Children.count(this.props.children);
    let i = 0;
    this.interval = setInterval(() => {
      if (!this.state.assetsLoaded) {
        return;
      }
      i++;
      if (i > count) clearInterval(this.interval);

      this.setState({ maxIsVisible: i });
    }, this.delay);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fadeChild(child, i) {
    const style={
      transition: `opacity ${this.transitionDuration}ms, transform ${this.transitionDuration}ms`,
      transform: this.state.maxIsVisible > i ? 'none' : 'translateY(20px)',
      opacity: this.state.maxIsVisible > i ? 1 : 0
    }

    if (this.props.childTag == '') {
      const className = classNames(
        child.props.className,
        this.props.childClassName
      );
      
      const props = {
          className,
          style,
      };

      return React.cloneElement(child, props);
    }
    else {
      const ChildTag = this.props.childTag || "div";
      return (
        <ChildTag
          className={this.props.childClassName}
          style={style}
        >
          {child}
        </ChildTag>
      );
    }
  };

  render() {
    const WrapperTag = this.props.wrapperTag || "div";

    return (
      <WrapperTag className={this.props.className}>
        {React.Children.map(this.props.children, (child, i) => this.fadeChild(child, i))}
      </WrapperTag>
    );
  }
}