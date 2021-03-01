import React from "react";
import PouchDB from "pouchdb-browser";
import TweetCustomNav from "./tweet-custom-nav";
import SetView from "./set-view";
import PropTypes from "prop-types";
import dataDefault from "./data-default";
import Util from "../../util";
import DbConfig from "../../dbconfig";
import Cookies from "cookies";

const wrapperStyle = {
  display: "flex",
  height: "100%"
};

export default class TweetCustomContent extends React.Component {
  constructor() {
    super();
    this.initDatabase = this.initDatabase.bind(this);
    this.updateDbItem = this.updateDbItem.bind(this);
    this.updateDbSets = this.updateDbSets.bind(this);
    this.onViewUpdated = this.onViewUpdated.bind(this);
    this.onSetCreated = this.onSetCreated.bind(this);
    this.onSetSelected = this.onSetSelected.bind(this);
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.onDeleteSetClicked = this.onDeleteSetClicked.bind(this);
    this.onCloneSetClicked = this.onCloneSetClicked.bind(this);
    this.onFileImported = this.onFileImported.bind(this);
    this.onResetDefaultRequested = this.onResetDefaultRequested.bind(this);
    this.activateSet = this.activateSet.bind(this);

    this.state = {
      set: null, // Selected set
      setsDoc: {
        sets: []
      }
    };
  }

  componentDidMount() {
    this.initDatabase();
  }

  componentWillUnmount() {
    if (this.db) this.db.close();
  }

  initDatabase() {
    const { host, port, protocol } = DbConfig.getDbHost();
    const tweetDbName = 'tweets';
    const user = Cookies.get("username");
    const pwd = Cookies.get("pwd");
    const remoteCouch = `${protocol}://${user}:${pwd}@${host}:${port}/${tweetDbName}`;
    this.db = new PouchDB(remoteCouch);
    this.readData();
  }

  readData() {
    this.db.allDocs({ include_docs: true }).then(data => {
      if (data.rows.length === 0) {
        console.log("No tweets found. Adding new row.");
        const dbSets = { sets: [dataDefault] };
        this.db.post(dbSets);
        this.readData();
      } else {
        console.log("Existing tweet set found. Will use this one.");
        this.setState({ setsDoc: data.rows[0].doc });
      }
    });
  }

  updateDbItem(item, force) {
    if (force === true) {
      return this.db.get(item._id).then(res => {
        const newObject = res;
        Object.keys(item).forEach(itemKey => {
          if (itemKey !== "_id" && itemKey !== "_rev") {
            newObject[itemKey] = item[itemKey];
          }
        });
        return this.db.put(newObject);
      });
    }
    return this.db.put(item);
  }

  updateDbSets() {
    const { sets } = this.state.setsDoc;
    let selectedSet;

    for (let i = 0; i < sets.length; i += 1) {
      if (sets[i].selected === true) {
        selectedSet = sets[i];
      }
      delete sets[i].selected;
    }

    this.updateDbItem(this.state.setsDoc, true).then(() => {
      if (selectedSet) selectedSet.selected = true;
    });
  }

  onSetCreated(set) {
    const { setsDoc } = this.state;
    const { sets } = setsDoc;
    for (let i = 0; i < sets.length; i += 1) {
      sets[i].selected = false;
    }
    set.selected = true;
    this.setState({ set });
    this.updateDbSets();
  }

  onSetSelected(set) {
    const { setsDoc } = this.state;
    const { sets } = setsDoc;
    for (let i = 0; i < sets.length; i += 1) {
      if (sets[i] === set) sets[i].selected = true;
      else sets[i].selected = false;
    }
    this.setState({ set });
  }

  onCloneSetClicked() {
    const { setsDoc, set } = this.state;
    const { sets } = setsDoc;
    const clone = JSON.parse(JSON.stringify(set));
    clone.title += " Clone";
    sets.push(clone);
    clone.selected = false;
    delete clone.isDefault;
    delete clone.isActive;
    this.updateDbSets();
    this.forceUpdate();
  }

  onFileImported(data) {
    const { set } = this.state;
    try {
      const importedSet = JSON.parse(data);
      set.negative = importedSet.negative;
      set.neutral = importedSet.neutral;
      set.positive = importedSet.positive;
      if (set.isActive === true) {
        this.activateSet();
      } else {
        this.updateDbSets();
        this.forceUpdate();
      }
    } catch (e) {
      alert(
        "Failed to import file. Please check if you picked the right one and it is not malformed!"
      );
    }
  }

  onDeleteSetClicked() {
    const { set } = this.state;
    if (set.isActive === true) {
      alert("An active set cannot be deleted. Activate another set first.");
    } else {
      if (
        window.confirm("This will delete the entire set. Are you sure?") ===
        true
      ) {
        const { setsDoc } = this.state;
        const { sets } = setsDoc;
        sets.splice(sets.indexOf(set), 1);
        this.setState({ set: null });
        this.updateDbSets();
      }
    }
  }

  onViewUpdated() {
    if (this.state.set.isActive === true) {
      this.activateSet();
    } else {
      this.updateDbSets();
      this.forceUpdate();
    }
  }

  onTitleChanged(newTitle) {
    const { set } = this.state;
    if (set) {
      set.title = newTitle || "Untitled";
    }

    this.forceUpdate();
    this.updateDbSets();
  }

  onResetDefaultRequested() {
    if (
      window.confirm(
        "This will set the default set to its initial state. Are you sure?"
      ) === true
    ) {
      const { setsDoc } = this.state;
      const { sets } = setsDoc;
      const copy = Util.copyObject(dataDefault);
      sets[0].title = copy.title;
      sets[0].positive = copy.positive;
      sets[0].neutral = copy.neutral;
      sets[0].negative = copy.negative;
      this.forceUpdate();
      this.updateDbSets();
    }
  }

  activateSet() {
    const { set } = this.state;
    const { setsDoc } = this.state;
    const { onSetActivated } = this.props;

    if (set) {
      for (let i = 0; i < setsDoc.sets.length; i += 1) {
        const s = setsDoc.sets[i];
        if (s !== set) {
          s.isActive = false;
        } else {
          s.isActive = true;
        }
      }
      set.isActive = true;
      this.forceUpdate();
      this.updateDbSets();
      onSetActivated(set);
    }
  }

  render() {
    const { setsDoc, set } = this.state;
    const { style, className } = this.props;
    return (
      <div style={{ ...wrapperStyle, ...style }} className={className}>
        <TweetCustomNav
          onSetCreated={this.onSetCreated}
          onSetSelected={this.onSetSelected}
          sets={setsDoc.sets}
          style={{ flex: 1 }}
        />
        <SetView
          style={{ flex: 5, paddingBottom: "20px" }}
          set={set}
          onChanged={this.onViewUpdated}
          onTitleChanged={this.onTitleChanged}
          onDeleteSetClicked={this.onDeleteSetClicked}
          onCloneSetClicked={this.onCloneSetClicked}
          onFileImported={this.onFileImported}
          onResetDefaultRequested={this.onResetDefaultRequested}
          onSetActivated={this.activateSet}
        />
      </div>
    );
  }
}

TweetCustomContent.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onSetActivated: PropTypes.func
};

TweetCustomContent.defaultProps = {
  style: null,
  className: "",
  onSetActivated: () => {}
};
