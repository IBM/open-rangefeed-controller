import React from 'react';
import Store from 'react-couchdb-store';
import RangeSlider from 'react-rangeslider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import 'react-rangeslider/lib/index.css';
import Header from './header/header';
import Body from './body/body';
import Row from './body/row/row';
import companyLogo from './base64imgs/company-logo';
import Button from '../components/button/button';
import Input from '../components/input/input';
import dbSchema from '../db-schema-main';
import elevatorStuckImg from './base64imgs/elevator-stuck';
import ransomwareImg from './base64imgs/ransomware';
import TweetCustomContent from './tweet-custom/tweet-custom-content';
import Multistock from './multistock/multistock';
import './content.css';

export default class Content extends React.Component {
  /**
   * Default constructor
   */
  constructor() {
    super();

    // States
    this.state = {
      customTweetDB: '',
      customTweetUserNameDB: '',
      customTweetUserVipDB: false,
      customerTweetDB: '',
      customerTweet: '',
      hashTagDB: '',
      sentiment: 0,
      stockModifier: 0,
      currency: '',
      stockExchange: '',
    };

    // Function bindings to this
    this.stickyImgUploadRef = React.createRef();
    this.userImgUploadRef = React.createRef();
    this.companyLogoUploadRef = React.createRef();
    this.updateHashTag = this.updateHashTag.bind(this);
    this.onHashtagDeleteClicked = this.onHashtagDeleteClicked.bind(this);
    this.onCustomTweetDeleteClicked = this.onCustomTweetDeleteClicked.bind(this);
    this.onCustomerTweetDeleteClicked = this.onCustomerTweetDeleteClicked.bind(this);
    this.onSentimentChanged = this.onSentimentChanged.bind(this);
    this.onStockValueChanged = this.onStockValueChanged.bind(this);
    this.onStockExchangeChange = this.onStockExchangeChange.bind(this);
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onCustomTweetImgChange = this.onCustomTweetImgChange.bind(this);
    this.onCustomTweetUserImgChange = this.onCustomTweetUserImgChange.bind(this);
    this.onCompanyLogoChanged = this.onCompanyLogoChanged.bind(this);
    this.updateStockStartingPrice = this.updateStockStartingPrice.bind(this);
    this.onElevatorEventBtnClicked = this.onElevatorEventBtnClicked.bind(this);
    this.onRansomwareEventBtnClicked = this.onRansomwareEventBtnClicked.bind(this);
    this.getElevatorStuckText = this.getElevatorStuckText.bind(this);
    this.getRansomwareText = this.getRansomwareText.bind(this);
    this.onSetActivated = this.onSetActivated.bind(this);
    this.onBoom = this.onBoom.bind(this);
    this.setView = this.setView.bind(this);

    // Initialize DB with database schema
    const { storeUtil } = Store;
    storeUtil.init(dbSchema);

    // Fill initial states as defined in database schema
    storeUtil.createDefaultStates(this.state);

    // Reads data from database
    storeUtil.loadState((newState) => {
      const newStateWithDB = newState;
      if (newState.customTweet) newStateWithDB.customTweetDB = newState.customTweet;
      if (newState.customTweetUserName) newStateWithDB.customTweetUserNameDB = newState.customTweetUserName;
      if (newState.customTweetUserVip) newStateWithDB.customTweetUserVipDB = newState.customTweetUserVip;
      if (newState.customerTweet) newStateWithDB.customerTweetDB = newState.customerTweet;
      if (newState.hashTag) newStateWithDB.hashTagDB = newState.hashTag;
      if (newState.currency) newStateWithDB.currency = newState.currency;
      if (newState.stockExchange) newStateWithDB.stockExchange = newState.stockExchange;
      this.setState(newStateWithDB);
    });

    // Get notified when database value changes
    storeUtil.registerEventListeners((newState) => {
      const newStateWithDB = newState;
      if (newState.customTweet) newStateWithDB.customTweetDB = newState.customTweet;
      if (newState.customTweetUserName) newStateWithDB.customTweetUserNameDB = newState.customTweetUserName;
      if (newState.customTweetUserVip) newStateWithDB.customTweetUserVipDB = newState.customTweetUserVip;
      if (newState.customerTweet) newStateWithDB.customerTweetDB = newState.customerTweet;
      if (newState.hashTag) newStateWithDB.hashTagDB = newState.hashTag;
      if (newState.currency) newStateWithDB.currency = newState.currency;
      if (newState.stockExchange) newStateWithDB.stockExchange = newState.stockExchange;
      this.setState(newStateWithDB);
    });
  }

