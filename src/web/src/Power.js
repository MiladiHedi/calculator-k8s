import React, { Component } from 'react';
import axios from 'axios';

class Power extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
    power: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get('/api/power/values/current');
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/power/values/all');
    this.setState({
      seenIndexes: seenIndexes.data
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    await axios.post('/api/power/values', {
      index: this.state.index,
      power: this.state.power
    });
    this.setState({ index: '' });
    this.setState({ power: '' });
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your number :</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <label>Enter your power :</label>
          <input
            value={this.state.power}
            onChange={event => this.setState({ power: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Power values already calculated:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Power values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Power;
