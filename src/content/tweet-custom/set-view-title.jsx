import React from 'react';
import PropTypes from 'prop-types';
import { RIEInput } from 'riek';
import TweetCustomStyles from './tweet-custom-styles'

const wrapperStyle = {
  padding: '20px',
  fontSize: '40px',
  fontWeight: 200,
};

const actionBtnStyle = {
  marginRight: '10px',
};

export default class SetViewTitle extends React.Component {
  constructor() {
    super();
    this.uploadFileRef = React.createRef();
    this.onImportFileChange = this.onImportFileChange.bind(this);
  }

  onImportFileChange(event) {
    if (window.confirm("This will overwrite all tweets in this set. Click OK to proceed or cancel to abort.") === true) {
      const { onFileImported } = this.props;
      event.persist();
      if (event && event.target) {
        const { files } = event.target;
        if (files && files.length >= 0) {
          const fileReader = new FileReader();
          fileReader.addEventListener('load', (e) => {
            if (typeof onFileImported === 'function') onFileImported(e.target.result);
          });
          if (files[0]) fileReader.readAsText(files[0]);
          this.uploadFileRef.current.value = '';
        }
      }
    }
  }

  render() {
    const {
      style,
      className,
      title,
      isDefault,
      onTitleChanged,
      onDeleteSetClicked,
      onCloneSetClicked,
      onDownloadSetClicked,
      onResetDefaultRequested,
      onSetActivated,
    } = this.props;

    return (
      <div style={{...wrapperStyle, ...style}} className={className}>
        <RIEInput
          value={title}
          change={(data) => { onTitleChanged(data.title); }}
          propName='title'
        />
        {
          isDefault &&
          <React.Fragment>
            <span> (Default Set)</span>
            <div style={{ fontSize: '16px' }}>Note: The default set cannot be deleted or overwritten!</div>
          </React.Fragment>
        }
        <div>
          <button onClick={onSetActivated} style={{...TweetCustomStyles.button, ...actionBtnStyle}}>Activate</button>
          {
            !isDefault &&
            <button onClick={onDeleteSetClicked} style={{...TweetCustomStyles.button, ...actionBtnStyle}}>Delete</button>
          }
          <button onClick={onCloneSetClicked} style={{...TweetCustomStyles.button, ...actionBtnStyle}}>Clone</button>
          <button onClick={onDownloadSetClicked} style={{...TweetCustomStyles.button, ...actionBtnStyle}}>Export to file</button>
          {
            !isDefault &&
            <React.Fragment>
              <button onClick={ () => { this.uploadFileRef.current.click(); } } style={{...TweetCustomStyles.button, ...actionBtnStyle}}>Import file</button>
              <input ref={this.uploadFileRef} type="file" style={{ display: 'none' }} onChange={this.onImportFileChange} />
            </React.Fragment>
          }
          {
            isDefault && 
            <button onClick={onResetDefaultRequested} style={{...TweetCustomStyles.button, ...actionBtnStyle}}>Reset</button>
          }
        </div>
      </div>
    );
  }
}

SetViewTitle.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  isDefault: PropTypes.bool,
  onTitleChanged: PropTypes.func,
  onDeleteSetClicked: PropTypes.func,
  onCloneSetClicked: PropTypes.func,
  onDownloadSetClicked: PropTypes.func,
  onFileImported: PropTypes.func,
  onResetDefaultRequested: PropTypes.func,
  onSetActivated: PropTypes.func,
};

SetViewTitle.defaultProps = {
  style: null,
  className: '',
  title: 'Untitled',
  isDefault: false,
  onTitleChanged: () => {},
  onCloneSetClicked: () => {},
  onDownloadSetClicked: () => {},
  onFileImported: () => {},
  onResetDefaultRequested: () => {},
  onSetActivated: () => {},
};
