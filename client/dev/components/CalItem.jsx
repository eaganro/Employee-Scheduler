import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Container } from 'semantic-ui-react';

import styles from '../styles/styles.css';

const CalItem = ({
  data, removeCalItem, id, toCalendar,
}) => (
  <Container style={{ margin: '1px' }}>
    <Button.Group fluid>
      <Button
        style={{ width: '80%' }}
        color="teal"
        onClick={() => toCalendar(id)}
      >
        {data.name}
      </Button>
      <Button
        style={{ width: '20%' }}
        color="red"
        onClick={() => removeCalItem(id)}
        icon="delete calendar"
      />
    </Button.Group>
  </Container>
);

CalItem.propTypes = {
  data: PropTypes.object.isRequired,
  removeCalItem: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  toCalendar: PropTypes.func.isRequired,
};

export default CalItem;
