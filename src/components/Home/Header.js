import React from 'react';
import { b, createBlock } from '../../helpers/bem';

const block = createBlock('Header');

let Header = () => {
  return (
    <div className={b(block)}>
      <div className={b(block, 'welcome')}>Sirko Search</div>
    </div>
  );
};
export default Header;
