import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  addPet,
  uploadImage,
  updateData,
  changePhoto,
  cancelAddingPet
} from '../../actions';
import { connect } from 'react-redux';
import { type, pets, breeds, age, color } from '../messages';
import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import { b, createBlock } from '../../helpers/bem';
import { Image, Icon } from 'semantic-ui-react';
import './PetForm.css';
import { get, noop, each, omit, keys, toLower } from 'lodash';

const block = createBlock('PetForm');

const FIELDS = {
  foundOrLost: 'whether pet was found or lost',
  species: `pet's species`,
  breed: `pet's breed`,
  age: `pet's age`,
  color: `pet's color`,
  phone: `Please enter your contact phone`,
  photo: ``
};

class PetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      species: get(this, 'props.selected.info.species', false),
      fileName: null,
      changeUpload: false
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextPrSpecies = get(nextProps, 'selected.info.species', false);
    if (nextPrSpecies) {
      return {
        species: nextPrSpecies
      }
    }
    return null;
  }

  upload = e => {
    const file = e.target.files[0];
    const size = file.size / 1024 / 1024;
    if (size > 2) {
      return alert('Size of file should not me more than 2MB');
    }
    const editMode = get(this, 'props.editMode', false);
    if (editMode) {
      this.setState({ fileName: file.name || '', changeUpload: true });
      return this.props.changePhoto(file);
    }
    this.setState({ fileName: file.name || '' });
    this.props.uploadImage(file);
  };

  renderField = (field, data, change) => {
    const { species, fileName } = this.state;
    const {
      meta: { touched, error }
    } = field;
    const className = `${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={b(block, 'dropdown')}>
        <label className={b(block, 'label')}>{field.label}</label>
        {(() => {
          switch (field.input.name) {
            case 'species':
              return (
                <DropdownList
                  {...field.input}
                  data={data}
                  onChange={value => {
                    this.setState({ species: value });
                    change('breed', '');
                    field.input.onChange(value);
                  }}
                />
              );
            case 'breed': {
              const breedToShow = species ? breeds[toLower(species)] : [];
              return (
                <DropdownList
                  {...field.input}
                  data={breedToShow}
                />
              );
            }
            case 'phone': {
              return (
                <input {...field.input} type='text' className={b(block, 'phone-input')} />
              );
            }
            case 'photo': {
              return (
                <div className={b(block, 'upload')}>
                  <label htmlFor="f02" className={b(block, 'upload-label')}>
                    {fileName || 'Add pet picture'}
                  </label>
                  <input
                    id="f02"
                    name="fileupload"
                    type="file"
                    onChange={this.upload}
                    className={b(block, 'photo-input')}
                  />
                </div>
              );
            }
            default:
              return (
                <DropdownList
                  {...field.input}
                  data={data}
                  onChange={value => {
                    field.input.onChange(value);
                  }}
                />
              );
          }
        })()}
        <div className={b(block, 'dropdown', className)}>
          {touched ? error : ''}
        </div>
      </div>
    );
  };
  onSubmit = values => {
    const lng = get(this, 'props.temp.position.lng', false);
    const editMode = get(this, 'props.editMode', false);
    const finishEditMode = get(this, 'props.finishEditMode', noop);
    const selected = get(this, 'props.selected', {});
    const { changeUpload } = this.state;

    if (!lng && !editMode && !changeUpload) {
      return alert(
        'Please click on map to put the marker where you find or lost pet'
      );
    }
    if (editMode) {
      this.props.updateData(values, selected._id);
      return finishEditMode();
    }
    this.props.addPet(values);
    finishEditMode();
  };
  onCancelClick = () => {
    const finishEditMode = get(this, 'props.finishEditMode', noop);
    const cancelAddingPet = get(this, 'props.cancelAddingPet', noop);
    cancelAddingPet();
    finishEditMode();
  };

  render() {
    const { handleSubmit, change } = this.props;
    const url =
      get(this, 'props.temp.url', false) ||
      get(this, 'props.selected.url', false);

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <div className={b(block, 'animal-picture')}>
          <Field
            label="Upload pet's photo"
            name="photo"
            component={field => this.renderField(field)}
          />
          <div className={b(block, 'picture')}>
            {url ? (
              <div>
                <Image src={url} avatar size="small" alt={'picture'} />
              </div>
            ) : (
              <Icon name="paw" size="huge" color="brown" />
            )}
          </div>
        </div>
        <Field
          label="Pet was found or lost"
          name="foundOrLost"
          component={field => this.renderField(field, type)}
        />
        <Field
          label="Select species"
          name="species"
          component={field => this.renderField(field, pets, change)}
        />
        <Field
          label="Select breed"
          name="breed"
          component={field => this.renderField(field)}
        />
        <Field
          label="Select pet's age"
          name="age"
          component={field => this.renderField(field, age)}
        />
        <Field
          label="Select pet's skin color"
          name="color"
          component={field => this.renderField(field, color)}
        />
        <Field
          label="Your mobile phone"
          name="phone"
          component={field => this.renderField(field)}
        />
        <div className={b(block, 'btns')}>
          <div className="btn btn-danger" onClick={this.onCancelClick}>
            Cancel
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  each(omit(FIELDS, 'photo'), (value, key) => {
    if (!values[key]) {
      if (key === 'phone') return (errors[key] = `${value}`);
      errors[key] = `Please select ${value}`;
    }
  });
  return errors;
};

const mapStateToProps = (state, ownProp) => {
  const info = get(ownProp, 'selected.info', false);

  if (info) {
    return {
      initialValues: {
        foundOrLost: info.foundOrLost,
        species: info.species,
        breed: info.breed,
        age: info.age,
        color: info.color,
        phone: info.phone
      },
      temp: state.markers.temp
    };
  }
  return { temp: state.markers.temp };
};

const NewPetForm = reduxForm(
  {
    validate,
    form: 'NewAnimal',
    fields: keys(FIELDS)
  },
  mapStateToProps
)(PetForm);

export default connect(
  mapStateToProps,
  { addPet, uploadImage, updateData, changePhoto, cancelAddingPet }
)(NewPetForm);
