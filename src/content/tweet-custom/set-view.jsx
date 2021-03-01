import React from 'react';
import SetViewTitle from './set-view-title';
import SetViewBody from './set-view-body';
import PropTypes from 'prop-types';
import Util from '../../util';

const lightBulbStyle = {
  fontSize: '60px',
  float: 'right',
};

const tipStyle= {
  fontSize: '16px',
  margin: '20px',
  padding: '20px',
  fontWeight: 400,
  color: '#333',
  backgroundColor: '#fff',
};

const highlightStyle = {
  color: 'orange',
};

export default class SetView extends React.Component {
  constructor() {
    super();
    this.onDownloadSetClicked = this.onDownloadSetClicked.bind(this);
  }

  onDownloadSetClicked() {
    const { set } = this.props;
    const copy = JSON.parse(JSON.stringify(set));
    delete copy.selected;
    delete copy.isDefault;
    delete copy.isActive;
    Util.download(copy.title + '.json', JSON.stringify(copy));
  }

  render() {
    const {
      style,
      className,
      set,
      onTitleChanged,
      onDeleteSetClicked,
      onCloneSetClicked,
      onFileImported,
      onResetDefaultRequested,
      onChanged,
      onSetActivated,
    } = this.props;

    return (
      <div style={style} className={className}>
        { set &&
          <React.Fragment>
            <SetViewTitle
              title={set.title}
              isDefault={set.isDefault}
              onTitleChanged={(newTitle) => { set.title = newTitle; onTitleChanged(newTitle); }}
              onDeleteSetClicked={onDeleteSetClicked}
              onCloneSetClicked={onCloneSetClicked}
              onDownloadSetClicked={this.onDownloadSetClicked}
              onFileImported={onFileImported}
              onResetDefaultRequested={onResetDefaultRequested}
              onSetActivated={onSetActivated}
            />

            <SetViewBody
              onChanged={onChanged}
              positive={set.positive}
              neutral={set.neutral}
              negative={set.negative}
            />

            <div style={tipStyle}>
              <span role="img" aria-label="Light bulb icon" style={lightBulbStyle}>💡</span>
              <strong style={{ fontSize: '20px' }}>Pro tip:</strong><br />
              If you want the company name to appear in your tweet use the placeholder COMPANY_NAME. If you want it to have no whitespaces, e.g. for using hashtags (#TDBank instead of #TD Bank), then use COMPANY_NAME_NO_WHITESPACE.<br />
              <br />
              Example:<br />
              Hey, <span style={highlightStyle}>@COMPANY_NAME_NO_WHITESPACE</span>, I love ya! <span style={highlightStyle}>COMPANY_NAME</span> is the best!<br />
              <br />
              This will translate to:<br />
              Hey, <span style={highlightStyle}>@TDBank</span>, I love ya! <span style={highlightStyle}>TD Bank</span> is the best!<br />
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
}

SetView.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  set: PropTypes.object,
  onTitleChanged: PropTypes.func,
  onDeleteSetClicked: PropTypes.func,
  onCloneSetClicked: PropTypes.func,
  onFileImported: PropTypes.func,
  onResetDefaultRequested: PropTypes.func,
  onChanged: PropTypes.func,
  onSetActivated: PropTypes.func,
};

SetView.defaultProps = {
  style: null,
  className: '',
  set: {},
  onTitleChanged: () => {},
  onDeleteSetClicked: () => {},
  onCloneSetClicked: () => {},
  onFileImported: () => {},
  onResetDefaultRequested: () => {},
  onChanged: () => {},
  onSetActivated: PropTypes.func,
};
