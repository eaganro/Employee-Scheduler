import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Container } from 'semantic-ui-react';

import styles from '../styles/styles.scss';

const Time = ({ data, removeTime, id }) => (
  <Container style={{ margin: '1px' }}>
    <Button.Group fluid>
      <Button
        style={{ width: '80%' }}
        color="vk"
        disabled
        onClick={() => toEmployeeCalendar(id)}
      >
        <span style={{ fontWeight: '600' }}>
          Shift:<span style={{ fontWeight: '400' }}>{data.tStart}-{data.tEnd}</span>
        </span>
        <br />
        {data.bEnd === 8 && data.bStart === 8 ?
          '' :
          <span style={{ fontWeight: '600' }}>
            Break 1:<span style={{ fontWeight: '400' }}>{data.bStart}-{data.bEnd} </span>
          </span>
        }
        <br />
        {data.bEnd2 === 8 && data.bStart2 === 8 ?
          '' :
          <span style={{ fontWeight: '600' }}>
            Break 2:<span style={{ fontWeight: '400' }}>{data.bStart2}-{data.bEnd2}</span>
          </span>
        }
      </Button>
      <Button
        style={{ width: '20%' }}
        color="red"
        onClick={() => removeTime(id)}
        icon="delete"
      />
    </Button.Group>
  </Container>
);

Time.propTypes = {
  data: PropTypes.object.isRequired,
  removeTime: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default Time;