  /**
   * EventListener - Gets called when user wants to delete hashtag
   */
  onHashtagDeleteClicked() {
    Store.store.update({
      _id: 'hashTag',
      value: '',
    }, true).then((res) => {
      if (res.ok === true) {
        this.setState({
          hashTag: '',
          hashTagDB: '',
        });
      } else alert('Error: Failed to delete hash tag');
    });
  }

  /**
   * Changes the initial stock start price
   */
  updateStockStartingPrice(){
    Store.store.update({
      _id: 'stockStartingPrice',
      value: this.state.stockStartingPrice,
    }, true).then((res) => {
      if (!res.ok) {
        alert('Error: Failed to set new stock starting price');
      }
    });
  }

  /**
   * Called when set view button is pressed
   */
  setView(value){
    Store.store.update({
      _id: 'curViewIndex',
      value: value
    },true).then((res) => {
      if (res.ok === true) {
        this.setState({ curViewIndex: value });
      } else alert('Error: view malfunction');
    });
  }

  /**
   * Called when boom button is pressed
   */
  onBoom() {
    Store.store.update({
      _id: 'sentiment',
      value: -25,
    }, true).then((res) => {
      if (res.ok === true) {
        this.setState({ sentiment: -25 });
        Store.store.update({
          _id: 'stockModifier',
          value: -30, // Smaller fluctuatino -66
        }, true).then((res) => {
          if (res.ok === true) {
            this.setState({ stockModifier: -30 }); // Smaller fluctuatino -66
          } else alert('Error: Booom malfunction :-(');
        });
      } else alert('Error: Booom malfunction :-(');
    });
  }

  /**
   * EventListener - Gets called when user wants to delete custom tweet
   */
  onCustomTweetDeleteClicked() {
    Store.store.update({
      _id: 'customTweet',
      value: '',
      img: '',
      userName: '',
      userImg: '',
      userVip: false,
    }, true).then((res) => {
      if (res.ok === true) {
        this.stickyImgUploadRef.current.value = null;
        this.userImgUploadRef.current.value = null;
        this.setState({
          customTweet: '',
          customTweetDB: '',
          customTweetImg: '',
          customTweetUserName: '',
          customTweetUserNameDB: '',
          customTweetUserVip: false,
          customTweetUserVipDB: false,
          customTweetUserImg: '',
        });
      } else alert('Error: Failed to delete sticky tweet');
    });
  }

  /**
   * EventListener - Gets called when user wants to delete B&O tweet sent by customer
   */
  onCustomerTweetDeleteClicked() {
    Store.store.update({
      _id: 'customerTweet',
      value: '',
    }, true).then((res) => {
      if (res.ok === true) {
        this.setState({
          customerTweet: '',
          customerTweetDB: '',
        });
      } else alert('Error: Failed to delete B&O tweet');
    });
  }

  /**
   * Event listener, gets called when user dragged the slider for sentiment
   */
  onSentimentChanged() {
    const { sentiment } = this.state;

    clearTimeout(this.sentimentTimer);
    // Use timeout as hack :-(
    // See https://github.com/whoisandy/react-rangeslider/issues/114
    this.sentimentTimer = setTimeout(() => {
      Store.store.update({
        _id: 'sentiment',
        value: sentiment,
      }, true).then((res) => {
        if (!res.ok) alert('Error: Failed to update sentiment modifier value');
      }).catch((err) => {
        alert('Error: Failed to update sentiment modifier value');
        console.log(err);
      });
    }, 100);
  }

