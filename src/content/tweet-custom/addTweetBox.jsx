import React from 'react';
import PropTypes from 'prop-types';
import TweetCustomStyles from './tweet-custom-styles';

const wrapperStyle = {
  margin: '20px',
  padding: '20px',
  background: '#333',
};

const imageUploadBtnStyle = {
  display: 'block',
};

const createButtonStyle = {
  background: 'linear-gradient(to bottom, #4f85bb 0%,#4f85bb 100%)',
  color: '#fff',
};

const imagePreviewStyle = {
  width: '100%',
  borderRadius: '5px',
};

export default class AddTweetBox extends React.Component {
  constructor() {
    super();
    this.imageRef = React.createRef();
    this.addTweet = this.addTweet.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.removePreviewImage = this.removePreviewImage.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.state = {
      text: '',
      image: null,
    };
  }

  removePreviewImage() {
    this.setState({ image: null });
    this.imageRef.current.value = null;
  }

  resetForm() {
    this.setState({ text: '' });
    this.removePreviewImage();
  }

  addTweet() {
    const { text, image } = this.state;
    const { onTweetPushRequested } = this.props;
    if (text) {
      onTweetPushRequested({ text, image });
      this.resetForm();
      this.textInput.focus();
    } else {
      alert('Please fill out the text field!');
    }
  }

  uploadImage(event) {
    event.persist();
    if (event && event.target) {
      const { files } = event.target;
      if (files && files.length >= 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          this.setState({ image: e.target.result });
        });
        if (files[0]) fileReader.readAsDataURL(files[0]);
      }
    }
  }

  render() {
    const { text, image } = this.state;
    return (
      <div style={wrapperStyle}>
        <span style={{ fontSize: '12px' }}>Tweet text</span>
        <input
          type="text"
          style={{ marginBottom: '10px', width: '100%', display: 'block' }}
          value={text}
          onChange={(evt) => { this.setState({ text: evt.target.value }) }}
          onKeyPress={(evt) => { if (evt.key === 'Enter') this.addTweet(); }}
          ref={(input) => { this.textInput = input; }}
        />
        <input style={{ display: 'none' }} ref={this.imageRef} type="file" onChange={this.uploadImage} />
        <button style={{ ...TweetCustomStyles.button, ...imageUploadBtnStyle }} onClick={() => { this.imageRef.current.click(); }}>⇪ Upload image</button>
        { image &&
          <div style={{ marginTop: '20px', marginBottom: '20px', position: 'relative' }}>
            <img src={image} alt="" style={imagePreviewStyle} />
            <button style={TweetCustomStyles.closeBtnStyle} onClick={this.removePreviewImage} title="Remove image">×</button>
          </div>
        }
        <div style={{ textAlign: 'right', width: '100%' }}>
          <button style={{ ...TweetCustomStyles.button, ...createButtonStyle }} onClick={this.addTweet}>Create tweet</button>
        </div>
      </div>
    );
  }
}

AddTweetBox.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onTweetPushRequested: PropTypes.func,
};

AddTweetBox.defaultProps = {
  style: null,
  className: '',
  onTweetPushRequested: () => {},
};
