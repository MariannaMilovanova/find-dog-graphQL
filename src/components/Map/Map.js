import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import CustomCircle from './Circle';
import CustomMarker from './Marker';
import './Map.css';
import { get, map, uniqueId, noop, isEmpty, omit, isString } from 'lodash';
import PropTypes from 'prop-types';

class MapComponent extends Component {
  static defaultProps = {
    markers: {},
    selectMarker: noop,
    addTempMarker: noop,
    radius: false,
    filterMarkers: noop
  };

  static propTypes = {
    markers: PropTypes.object,
    selectMarker: PropTypes.func,
    addTempMarker: PropTypes.func,
    radius: PropTypes.any,
    filterMarkers: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      temp: {},
      defaultCenter: { lat: 50.45, lng: 30.52 },
      center: { lat: 50.45, lng: 30.52 }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.radius) {
      return {
        temp: nextProps.markers.temp
      };
    }
    return {
      temp: nextProps.markers.temp
    };
  }

  onMapClick = e => {
    const { addTempMarker } = this.props;
    const marker = {
      position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
      type: 'temp'
    };
    this.setState({
      temp: marker
    });
    addTempMarker(marker);
  };
  onCenterChanged = data => {
    const center = this.map.getCenter();
    let newCenter = {};
    newCenter.lat = center.lat();
    newCenter.lng = center.lng();
    this.setState({ center: newCenter });
  };

  render() {
    const { temp, center } = this.state;
    const { selectMarker, markers, radius, filterMarkers } = this.props;
    const filtered = get(this, 'props.markers.filtered', []);
    const markersToShow = isEmpty(filtered)
      ? omit(markers, ['temp', 'selected', 'filtered', 'filters'])
      : filtered;

    return (
      <div>
        <GoogleMap
          ref={el => (this.map = el)}
          defaultZoom={12}
          onClick={this.onMapClick}
          center={center}
          onCenterChanged={this.onCenterChanged}
        >
          {radius && (
            <CustomCircle
              filterMarkers={filterMarkers}
              center={center}
              radius={radius}
            />
          )}
          {!isEmpty(temp) && <CustomMarker marker={temp} />}
          {!isString(markersToShow) &&
            map(markersToShow, marker => (
              <CustomMarker
                marker={marker}
                key={get(marker, '_id', uniqueId('marker_'))}
                selectMarker={selectMarker}
              />
            ))}
        </GoogleMap>
      </div>
    );
  }
}

export default compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `70vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withGoogleMap
)(MapComponent);
