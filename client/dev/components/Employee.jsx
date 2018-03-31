import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Container, Grid } from 'semantic-ui-react';

import styles from '../styles/styles.css';

const Employee = ({
  data, removeEmployee, id, toEmployeeCalendar,
}) => (
  <Container style={{ margin: '1px' }}>
    <Button.Group fluid>
      <Button
        style={{ width: '80%' }}
        color="blue"
        onClick={() => toEmployeeCalendar(id)}
      >
        {data.name}
      </Button>
      <Button
        style={{ width: '20%' }}
        onClick={() => removeEmployee(id)}
        icon="user delete"
      />
    </Button.Group>
  </Container>
);

Employee.propTypes = {
  data: PropTypes.object.isRequired,
  removeEmployee: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  toEmployeeCalendar: PropTypes.func.isRequired,
};

export default Employee;
