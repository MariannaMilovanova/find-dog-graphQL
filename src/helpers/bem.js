import block from 'bem-cn';
import { isEmpty, isString, isArray, uniq } from 'lodash';

block.setup({
  el: '__',
  mod: '--',
  modValue: ''
});

export const createBlock = parentClass => {
  return block(parentClass);
};

export const helper = (bemBlock, element = '', modifier = '') => {
  const hasElement = isString(element) && !isEmpty(element);
  const isFewMods = isArray(modifier) && !isEmpty(modifier);
  const hasModifier = (isString(modifier) && !isEmpty(modifier)) || isFewMods;
  if (!hasElement && !hasModifier) {
    return bemBlock();
  }
  if (hasModifier && !isFewMods) {
    return bemBlock(hasElement ? element : null, { ['']: modifier });
  }

  if (hasModifier && isFewMods) {
    return uniq(
      modifier
        .map(mod =>
          bemBlock(hasElement ? element : null, { ['']: mod }).toString()
        )
        .join(' ')
        .split(' ')
    ).join(' ');
  }
  return bemBlock(element);
};

export const b = (bemBlock, element = '', modifier = '') =>
  helper(bemBlock, element, modifier).toString();
