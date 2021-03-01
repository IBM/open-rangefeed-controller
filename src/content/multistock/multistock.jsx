import React from 'react';
import Store from 'react-couchdb-store';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import RangeSlider from 'react-rangeslider';
import dbSchemaMultistock from '../../db-schema-multistock';

const stockStartingPriceStyle = {
  width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center',
  paddingTop: '10px',
};

const stockStartingPriceSaveBtn = {
  marginLeft: '20px',
  width: '120px',
  height: '18px',
  lineHeight: 0,
};

const removeCompanyLogoBtnStyle = {
  background: 'red',
  height: '10px',
  padding: '10px',
  fontSize: '12px',
  lineHeight: '0px',
  marginLeft: '20px',
};

export default class Multistock extends React.Component {
  constructor() {
    super();
    this.state = {};

    this.company1LogoUploadRef = React.createRef();
    this.company2LogoUploadRef = React.createRef();
    this.company3LogoUploadRef = React.createRef();
    this.company4LogoUploadRef = React.createRef();

    this.createStockTile = this.createStockTile.bind(this);

    const { storeUtil } = Store;

    storeUtil.init(dbSchemaMultistock);
    storeUtil.createDefaultStates(this.state);

    storeUtil.loadState((newState) => {
      this.setState(newState);
    });

    storeUtil.registerEventListeners((newState) => {
      this.setState(newState);
    });
  }

  /**
   * Event listener, gets called when user dragged the slider for stock price
   */
  onStockValueChanged(index) {
    const name = 'stockModifier' + index;
    const stockModifier = this.state[name];

    // Use timeout as hack :-(
    // See https://github.com/whoisandy/react-rangeslider/issues/114
    clearTimeout(this.stockTimer);
    this.stockTimer = setTimeout(() => {
      Store.store.update({
        _id: name,
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
   * Changes the initial stock start price
   */
  updateStockStartingPrice(index){
    Store.store.update({
      _id: 'stockStartingPrice' + index,
      value: this.state['stockStartingPrice' + index],
    }, true).then((res) => {
      if (!res.ok) {
        alert('Error: Failed to set new stock starting price');
      }
    });
  }

  /**
   * Changes the name of the company
   */
  onCompanyNameChange(index) {
    const companyName = this.state['companyName' + index];
    const companyNameImg = this.state['companyName' + index + 'Img'];

    if (!companyName) {
      alert('You must fill out the company name field!');
    } else {
      Store.store.update({
        _id: 'companyName' + index,
        value: companyName,
        img: companyNameImg,
      }, true).then((res) => {
        if (!res.ok) {
          alert('Error: Failed to change company info');
        }
      });
    }
  }

  /**
   * Event listener - Gets called when company logo changes
   */
  onCompanyLogoChanged(index, event) {
    event.persist();
    if (event && event.target) {
      const { files } = event.target;
      if (files && files.length >= 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          const newState = {};
          newState['companyName' + index + 'Img'] = e.target.result;
          this.setState(newState);
          this['company' + index + 'LogoUploadRef'].current.value = null;
        });
        if (files[0]) fileReader.readAsDataURL(files[0]);
      }
    }
  }

  /**
   * Gets called when user clicks on remove-logo-button
   */
  removeCompanyLogo(index) {
    Store.store.update({
      _id: 'companyName' + index,
      img: '',
    }, true).then((res) => {
      if (res.ok === true) {
        const newState = {};
        newState['companyName' + index + 'Img'] = '';
        this.setState(newState);
      } else alert('Error: Failed to remove company logo');
    });
  }

  createStockTile(index) {
    const stockModifier = this.state['stockModifier' + index];
    const companyName = this.state['companyName' + index];
    const companyNameImg = this.state['companyName' + index + 'Img'];
    const stockStartingPrice = this.state['stockStartingPrice' + index];
    const companyLogoUploadRef = this['company' + index + 'LogoUploadRef'];

    let stockModifierFormated;
    if (stockModifier >= 0) stockModifierFormated = `+${stockModifier}%`;
    else if (stockModifier < 0) stockModifierFormated = `-${stockModifier * -1}%`;

    const companyLogoPreviewJsx = companyNameImg ? (
      <div style={{ marginBottom: '20px' }}>
        <img style={{ width: '80px',  }} src={companyNameImg} alt="" />
        <Button onClick={() => { this.removeCompanyLogo(index); }} style={removeCompanyLogoBtnStyle}>
          Remove logo
        </Button>
      </div>
    ) : undefined;

    return (
      <React.Fragment>
        <div className="range-title">Stock { index } Price {stockModifierFormated}</div>
        <RangeSlider
          min={-200}
          max={200}
          step={2}
          value={stockModifier}
          orientation="horizontal"
          onChange={(value) => {
            const newState = {};
            newState['stockModifier' + index] = value;
            this.setState(newState);
          }}
          onChangeComplete={() => { this.onStockValueChanged(index); }}
        />
    
        <div style={stockStartingPriceStyle}>
          Stock starting price (in USD):
          <input
            style={{ width: '50px', marginLeft: '10px' }}
            type="number"
            onKeyPress={(evt) => { if (evt.key === 'Enter') this.updateStockStartingPrice(index); }}
            onChange={(evt) => { 
              const newState = {};
              newState['stockStartingPrice' + index] = evt.target.value;
              this.setState(newState);
            }}
            value={stockStartingPrice}
          />
          <Button style={stockStartingPriceSaveBtn} onClick={() => { this.updateStockStartingPrice(index); }}>
            Save
          </Button>
        </div>
    
        <div style={{ width: '80%', border: '1px solid #fff', padding: '2%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', borderRadius: '20px' }} className="wrapper">
          <div className="upper">
            <Input
              style={{ marginLeft: '10px', position: 'relative', width: '220px' }}
              text={companyName}
              placeholder={`Company ${index} Name`}
              onKeyPress={(evt) => { if (evt.key === 'Enter') this.onCompanyNameChange(index); }}
              onChange={(evt) => {
                const newState = {};
                newState['companyName' + index] = evt.target.value;
                this.setState(newState);
              }}
              onClearRequested={() => {
                const newState = {};
                newState['companyName' + index] = '';
                this.setState(newState);
              }}
            />
          </div>
          <div className="lower">
            <div className="inner-box" style={{ marginTop: '20px' }}>
              <span className="title">Company { index } Logo Upload</span>
              <br />
              <input ref={companyLogoUploadRef} onChange={(event) => { this.onCompanyLogoChanged(index, event); }} type="file" />
            </div>
            <br />
            {companyLogoPreviewJsx}
            <div style={{ width: '100%', textAlign: 'right' }}>
              <Button style={{ width: '150px' }} onClick={() => { this.onCompanyNameChange(index); }}>Save</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ backgroundColor: '#777', width: '50%', padding: '2%', borderBottom: '1px solid #fff' }}>
            { this.createStockTile(1) }
          </div>
          <div style={{ backgroundColor: '#434343', width: '50%', padding: '2%', borderBottom: '1px solid #fff' }}>
          { this.createStockTile(2) }
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ backgroundColor: '#434343', width: '50%', padding: '2%' }}>
            { this.createStockTile(3) }
          </div>
          <div style={{ backgroundColor: '#777', width: '50%', padding: '2%' }}>
            { this.createStockTile(4) }
          </div>
        </div>
      </div>
    );
  }
}
