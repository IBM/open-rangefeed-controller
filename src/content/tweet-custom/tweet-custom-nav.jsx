import React from 'react';
import PropTypes from 'prop-types';
import TweetCustomStyle from './tweet-custom-styles';

const wrapperStyle = {
  borderRight: '1px solid #333',
  padding: '20px',
};

const setBtnStyle = {
  display: 'block',
  background: 'transparent',
  border: 0,
  color: '#fff',
  padding: '3px 0',
  whiteSpace: 'nowrap',
};

export default class NavPanel extends React.Component {
  constructor() {
    super();
    this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
  }

  onAddBtnClicked() {
    const { sets, onSetCreated } = this.props;
    const newSet = {
      title: 'Untitled',
      positive: [],
      neutral: [],
      negative: [],
    };
    sets.push(newSet);
    onSetCreated(newSet);
  }

  render() {
    const { sets, style, className, onSetSelected } = this.props;
    const setsJsx = [];

    for (let i = 0; i < sets.length; i += 1) {
      const selectedStyle = sets[i].selected === true ? { fontWeight: 'bold' } : { fontWeight: '200' };
      setsJsx.push((
        <button
          onClick={() => { onSetSelected(sets[i]); }}
          key={`nav-set-item-${i}`}
          style={{...setBtnStyle, ...selectedStyle}}
        >
          { sets[i].title }
          {
            sets[i].isDefault &&
            <span> (Default)</span>
          }
          {
            sets[i].isActive &&
            <span style={{ color: 'red' }}> •</span>
          }
        </button>
      ));
    }

    return (
      <div style={{...wrapperStyle, ...style}} className={className}>
        {setsJsx}
        <br />
        <button
          onClick={this.onAddBtnClicked}
          style={TweetCustomStyle.button}
        >
          + Add new set
        </button>
      </div>
    );
  }
}

NavPanel.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  sets: PropTypes.array,
  onSetSelected: PropTypes.func,
  onSetCreated: PropTypes.func,
};

NavPanel.defaultProps = {
  style: null,
  className: '',
  sets: [],
  onSetSelected: () => {},
  onSetCreated: () => {},
};
