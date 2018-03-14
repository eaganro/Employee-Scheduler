import React from 'react';
import styles from '../styles/styles.css';

const Employee = ({data, removeEmployee, id}) => (
  <div className={styles.manageList}>
    <span style={{ fontWeight: '600' }}>Name: <span style={{ fontWeight: '400' }}>{data.name}</span></span>
    <button
      className={styles.removeButton}
      onClick={() => removeEmployee(id)}
    >
      X
    </button>
  </div>
);

export default Employee;
