import React, { Component } from 'react';
import { b, createBlock } from '../../helpers/bem';
import PropTypes from 'prop-types';
import { Image, Icon } from 'semantic-ui-react';
import './PetInfo.css';
import { get, noop, map, omit } from 'lodash';

const block = createBlock('PetInfo');

const labels = {
  foundOrLost: 'Find or Lost',
  species: `Species`,
  breed: `Pet's breed`,
  age: `Pet's age`,
  color: `Pet's color`,
  phone: `Contact Phone`
};

export default class PetInfo extends Component {
  static defaultProps = {
    selected: {},
    goToEditMode: noop,
    deleteMarker: noop
  };

  static propTypes = {
    selected: PropTypes.object,
    goToEditMode: PropTypes.func,
    deleteMarker: PropTypes.func
  };

  editData = () => {
    const { selected, goToEditMode } = this.props;
    const selectedUserId = get(selected, 'userId', false);
    const userId = localStorage.getItem('active') || 'unknown';
    if (selectedUserId !== userId) {
      return alert(
        'Нou can not edit markers that ware created by other people'
      );
    }
    return goToEditMode();
  };
  render() {
    const { selected, deleteMarker } = this.props;
    const info = get(selected, 'info', {});

    return (
      <div className={b(block)}>
        <div className={b(block, 'picture')}>
          {selected.url ? (
            <div>
              <Image src={selected.url} avatar size="small" alt={'picture'} />
            </div>
          ) : (
            <Icon name="paw" size="massive" color="brown" />
          )}
        </div>
        <div className={b(block, 'info')}>
          {map(omit(info, 'url'), (value, key) => (
            <div className={b(block, 'info-item')} key={key}>
              <div className={b(block, 'label')}>{labels[key] || ''}:</div>
              <div className={b(block, 'value')}>{value || ''}</div>
            </div>
          ))}
        </div>
        <div className={b(block, 'edit')}>
          <div className={b(block, 'edit-btn')} onClick={this.editData}>
            edit
          </div>
        </div>
        <div className={b(block, 'edit')}>
          <div
            className={b(block, 'solved')}
            onClick={() => deleteMarker(selected._id)}
          >
            owner/pet was found
          </div>
        </div>
      </div>
    );
  }
}
