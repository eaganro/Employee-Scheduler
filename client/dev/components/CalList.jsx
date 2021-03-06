import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Container, Input, Segment } from 'semantic-ui-react';

import CalItem from './CalItem';

export default class CalList extends React.Component {
  constructor(props) {
    super(props);
    CalList.propTypes = {
      calendars: PropTypes.object.isRequired,
      removeCalItem: PropTypes.func.isRequired,
      addCalItem: PropTypes.func.isRequired,
      toCalendar: PropTypes.func.isRequired,
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
    const { calendars, removeCalItem, addCalItem, toCalendar } = this.props;
    const cals = [];
    Object.keys(calendars).sort((a, b) => calendars[a].name > calendars[b].name).forEach((c) => {
      cals.push(<CalItem
        id={Number(c)}
        data={calendars[c]}
        removeCalItem={removeCalItem}
        toCalendar={toCalendar}
        key={c}
      />);
    });
    console.log(cals);

    return (
      <Container>
        {cals}
        <Input
          fluid
          value={this.state.name}
          onChange={this.nameChange}
          icon="calendar plus"
          iconPosition="left"
          placeholder="Calendar Name..."
          action={<Button
            style={{ width: '20%' }}
            color="green"
            onClick={() => addCalItem(this.state.name)}
            content="Add"
          />}
        />
      </Container>
    );
  }
}
