import React from 'react';
import PropTypes from 'prop-types';
import './tag.css';

export default class Tag extends React.Component {
  render() {
    const { label } = this.props;
    return (
      <div className="tag">
        <button className="delete-button" type="button">x</button>
        <span className="label">{label}</span>
      </div>
    );
  }
}

Tag.propTypes = {
  label: PropTypes.string,
};

Tag.defaultProps = {
  label: '',
};
