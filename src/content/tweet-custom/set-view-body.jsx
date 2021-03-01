import React from 'react';
import PropTypes from 'prop-types';
import SetColumn from './set-column';

const wrapperStyle = {
  display: 'flex',
};

export default class SetViewBody extends React.Component {
  render() {
    const { style, className, positive, negative, neutral, onChanged } = this.props;

    return (
      <div style={{...wrapperStyle, ...style}} className={className}>
        <SetColumn onChanged={onChanged} title="Positive Tweets" name="positive-tweets" style={{ flex: 1 }} tweets={positive} />
        <SetColumn onChanged={onChanged} title="Neutral Tweets" name="neutral-tweets" style={{ flex: 1, borderLeft: '1px solid #333' }} tweets={neutral} />
        <SetColumn onChanged={onChanged} title="Negative Tweets" name="negative-tweets" style={{ flex: 1, borderLeft: '1px solid #333' }} tweets={negative} />
      </div>
    );
  }
}

SetViewBody.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  positive: PropTypes.array,
  negative: PropTypes.array,
  onChanged: PropTypes.func,
};

SetViewBody.defaultProps = {
  style: null,
  className: '',
  positive: [],
  negative: [],
  onChanged: () => {},
};
