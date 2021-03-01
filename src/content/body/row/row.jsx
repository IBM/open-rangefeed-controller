import React from 'react';
import PropTypes from 'prop-types';
import './row.css';

export default class Row extends React.Component {
  render() {
    const {
      title,
      children,
      hint,
      className,
      style,
    } = this.props;

    const cls = `row ${className}`;
    return (
      <section style={style} className={cls}>
        <span className="title">{title}</span>
        <div className="inner">
          <div className="left">{children}</div>
          <div className="right">{hint}</div>
        </div>
      </section>
    );
  }
}

Row.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hint: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

Row.defaultProps = {
  title: '',
  children: null,
  hint: '',
  className: '',
  style: null,
};
