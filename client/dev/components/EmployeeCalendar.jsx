import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

import CalenderRow from './CalendarRow';

const EmployeeCalendar = ({
  employeeId, employeeData, times, changeET, removeShift, weekNum, admin,
}) => {
  EmployeeCalendar.propTypes = {
    employeeId: PropTypes.number.isRequired,
    employeeData: PropTypes.object.isRequired,
    times: PropTypes.object.isRequired,
    changeET: PropTypes.func.isRequired,
    removeShift: PropTypes.func.isRequired,
    weekNum: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
  };
  console.log(employeeData);
  return (
    <div style={{ height: '80vh', margin: '20px' }}>
      <Header as="h3">
        {employeeData.name}
      </Header>
      {[...Array(7)].map((e, i) => (
        <CalenderRow
          key={i}
          id={employeeId}
          data={employeeData}
          times={times}
          changeTime={changeET}
          dayNum={i}
          weekNum={weekNum}
          removeShift={removeShift}
          admin={admin}
          employeePage
        />
      ))}
    </div>
  );
};

export default EmployeeCalendar;
