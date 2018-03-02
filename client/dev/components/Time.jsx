import React from 'react';

const Time = ({data, removeTime, id}) => (
  <div style={{ border: '1px solid black' }}>
    <span>Start: {data.tStart}</span>
    <span>End: {data.tEnd}</span>
    <span>Break Start: {data.bStart}</span>
    <span>Break End: {data.bEnd}</span>
    <button onClick={() => removeTime(id)}>Remove</button>
  </div>
);

export default Time;
