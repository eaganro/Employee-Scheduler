import React from 'react';
import Employee from './Employee.jsx';

export default class EmployeeList extends React.Component {
  constructor(props) {
    super(props);
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
    const { employees } = this.props;
    const emps = [];
    Object.keys(employees).forEach((e) => {
      emps.push(<Employee
        id={e}
        data={employees[e]}
        removeEmployee={this.props.removeEmployee}
      />);
    });

    return (
      <div>
        {emps}
        <div>
          Employee Name:
          <input value={this.state.name} onChange={this.nameChange} type="text" id="nameInput" />
          <button
            onClick={() => this.props.addEmployee(this.state.name)}
          >
            Add Employee
          </button>
        </div>
      </div>
    );
  }
}
