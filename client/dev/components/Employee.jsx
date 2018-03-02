import React from 'react';

const Employee = ({data, removeEmployee, id}) => (
  <div style={{ border: '1px solid black' }}>
    <div>Name: {data.name}</div>
    <button onClick={() => removeEmployee(id)}>Remove</button>
  </div>
);

export default Employee;
