import React from 'react';
import PropTypes from 'prop-types';
import { RIEInput } from 'riek'
import TweetCustomStyles from './tweet-custom-styles';

const wrapperStyle = {
  margin: '0 20px',
  padding: '30px 20px',
  position: 'relative',
  borderTop: '1px solid #666',
};

const imagePreviewStyle = {
  width: '100%',
  borderRadius: '5px',
};

const imageUploadBtnStyle = {
  display: 'block',
};

export default class SetTweet extends React.Component {
  constructor() {
    super();
    this.imageRef = React.createRef();
    this.onTextChanged = this.onTextChanged.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  onTextChanged(value) {
    const { data, onChanged } = this.props;
    data.text = value.text;
    onChanged(data);
  }

  uploadImage(event) {
    event.persist();
    if (event && event.target) {
      const { files } = event.target;
      if (files && files.length >= 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (e) => {
          const { data, onChanged } = this.props;
          data.img = e.target.result;
          onChanged(data);
        });
        if (files[0]) fileReader.readAsDataURL(files[0]);
      }
    }
  }

  removeImage() {
    const { data, onChanged } = this.props;
    data.img = null;
    onChanged(data);
  }

  render() {
    const { style, className, data, onDeleteRequested } = this.props;
    return (
      <div
        style={{...wrapperStyle, ...style}}
        className={className}
      >
        <button style={TweetCustomStyles.closeSmallBtnStyle} onClick={() => { onDeleteRequested(data); }}>×</button>
        <RIEInput
          value={data.text}
          change={this.onTextChanged}
          propName='text'
        />
        { data.img &&
          <div style={{ marginTop: '20px', position: 'relative' }}>
            <img src={data.img} alt="" style={imagePreviewStyle} />
            <button style={TweetCustomStyles.closeBtnStyle} onClick={this.removeImage} title="Remove image">×</button>
          </div>
        }
        { !data.img &&
          <div style={{ marginTop: '20px' }}>
            <input style={{ display: 'none' }} ref={this.imageRef} type="file" onChange={this.uploadImage} />
            <button style={{ ...TweetCustomStyles.button, ...imageUploadBtnStyle }} onClick={() => { this.imageRef.current.click(); }}>⇪ Upload image</button>
          </div>
        }
      </div>
    );
  }
}

SetTweet.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  onChanged: PropTypes.func,
  onDeleteRequested: PropTypes.func,
};

SetTweet.defaultProps = {
  style: null,
  className: '',
  onChanged: () => {},
  onDeleteRequested: () => {},
};
