import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Chart } from "react-google-charts";

import './styles.css';

export default class App extends React.Component {
  state = {date_time: [], t: []};

  componentDidMount() {
    axios.get('./dht22.json')
      .then((res) => this.setState({ 
        date_time: res.data[0].data.date_time,
        t: res.data[0].data.t,
       }))
      .catch(error => console.log(error));
  }

  filterEveryN (arr, n) {
    return arr.filter((e, i) => i % n === n - 1);
  }

  transformDateTime (timeData) {
    return timeData.map(time => moment(time).format("DD-MM HH:mm"));
  }

  getChartData(cols, data) {
    const chartData = [];

    if (cols.length === data.length) {
      chartData[0] = cols;

      if (data.length > 0) {
        this.filterEveryN(data[0], 50).forEach((item, index) => {
            chartData[index + 1] = [item, data[1][index]];
        }); 
      }
    }

    return chartData;
  }

  render() {
    const { date_time, t } = this.state;

    const chartData = this.getChartData(
      ['Date Time', 'Temperature'], 
      [this.transformDateTime(date_time), t]
    );

    return (
      <div id="chart">
        <Chart
          chartType="LineChart"
          data={chartData}
          width="100%"
          height="100%"
          loader={<div>Go Bitch</div>}
          options={{
            title: 'DHT22 Temperature Summer Distribution',
            legend: 'none',
            animation: {
              startup: true,
              easing: 'out',
              duration: 2000,
            },
            enableInteractivity: false,
          }}
        />
      </div>
    );
  }
}
