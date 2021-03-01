import TweetsJson from './content/tweet-list/tweets';

const defaultTweetSet = TweetsJson.sets[0];

export default {
  hashTag: {
    defaultValue: '',
    // When reading from db make sure there is a hashtag at index 0
    postProcess: (value) => {
      if (value) return value.indexOf('#') === 0 ? value : `#${value}`;
      return '';
    },
    quickUpdate: true,
  },
  customTweet: {
    defaultValue: '',
    payload: {
      img: '',
      userName: '',
      userImg: '',
      userVip: false,
    },
  },
  customerTweet: {
    defaultValue: '',
  },
  stockStartingPrice: {
    defaultValue: 50,
  },
  stockExchange: {
    defaultValue: 'NYSE',
  },
  currency: {
    defaultValue: '$',
  },
  companyName: {
    defaultValue: '',
    payload: {
      img: '',
      tweet: '',
    },
  },
  sentiment: {
    defaultValue: 55,
    quickUpdate: true,
  },
  stockModifier: {
    defaultValue: 0,
    quickUpdate: true,
  },
  restart: {
    defaultValue: false,
  },
  tweets: {
    defaultValue: {
      positive: defaultTweetSet.positive,
      neutral: defaultTweetSet.neutral,
      negative: defaultTweetSet.negative,
    },
  },
  curViewIndex: {
    defaultValue: 1,
  },
};
