import React from 'react';
import PropTypes from 'prop-types';

import styles from '../styles/styles.css';

const Time = ({ data, removeTime, id }) => (
  <div className={styles.manageList}>
    <span>
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
    </span>
    <button
      className={styles.removeButton}
      onClick={() => removeTime(id)}
    >
      X
    </button>
  </div>
);

Time.propTypes = {
  data: PropTypes.object.isRequired,
  removeTime: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default Time;
