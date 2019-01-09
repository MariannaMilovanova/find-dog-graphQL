import React, { Component } from 'react';
import { Circle } from 'react-google-maps';
import { get, noop } from 'lodash';

class CustomCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: get(this, 'props.radius'),
      center: get(this, 'props.center', {})
    };
  }
  componentDidMount() {
    this.getBoundsToFilter();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.radius !== prevState.radius) {
      return {
        radius: nextProps.radius,
        center: nextProps.center
      }
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    if(this.state.radius !== prevProps.radius) {
      this.getBoundsToFilter();
    }
  }
  getBoundsToFilter = () => {
    const filterMarkers = get(this, 'props.filterMarkers', noop);
    return filterMarkers('radiusData', this.circle.getBounds());
  };

  render() {
    const { radius, center } = this.state;

    return (
      <Circle
        onCenterChanged={() => this.setState({ center })}
        ref={el => (this.circle = el)}
        center={center}
        radius={radius}
        options={{
          fillColor: '#20e52d',
          strokeColor: '#20e52d',
          strokeWeight: '1',
          strokeOpacity: '0.5'
        }}
      />
    );
  }
}

export default CustomCircle;
