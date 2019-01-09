import React, { Component } from 'react';
import MapComponent from '../Map/Map';
import Login from '../Login/Login';
import UserData from '../Login/UserData';
import Header from './Header';
import PetForm from '../PetForm/PetForm';
import PetInfo from '../PetInfo/PetInfo';
import {
  userLogin,
  userLogout,
  addTempMarker,
  getSavedMarkers,
  selectMarker,
  deleteMarker,
  filterMarkers,
  clearAllFilters,
  selectRadius
} from '../../actions';
import { isEmpty, get, isString } from 'lodash';
import { connect } from 'react-redux';
import { b, createBlock } from '../../helpers/bem';
import Placeholder from '../Placeholder/Placeholder';
import Filter from '../Filters/Filter';
import './HomePage.css';

const block = createBlock('Home');

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      startReport: false,
      temp: false,
      selected: false
    };
  }
  componentDidMount() {
    let userId = localStorage.getItem('active');
    if (localStorage.getItem('active')) {
      let user = JSON.parse(localStorage.getItem(userId));
      this.props.userLogin(user);
    }
    const savedMarkers = JSON.parse(localStorage.getItem('markers')) || {};
    this.props.getSavedMarkers(savedMarkers);
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      temp: nextProps.temp,
      selected: nextProps.selected
    };
  }

  renderRightBlock = () => {
    const { startReport, temp, selected, editMode } = this.state;
    const { deleteMarker } = this.props;

    if (startReport || !isEmpty(temp) || editMode) {
      return (
        <PetForm
          selected={selected}
          editMode={editMode}
          finishEditMode={() =>
            this.setState({ editMode: false, temp: false, startReport: false })
          }
        />
      );
    }
    if (selected && !isEmpty(selected)) {
      return (
        <PetInfo
          deleteMarker={deleteMarker}
          selected={selected}
          goToEditMode={() => this.setState({ editMode: true, temp: false })}
        />
      );
    }
    return (
      <Placeholder startReport={() => this.setState({ startReport: true })} />
    );
  };

  render() {
    const {
      addTempMarker,
      markers,
      selectMarker,
      filterMarkers,
      clearAllFilters,
      selectRadius
    } = this.props;

    return (
      <div className={b(block)}>
        <div className={b(block, 'header')}>
          <Header />
          <div className={b(block, 'user')}>
            <UserData user={this.props.user} />
            <Login
              userLogin={this.props.userLogin}
              user={this.props.user}
              userLogout={this.props.userLogout}
            />
          </div>
        </div>
        <div className={b(block, 'map-with-form')}>
          <div className={b(block, 'map')}>
            <Filter
              selectRadius={selectRadius}
              filterMarkers={filterMarkers}
              filters={get(markers, 'filters', {})}
              clearAllFilters={clearAllFilters}
              radius={get(this, 'props.radius', false)}
            />
            {isString(get(this, 'props.markers.filtered', false)) && (
              <div className={b(block, 'no-result')}>No Result Was Found</div>
            )}
            <MapComponent
              filterMarkers={filterMarkers}
              radius={get(this, 'props.radius', false)}
              addTempMarker={addTempMarker}
              markers={markers}
              selectMarker={selectMarker}
            />
          </div>
          {this.renderRightBlock()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    markers: state.markers,
    selected: state.markers.selected,
    temp: state.markers.temp,
    radius: state.radius
  };
};

const mapDispatchToProps = {
  userLogin,
  userLogout,
  addTempMarker,
  getSavedMarkers,
  selectMarker,
  deleteMarker,
  filterMarkers,
  clearAllFilters,
  selectRadius
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
