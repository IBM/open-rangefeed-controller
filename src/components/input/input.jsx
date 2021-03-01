import React from 'react';
import PropTypes from 'prop-types';
import './input.css';

function createGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
    return v.toString(16); // eslint-disable-line
  });
}

export default class Input extends React.Component {
  render() {
    const {
      text,
      placeholder,
      onChange,
      onClearRequested,
      onKeyPress,
      style,
    } = this.props;

    const guid = createGUID();
    const label = placeholder ? (
      <label htmlFor={guid}>{placeholder}</label>
    ) : null ;

    return (
      <div style={style} className="input">
        {label}
        <div>
          <input name={guid} id={guid} placeholder="" onKeyPress={onKeyPress} onChange={onChange} value={text} className="field" type="text" />
          <button style={{ paddingBottom: '3px' }} onClick={onClearRequested} className="close-button" type="button">✕</button>
        </div>
      </div>
    );
  }
}

Input.propTypes = {
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClearRequested: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  style: PropTypes.object,
};

Input.defaultProps = {
  onKeyPress: null,
  placerholder: null,
  style: null,
};