import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/styles.css';

const CalItem = ({ data, removeCalItem, id }) => (
  <div className={styles.manageList}>
    <span style={{ fontWeight: '600' }}>Name: <span style={{ fontWeight: '400' }}>{data.name}</span></span>
    <button
      className={styles.removeButton}
      onClick={() => removeCalItem(id)}
    >
      X
    </button>
  </div>
);

CalItem.propTypes = {
  data: PropTypes.object.isRequired,
  removeCalItem: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default CalItem;
