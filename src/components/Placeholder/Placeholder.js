import React, { Component } from 'react';
import { b, createBlock } from '../../helpers/bem';
import './Placeholder.css';
import { get, noop } from 'lodash';

const block = createBlock('Placeholder');

export default class Placeholder extends Component {
  render() {
    const startReport = get(this, 'props.startReport', noop);

    return (
      <div className={b(block)}>
        <div className={b(block, 'welcome')}>
          Welcome to our website! We are aimed to help people to find their lost
          pets! Here you can either report about finding someone pets or report
          about lost of your pet!
        </div>
        <div className={b(block, 'report')}>
          Markers on the map show where pets where found/lost. To see the
          details of found/lost pets please click on the marker.
        </div>
        <div className={b(block, 'report')}>
          To start your own report you can click on map where you find or lost
          pet or push the button below.
        </div>
        <div className={b(block, 'btn')} onClick={() => startReport()}>
          Start report
        </div>
      </div>
    );
  }
}
