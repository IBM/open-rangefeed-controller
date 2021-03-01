const styles = {

  button: {
    borderRadius: '20px',
    padding: '8px 13px',
    fontSize: '12px',
    border: 0,
    background: 'linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%)',
  },

  closeBtnStyle: {
    marginLeft: '10px',
    position: 'absolute',
    border: 0,
    borderRadius: '1px',
    width: '30px',
    height: '30px',
    top: '10px',
    right: '10px',
    fontSize: '30px',
    background: 'rgba(255, 255, 255, 0.7)',
    color: '#333',
    paddingBottom: '5px',
    paddingRight: '25px',
    lineHeight: 0,
  },

};

styles.closeSmallBtnStyle = {
  ...styles.closeBtnStyle,
  background: 'transparent',
  color: '#fff',
  border: 0,
  fontSize: '20px',
  paddingRight: '20px',
  width: '25px',
  height: '25px',
};

export default styles;
