import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/styles.css';

const Employee = ({
  data, removeEmployee, id, toEmployeeCalendar,
}) => (
  <div className={styles.manageList}>
    <span style={{ fontWeight: '600' }}>Name: <button onClick={() => toEmployeeCalendar(id)} style={{ fontWeight: '400' }}>{data.name}</button></span>
    <button
      className={styles.removeButton}
      onClick={() => removeEmployee(id)}
    >
      X
    </button>
  </div>
);

Employee.propTypes = {
  data: PropTypes.object.isRequired,
  removeEmployee: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  toEmployeeCalendar: PropTypes.func.isRequired,
};

export default Employee;
