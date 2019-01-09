import { filter, isEmpty, get } from 'lodash';

export const applyFilters = (markers, filters) => {
  const foundOrLost = get(filters, 'foundOrLost', false);
  const species = get(filters, 'species', false);
  const breed = get(filters, 'breed', false);
  const radiusData = get(filters, 'radiusData', false);

  let newMarkers = [...markers];

  if (foundOrLost) {
    newMarkers = filter(newMarkers, { info: { foundOrLost } });
  }
  if (species) {
    newMarkers = filter(newMarkers, { info: { species } });
  }
  if (breed) {
    newMarkers = filter(newMarkers, { info: { breed } });
  }
  if (radiusData) {
    newMarkers = filter(newMarkers, item => {
      if(item.position) {
        return radiusData.contains(item.position)
      }
    });
  }
  if (isEmpty(newMarkers)) return 'No Result Was Found';

  return newMarkers;
};
