import React from 'react';
import PropTypes from 'prop-types';
import './button.css';

export default class Button extends React.Component {
  render() {
    const {
      children,
      className,
      onClick,
      disabled,
      style,
    } = this.props;

    const disabledClass = disabled === true ? 'disabled' : '';
    const cls = `button ${className} ${disabledClass}`;

    return (
      <button style={{ ...style }} onClick={onClick} className={cls} type="button">
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

Button.defaultProps = {
  children: null,
  className: '',
  onClick: PropTypes.func,
  disabled: false,
  style: {},
};
