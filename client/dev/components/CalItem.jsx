import React from 'react';
import styles from '../styles/styles.css';

const CalItem = ({data, removeCalItem, id}) => (
  <div className={styles.manageList}>
    <span style={{ fontWeight: '600' }}>Name: <span style={{ fontWeight: '400' }}>{data.name}</span></span>
    <button
      className={styles.removeButton}
      onClick={() => removeCalItem(id)}
    >
      x
    </button>
  </div>
);

export default CalItem;
