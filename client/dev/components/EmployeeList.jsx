import React from 'react';
import PropTypes from 'prop-types';

import Employee from './Employee';

export default class EmployeeList extends React.Component {
  constructor(props) {
    super(props);

    EmployeeList.propTypes = {
      employees: PropTypes.object.isRequired,
      removeEmployee: PropTypes.func.isRequired,
      addEmployee: PropTypes.func.isRequired,
      toEmployeeCalendar: PropTypes.func.isRequired,
    };

    this.state = {
      name: '',
    };
    this.nameChange = this.nameChange.bind(this);
  }

  nameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  render() {
    const {
      employees, removeEmployee, addEmployee, toEmployeeCalendar,
    } = this.props;
    const emps = [];
    Object.keys(employees).sort((a, b) => employees[a].name > employees[b].name).forEach((e) => {
      emps.push(<Employee
        id={Number(e)}
        data={employees[e]}
        removeEmployee={removeEmployee}
        toEmployeeCalendar={toEmployeeCalendar}
      />);
    });

    return (
      <div>
        {emps}
        <div>
          Employee Name:
          <input value={this.state.name} onChange={this.nameChange} type="text" id="nameInput" />
          <button
            onClick={() => addEmployee(this.state.name)}
          >
            Add Employee
          </button>
        </div>
      </div>
    );
  }
}
