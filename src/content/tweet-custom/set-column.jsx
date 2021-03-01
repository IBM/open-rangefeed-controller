import React from 'react';
import PropTypes from 'prop-types';
import SetTweet from './set-tweet';
import AddTweetBox from './addTweetBox';

const titleStyle = {
  margin: '20px',
  fontSize: '25px',
  fontWeight: '300',
  textAlign: 'center',
};

export default class SetColumn extends React.Component {
  constructor() {
    super();
    this.onTweetPushRequested = this.onTweetPushRequested.bind(this);
    this.deleteTweet = this.deleteTweet.bind(this);
  }

  onTweetPushRequested(tweet) {
    const { tweets } = this.props;
    tweets.push(tweet);
    this.forceUpdate();
    this.props.onChanged();
  }

  deleteTweet(tweet) {
    const { tweets } = this.props;
    tweets.splice( tweets.indexOf(tweet), 1 );
    this.forceUpdate();
    this.props.onChanged();
  }

  render() {
    const { name, style, className, tweets, title, onChanged } = this.props;
    let tweetsJsx = [];

    for (let i = tweets.length - 1; i >= 0 ; i -= 1) {
      tweetsJsx.push((
        <SetTweet
          onDeleteRequested={this.deleteTweet}
          onChanged={() => { this.forceUpdate(); onChanged(); }}
          key={`set-col-${name}-tweet-${i}`}
          data={tweets[i]}
        />
      ));
    }

    return (
      <div style={style} className={className}>
        <div style={titleStyle}>{title}</div>
        <AddTweetBox
          onTweetPushRequested={this.onTweetPushRequested}
        />
        {tweetsJsx}
      </div>
    );
  }
}

SetColumn.propTypes = {
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  tweets: PropTypes.array,
  title: PropTypes.string,
};

SetColumn.defaultProps = {
  style: null,
  className: '',
  tweets: [],
  title: '',
};
