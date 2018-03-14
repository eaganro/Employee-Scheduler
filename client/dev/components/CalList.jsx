import React from 'react';
import CalItem from './CalItem.jsx';

export default class CalList extends React.Component {
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
    const { calItems } = this.props;
    const cals = [];
    Object.keys(calItems).forEach((e) => {
      emps.push(<CalItems
        id={e}
        data={calItems[e]}
        removeCalItem={this.props.removeCalItem}
      />);
    });
    console.log(cals);

    return (
      <div>
        {cals}
        <div>
          Calendar Name:
          <input value={this.state.name} onChange={this.nameChange} type="text" id="nameInput" />
          <button
            onClick={() => this.props.addCalItem(this.state.name)}
          >
            Add Calendar
          </button>
        </div>
      </div>
    );
  }
}
