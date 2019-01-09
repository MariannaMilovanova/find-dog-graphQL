import React, { Component } from 'react';
import { Marker } from 'react-google-maps';
import { get, noop } from 'lodash';
import temp from '../../assets/blue_marker.png';
import lost from '../../assets/red_marker.png';
import found from '../../assets/map-icon.png';
import PropTypes from 'prop-types';

const markerIcon = {
  temp,
  lost,
  found
};

class CustomMarker extends Component {
  static defaultProps = {
    marker: {},
    selectMarker: noop
  };

  static propTypes = {
    marker: PropTypes.object,
    selectMarker: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onToggleOpen = marker => {
    const { selectMarker } = this.props;
    selectMarker(marker);
  };

  render() {
    const { marker } = this.props;
    const type = get(this, 'props.marker.type', 'temp');

    return (
      <div className="marker">
        <Marker
          icon={markerIcon[type]}
          position={marker.position}
          onClick={() => this.onToggleOpen(marker)}
        />
      </div>
    );
  }
}

export default CustomMarker;