  /**
   * Event listener, gets called when new exchange name is set
   */
  onStockExchangeChange() {
    const { stockExchange } = this.state;

    Store.store.update({
      _id: 'stockExchange',
      value: stockExchange,
    }, true).then((res) => {
      if (!res.ok) alert('Error: Failed to update stock modifier value');
    }).catch((err) => {
      alert('Error: Failed to update stock modifier value');
      console.log(err);
    });
  }

  /**
   * Event listener, gets called when new currency is set
   */
  onCurrencyChange() {
    const { currency } = this.state;

    Store.store.update({
      _id: 'currency',
      value: currency,
    }, true).then((res) => {
      if (!res.ok) alert('Error: Failed to update stock modifier value');
    }).catch((err) => {
      alert('Error: Failed to update stock modifier value');
      console.log(err);
    });
  }

  /**
   * Event listener, gets called when user dragged the slider for stock price
   */
  onStockValueChanged() {
    const { stockModifier } = this.state;

    // Use timeout as hack :-(
    // See https://github.com/whoisandy/react-rangeslider/issues/114
    clearTimeout(this.stockTimer);
    this.stockTimer = setTimeout(() => {
      Store.store.update({
        _id: 'stockModifier',
        value: stockModifier,
      }, true).then((res) => {
        if (!res.ok) alert('Error: Failed to update stock modifier value');
      }).catch((err) => {
        alert('Error: Failed to update stock modifier value');
        console.log(err);
      });
    }, 100);
  }

