import React from 'react';
import PropTypes from 'prop-types';
import './body.css';

export default class Body extends React.Component {
  render() {
    const { children, className } = this.props;
    const cls = `body ${className}`;
    return (
      <div className={cls}>
        {children}
      </div>
    );
  }
}

Body.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.string,
};

Body.defaultProps = {
  children: null,
  className: '',
};
