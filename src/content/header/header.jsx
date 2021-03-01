import React from 'react';
import PropTypes from 'prop-types';
import './header.css';

export default class Header extends React.Component {
  render() {
    const { title } = this.props;

    return (
      <div className="header">
        {title}
      </div>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: '',
};