  /**
   * Event listener - Gets called when custom tweet image changes
   */
  onCustomTweetImgChange(event) {
    event.persist();
    if (event && event.target) {
      const { files } = event.target;
      if (files && files.length >= 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          this.setState({ customTweetImg: e.target.result });
        });
        if (files[0]) fileReader.readAsDataURL(files[0]);
      }
    }
  }

  /**
   * Event listener - Gets called when user tweet image changes
   */
  onCustomTweetUserImgChange(event) {
    event.persist();
    if (event && event.target) {
      const { files } = event.target;
      if (files && files.length >= 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          this.setState({ customTweetUserImg: e.target.result });
        });
        if (files[0]) fileReader.readAsDataURL(files[0]);
      }
    }
  }

  /**
   * Gets called when user clicks on remove-logo-button
   */
  removeCompanyLogo() {
    Store.store.update({
      _id: 'companyName',
      img: '',
    }, true).then((res) => {
      if (res.ok === true) {
        this.setState({
          companyNameImg: '',
        });
      } else alert('Error: Failed to remove company logo');
    });
  }

  /**
   * Event listener - Gets called when company logo changes
   */
  onCompanyLogoChanged(event) {
    event.persist();
    if (event && event.target) {
      const { files } = event.target;
      if (files && files.length >= 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          this.setState({ companyNameImg: e.target.result });
          console.log(this.companyLogoUploadRef);
          this.companyLogoUploadRef.current.value = null;
        });
        if (files[0]) fileReader.readAsDataURL(files[0]);
      }
    }
  }

  /**
   * Updates the hashTag filter value in the database
   */
  updateHashTag() {
    const { hashTag } = this.state;
    const hashTagTrimmed = hashTag ? hashTag.trim() : '';
    Store.store.update({
      _id: 'hashTag',
      value: hashTagTrimmed,
    }, true).then((res) => {
      if (res.ok === true) this.setState({ hashTag: '', hashTagDB: hashTagTrimmed });
      else alert('Error: Failed to set hash tag');
    });
  }

  /**
   * Changes the custom tweet and makes it appear if text is set
   */
  updateCustomTweet() {
    const { customTweet, customTweetImg, customTweetUserName, customTweetUserImg, customTweetUserVip } = this.state;
    if (!customTweet) {
      alert('You must enter a text/message for this tweet');
    } else {
      Store.store.update({
        _id: 'customTweet',
        value: customTweet,
        img: customTweetImg,
        userName: customTweetUserName,
        userImg: customTweetUserImg,
        userVip: customTweetUserVip,
      }, true).then((res) => {
        if (res.ok === true) {
          this.stickyImgUploadRef.current.value = null;
          this.userImgUploadRef.current.value = null;
          this.setState({
            customTweet: '',
            customTweetDB: customTweet,
            customTweetUserName: '',
            customTweetUserNameDB: customTweetUserName,
            customTweetUserVip: false,
            customTweetUserVipDB: customTweetUserVip,
          });
        } else alert('Error: Failed to set sticky tweet');
      });
    }
  }

  /**
   * Changes the customer's B&O tweet and makes it appear if text is set
   */
  updateCustomerTweet() {
    const { customerTweet } = this.state;
    if (!customerTweet) {
      alert('You must enter a text/message for this tweet');
    } else {
      Store.store.update({
        _id: 'customerTweet',
        value: customerTweet,
      }, true).then((res) => {
        if (res.ok === true) {
          this.setState({
            customerTweet: '',
            customerTweetDB: customerTweet,
          });
        } else alert('Error: Failed to set sticky tweet');
      });
    }
  }

  /**
   * Changes the name of the company
   */
  onCompanyNameChange() {
    const { companyName, companyNameImg, companyNameTweet } = this.state;

    if (!companyName) {
      alert('You must fill out the company name field!');
    } else {
      Store.store.update({
        _id: 'companyName',
        value: companyName,
        img: companyNameImg,
        tweet: companyNameTweet,
      }, true).then((res) => {
        if (!res.ok) {
          alert('Error: Failed to change company info');
        }
      });
    }
  }

  /**
   * Returns the text of the "People stuck in elevator" sticky tweet
   */
  getElevatorStuckText() {
    return `Leaked images of security cameras at ${this.state.companyNameTweet} show people stuck in the elevator`;
  }

  /**
   * Returns the text for ransomware attack
   */
  getRansomwareText() {
    return `What is this on my computer?? Think it has something to do with the ${this.state.companyNameTweet} issue going on currently!`;
  }

  /**
   * Gets called when a sticky event (e.g. ransomware or elevator) is called
   */
  onStickyEvent(text, img) {
    const currentCustomTweet = {
      _id: 'customTweet',
      userName: '',
      userVip: false,
      userImg: '',
    };

    if (this.state.customTweet === text) {
      currentCustomTweet.value = '';
      currentCustomTweet.img = '';
    } else {
      currentCustomTweet.value = text;
      currentCustomTweet.img = img;
    }

    Store.store.update(currentCustomTweet, true).then((res) => {
      if (res.ok === true) {
        this.stickyImgUploadRef.current.value = null;
        this.userImgUploadRef.current.value = null;
        this.setState({
          customTweet: currentCustomTweet.value,
          customTweetDB: currentCustomTweet.value,
          customTweetImg: currentCustomTweet.img,
          customTweetUserName: currentCustomTweet.userName,
          customTweetUserNameDB: currentCustomTweet.userName,
          customTweetUserVip: currentCustomTweet.userVip,
          customTweetUserVipDB: currentCustomTweet.userVip,
          customTweetUserImg: currentCustomTweet.userImg,
        });
      } else alert('Error: Failed to set sticky tweet');
    });
  }

  /**
   * Gets called when user clicks on elevator event button
   */
  onElevatorEventBtnClicked() {
    this.onStickyEvent(this.getElevatorStuckText(), elevatorStuckImg);
  }

  /**
   * Gets called when user clicks on ransomware event button
   */
  onRansomwareEventBtnClicked() {
    this.onStickyEvent(this.getRansomwareText(), ransomwareImg);
  }

  /**
   * Resets the whole app to its default state
   */
  resetAll() {
    const r = confirm("Reset to default state?"); // eslint-disable-line
    if (r === true) {
      // Reset sentiment value
      Store.store.update({
        _id: 'sentiment',
        value: 55,
      }, true).then((res) => {
        if (res.ok === true) this.setState({ sentiment: 55 });
      });

      // Reset company name + logo value
      Store.store.update({
        _id: 'companyName',
        value: companyLogo.name,
        img: companyLogo.logo,
        tweet: companyLogo.name,
      }, true).then((res) => {
        if (res.ok === true) this.setState({
          sentiment: 55,
          companyName: companyLogo.name,
          companyNameImg: companyLogo.logo,
          companyNameTweet: companyLogo.name,
        });
      });

      // Reset stock price modifier
      Store.store.update({
        _id: 'stockModifier',
        value: 0,
      }, true).then((res) => {
        if (res.ok === true) this.setState({ stockModifier: 0 });
      });

      // Reset stock exchange name
      Store.store.update({
        _id: 'stockExchange',
        value: 'NYSE',
      }, true).then((res) => {
        if (res.ok === true) this.setState({ stockExchange: 'NYSE' });
      });

      // Reset currency
      Store.store.update({
        _id: 'currency',
        value: '$',
      }, true).then((res) => {
        if (res.ok === true) this.setState({ currency: '$' });
      });

      // Reset stock starting price
      Store.store.update({
        _id: 'stockStartingPrice',
        value: 50,
      }, true).then((res) => {
        if (res.ok === true) this.setState({ stockStartingPrice: 50 });
      });

      // Reset hashtag filter
      Store.store.update({
        _id: 'hashTag',
        value: '',
      }, true).then((res) => {
        if (res.ok === true) this.setState({ hashTag: '', hashTagDB: '' });
      });

      // Reset custom tweet
      Store.store.update({
        _id: 'customTweet',
        value: '',
        img: '',
        userName: '',
        userVip: false,
        userImg: '',
      }, true).then((res) => {
        if (res.ok === true) {
          this.setState({
            customTweet: '',
            customTweetDB: '',
            customTweetUserName: '',
            customTweetUserNameDB: '',
            customTweetUserVip: false,
            customTweetUserVipDB: false,
          });
        }
      });

      // Reset customer tweet
      Store.store.update({
        _id: 'customerTweet',
        value: '',
      }, true);

      // Force reload app
      setTimeout(function () {
        Store.store.update({
          _id: 'restart',
          value: true,
        }, true);
      }, 2000);

    }
  }

  /**
   * Tweet customization tool requests a new tweet set to
   * be activated.
   */
  onSetActivated(set) {
    Store.store.update({
      _id: 'tweets',
      value: {
        positive: set.positive,
        neutral: set.neutral,
        negative: set.negative,
      },
    }, true);
  }

  /**
   * React standard render method
   */
  render() {
    const {
      hashTag,
      hashTagDB,
      customTweet,
      customTweetImg,
      customTweetUserName,
      customTweetUserImg,
      customTweetUserVip,
      customTweetDB,
      customTweetUserNameDB,
      customTweetUserVipDB,
      customerTweet,
      customerTweetDB,
      boom,
      sentiment,
      stockModifier,
      stockStartingPrice,
      stockExchange,
      currency,
      companyName,
      companyNameImg,
      companyNameTweet
    } = this.state;

    const sentimentSliderClass = sentiment < 0 ? ' negative-sentiment' : (sentiment >= 0 && sentiment <= 50 ? ' neutral-sentiment' : ' positive-sentiment');
    const stockSliderClass = stockModifier < 0 ? ' negative-stock' : '';
    const elevatorStuckTweetActive = this.getElevatorStuckText() === customTweet;
    const ransomwareTweetActive = this.getRansomwareText() === customTweet;

    const companyLogoPreviewJsx = companyNameImg ? (
      <div style={{ marginBottom: '20px' }}>
        <img style={{ width: '80px',  }} src={companyNameImg} alt="" />
        <Button onClick={() => { this.removeCompanyLogo(); }} style={{ background: 'red', height: '10px', padding: '10px', fontSize: '12px', lineHeight: '0px', marginLeft: '20px' }}>Remove logo</Button>
      </div>
    ) : undefined;

    let stockModifierFormated;
    if (stockModifier >= 0) {
      stockModifierFormated = `+${stockModifier}%`;
    } else if (stockModifier < 0) {
      stockModifierFormated = `-${stockModifier * -1}%`;
    }
    return (
      <React.Fragment>
        <Header title="Rangefeed2 Admin" />
        <div style={{ paddingTop: '100px' }}>
          <Tabs defaultIndex={0}>

            {/* Tab headers */}
            <TabList>
              <Tab>App Control</Tab>
              <Tab>Tweet Customization</Tab>
              <Tab>Multistock</Tab>
            </TabList>

            <TabPanel>
              <Body className="body">
                {/* Select view*/}
                <Row className="viewPicker" title="Select View" hint="Here you can select the view that clients see">
                    <div className="view-wrapper">
                        <Button disabled={this.state.curViewIndex !== 1} className="eventbtn" onClick={()=>{this.setView(1)}}>
                            Stock View
                        </Button>
                        <Button disabled={this.state.curViewIndex !== 2}className="eventbtn" onClick={()=>{this.setView(2)}}>
                            Tweet View
                        </Button>
                        <Button disabled={this.state.curViewIndex !== 3} className="eventbtn" onClick={()=>{this.setView(3)}}>
                            Split View
                        </Button>
                        <Button disabled={this.state.curViewIndex !== 4} className="eventbtn" onClick={()=>{this.setView(4)}}>
                            Multi Stock View
                        </Button>
                    </div>
                </Row>

                {/* Custom events */}
                <Row className="events" title="Events" hint="Important note: Once an event has been triggered it cannot be reverted.">
                  <div className="event-wrapper">
                    <Button disabled={boom} className="eventbtn" onClick={this.onBoom}>BOOOOM!</Button>
                    <Button disabled={elevatorStuckTweetActive} className="eventbtn" onClick={this.onElevatorEventBtnClicked}>Elevator stuck</Button>
                    <Button disabled={ransomwareTweetActive} className="eventbtn" onClick={this.onRansomwareEventBtnClicked}>Ransomware attack</Button>
                  </div>
                </Row>

                {/* Modifiers (range slider) for sentiment and stock */}
                <Row className="modifiers" title="Modifiers" hint="Here you can directly modify the value of sentiment and stock price.">
                  <div className="range-title">Sentiment {sentiment}</div>
                  <div className={`range-wrapper${sentimentSliderClass}`}>
                    <RangeSlider
                      min={-50}
                      max={100}
                      step={5}
                      value={sentiment}
                      orientation="horizontal"
                      onChange={(value) => { this.setState({ sentiment: value }); }}
                      onChangeComplete={this.onSentimentChanged}
                    />
                  </div>
                  <div className="range-title">Stock price {stockModifierFormated}</div>
                  <div className={`range-wrapper${stockSliderClass}`}>
                    <RangeSlider
                      min={-200}
                      max={200}
                      step={2}
                      value={stockModifier}
                      orientation="horizontal"
                      onChange={(value) => { this.setState({ stockModifier: value }); }}
                      onChangeComplete={this.onStockValueChanged}
                    />
                    <br />
                  </div>

                  <hr />

                  <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', paddingTop: '10px' }}>
                    Stock starting price (in USD):
                    <input
                      style={{ width: '50px', marginLeft: '10px' }}
                      type="number"
                      onKeyPress={(evt) => { if (evt.key === 'Enter') this.updateStockStartingPrice(); }}
                      onChange={(evt) => { this.setState({ stockStartingPrice: evt.target.value }); }}
                      value={stockStartingPrice}
                    />
                    <Button
                      style={{ marginLeft: '20px', width: '120px', height: '18px', lineHeight: 0 }}
                      onClick={this.updateStockStartingPrice}
                    >
                      Save
                    </Button>
                  </div>
                </Row>

                {/* Hashtag filter */}
                <Row style={{ display: 'none' }} className="hashtag-filter center" title="Hashtag filter" hint="Adding a hashtag filter will reveal a new column showing only tweets that have this hashtag. When activated, the stock panel will be set to PiP mode automatically!">
                  <div className="wrapper">
                    <div className="upper">
                      <Input
                        text={hashTag}
                        placeholder="Hashtag text"
                        onKeyPress={(evt) => { if (evt.key === 'Enter') this.updateHashTag(); }}
                        onChange={(evt) => { this.setState({ hashTag: evt.target.value }); }}
                        onClearRequested={() => { this.setState({ hashTag: '' }); }}
                      />
                      <Button onClick={() => { this.updateHashTag(); }} className="save-button">Save</Button>
                    </div>
                    {
                      hashTagDB &&
                      (
                        <div className="lower">
                          Active hashtag:<br />
                          <br />
                          <strong>{hashTagDB}</strong>
                          <button className="button-delete-mini" onClick={this.onHashtagDeleteClicked} type="button">Delete</button>
                        </div>
                      )
                    }
                  </div>
                </Row>

                {/* Custom/sticky tweet */}
                <Row className="custom-tweet center" title="Custom Tweet" hint="Creating a custom tweet will pin this message to the top of the stream.">
                  <div className="wrapper">
                    <div className="upper">
                    <Input
                        text={customTweetUserName}
                        style={{ marginRight: '20px' }}
                        placeholder="Twitter user name"
                        onKeyPress={evt => { if (evt.key === 'Enter') this.updateCustomTweet(); }}
                        onChange={evt => { this.setState({ customTweetUserName: evt.target.value }); }}
                        onClearRequested={() => { this.setState({ customTweetUserName: '' }); }}
                      />
                      <Input
                        text={customTweet}
                        style={{ marginLeft: '20px', marginRight: '20px' }}
                        placeholder="Sticky tweet text"
                        onKeyPress={evt => { if (evt.key === 'Enter') this.updateCustomTweet(); }}
                        onChange={evt => { this.setState({ customTweet: evt.target.value }); }}
                        onClearRequested={() => { this.setState({ customTweet: '' }); }}
                      />
                      <input
                        type="checkbox"
                        name="cb-vip"
                        value="vip"
                        style={{ marginRight: '5px' }}
                        checked={customTweetUserVip}
                        onChange={_ => { this.setState({ customTweetUserVip: !customTweetUserVip });
                        }}
                      />
                      Is VIP
                    </div>
                    <div className="lower">
                      <div className="inner-box">
                        <span className="title">User image upload</span>
                        <input ref={this.userImgUploadRef} onChange={this.onCustomTweetUserImgChange} type="file" />
                      </div>

                      <div className="inner-box">
                        <span className="title">Tweet image upload</span>
                        <input ref={this.stickyImgUploadRef} onChange={this.onCustomTweetImgChange} type="file" />
                      </div>

                      <div style={{ width: '100%', textAlign: 'right' }}>
                        <Button onClick={() => { this.updateCustomTweet(); }} className="save-button">Send</Button>
                      </div>
                      {
                        customTweetDB &&
                        (
                          <div className="lower">
                            <div style={{ position: 'relative', backgroundColor: '#434343', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                              {
                                customTweetUserImg &&
                                <img style={{ width: '50px', height: '50px', borderRadius: '100px' }} src={customTweetUserImg} alt="" />
                              }
                              <div>
                                  {
                                    customTweetUserNameDB && 
                                    <div style={{display: 'inline-block', fontWeight: 'bold'}}>
                                      {customTweetUserNameDB}
                                    </div>
                                  }
                                  {
                                    customTweetUserVipDB &&
                                    <div style={{
                                      display: 'inline-block',
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: '#0188fe',
                                      borderRadius: '100px',
                                      textAlign: 'center',
                                      marginLeft: '5px',
                                    }}>✓</div>
                                  }
                              </div>
                              <strong style={{ display: 'block', width: '90%' }}>{customTweetDB}</strong><br />
                              <img style={{ width: '50%', borderRadius: '5px' }} src={customTweetImg} alt="" />
                              <button style={{ padding: 0, width: '30px', height: '30px', position: 'absolute', border: 0, background: 'transparent', color: '#fff', top: '10px', right: '20px', fontSize: '24px' }} onClick={this.onCustomTweetDeleteClicked} type="button">×</button>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </Row>

                {/* Custom/sticky tweet */}
                <Row className="custom-tweet center" title="CompanyTweet" hint="Send a tweet on behalf of the company">
                  <div className="wrapper">
                    <div className="upper">
                      <Input
                        text={customerTweet}
                        style={{ marginLeft: '20px', marginRight: '20px' }}
                        placeholder="Company Tweet"
                        onKeyPress={evt => { if (evt.key === 'Enter') this.updateCustomerTweet(); }}
                        onChange={evt => { this.setState({ customerTweet: evt.target.value }); }}
                        onClearRequested={() => { this.setState({ customerTweet: '' }); }}
                      />
                    </div>
                    <div className="lower">
                      <div style={{ width: '100%', textAlign: 'right' }}>
                        <Button onClick={() => { this.updateCustomerTweet(); }} className="save-button">Send</Button>
                      </div>
                      {
                        customerTweetDB &&
                        (
                          <div className="lower">
                            <div style={{ position: 'relative', backgroundColor: '#434343', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                              <strong style={{ display: 'block', width: '90%' }}>{customerTweetDB}</strong><br />
                              <button style={{ padding: 0, width: '30px', height: '30px', position: 'absolute', border: 0, background: 'transparent', color: '#fff', top: '10px', right: '20px', fontSize: '24px' }} onClick={this.onCustomerTweetDeleteClicked} type="button">×</button>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </Row>

                {/* Stock customization */}
                <Row className="stock center" title="Company Info" hint="Stock exchange customization">
                  <div className="wrapper">
                      <div className="upper">
                        <Input
                          text={stockExchange}
                          placeholder="Stock Exchange"
                          onKeyPress={(evt) => { if (evt.key === 'Enter') this.onStockExchangeChange(); }}
                          onChange={(evt) => { this.setState({ stockExchange: evt.target.value }); }}
                          onClearRequested={() => { this.setState({ stockExchange: '' }); }}
                        />
                        <Input
                          style={{ marginLeft: '10px' }}
                          text={currency}
                          placeholder="Currency"
                          onKeyPress={(evt) => { if (evt.key === 'Enter') this.onCurrencyChange(); }}
                          onChange={(evt) => { this.setState({ currency: evt.target.value }); }}
                          onClearRequested={() => { this.setState({ currency: '' }); }}
                        />
                        <Button
                          style={{ marginLeft: '20px', width: '120px', height: '18px', lineHeight: 0 }}
                          onClick={() => { this.onStockExchangeChange(); this.onCurrencyChange(); }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                </Row>

                {/* Company Info */}
                <Row className="companyinfo center" title="Company Info" hint="This section gives you control over the admin app. For example you can reset everything to its original state by pressing the reset button or change the company's name and logo.">
                  <div className="wrapper">
                      <div className="upper">
                        <Input
                          text={companyNameTweet}
                          placeholder="Company Tweet Name"
                          onKeyPress={(evt) => { if (evt.key === 'Enter') this.onCompanyNameChange(); }}
                          onChange={(evt) => { this.setState({ companyNameTweet: evt.target.value }); }}
                          onClearRequested={() => { this.setState({ companyNameTweet: '' }); }}
                        />
                        <Input
                          style={{ marginLeft: '10px' }}
                          text={companyName}
                          placeholder="Company Stock Name"
                          onKeyPress={(evt) => { if (evt.key === 'Enter') this.onCompanyNameChange(); }}
                          onChange={(evt) => { this.setState({ companyName: evt.target.value }); }}
                          onClearRequested={() => { this.setState({ companyName: '' }); }}
                        />
                      </div>
                      <div className="lower">
                        <div className="inner-box" style={{ marginTop: '20px' }}>
                          <span className="title">Company Logo Upload</span>
                          <input ref={this.companyLogoUploadRef} onChange={this.onCompanyLogoChanged} type="file" />
                        </div>
                        {companyLogoPreviewJsx}
                        <div style={{ width: '100%', textAlign: 'right' }}>
                          <Button style={{ width: '150px' }} onClick={() => { this.onCompanyNameChange(); }}>Save</Button>
                        </div>
                      </div>
                    </div>
                </Row>

                {/* App reset */}
                <Row className="reset" title="App Reset" hint="Warning: Triggering this will completely reset the app to its default state! All your changes will be lost!">
                  <div className="wrapper">
                    <Button onClick={() => { this.resetAll(); }}>Reset Full App</Button>
                  </div>
                </Row>
              </Body>
            </TabPanel>

            {/* Tweet customization tool */}
            <TabPanel>
              <TweetCustomContent onSetActivated={this.onSetActivated} />
            </TabPanel>

            {/* 4 stocks in one view */}
            <TabPanel>
              <Multistock />
            </TabPanel>

          </Tabs>

        </div>
      </React.Fragment>
    );
  }
}
