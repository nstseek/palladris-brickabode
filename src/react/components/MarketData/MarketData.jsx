import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SelectList from '../SelectList/SelectList.jsx';
import Select from '../../components/Select/Select.jsx';
import Input from '../../components/Input/Input.jsx';
import getRandomData from '../../utils/randomData';
import providers from '../../data/providers';
import Chart from 'chart.js';
import './MarketData.scss';
import moment from 'moment';

const chartResolution = 7;

const MarketData = () => {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [providerChartData, setProviderChartData] = useState([]);
  const [startDate, setStartDate] = useState('2021-03-25T22:00');
  const [endDate, setEndDate] = useState('2021-03-26T04:00');
  const chartRef = useRef(null);

  useEffect(() => {
    const newChartData = selectedProviders.map(({ key, color }) => {
      const data = [];
      for (let i = 0; i < chartResolution; i++) {
        data.push(getRandomData());
      }
      return {
        label: key,
        backgroundColor: color,
        borderColor: color,
        data,
        fill: false
      };
    });
    setProviderChartData(newChartData);
  }, [selectedProviders, startDate, endDate]);

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const start = moment(startDate);
    const end = moment(endDate);
    const secDiff = end.diff(start, 'seconds');
    const stepSize = secDiff / 7;
    const steps = [];
    for (let i = 0; i < chartResolution; i++) {
      steps.push(moment(start).add(stepSize * (i + 1), 'seconds'));
    }
    const config = {
      type: 'line',
      data: {
        labels: steps.map((mnt) => mnt.format('DD/MM/yyyy hh:mm')),
        datasets: [...providerChartData]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          fontColor: 'white',
          fontSize: 25,
          text: 'Price vs Time'
        },
        legend: {
          labels: {
            fontColor: 'white'
          }
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                color: '#4b779c',
                zeroLineColor: '#fff'
              },
              ticks: {
                fontColor: 'white'
              },
              scaleLabel: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                color: '#4b779c',
                zeroLineColor: '#fff'
              },
              ticks: {
                fontColor: 'white'
              },
              scaleLabel: {
                display: false
              }
            }
          ]
        }
      }
    };
    const ctx = document.getElementById('chart').getContext('2d');
    chartRef.current = new Chart(ctx, config);
  }, [providerChartData]);

  return (
    <div className='MarketData'>
      <div className='parameters'>
        <SelectList
          label='provider'
          id='provider'
          options={providers}
          selected={selectedProviders}
          update={setSelectedProviders}
        />
        <Select
          label='pair'
          id='pair'
          options={[{ key: 'EUR/GBP', value: 1 }]}
        />
        <Input
          label='start'
          id='start'
          type='datetime-local'
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <Input
          label='end'
          id='end'
          type='datetime-local'
          value={endDate}
          onChange={(event) => {
            if (moment(event.target.value) < moment(startDate)) {
              alert('The end date must be greater than start date');
              return;
            }
            setEndDate(event.target.value);
          }}
        />
      </div>
      <canvas id='chart' width='400' height='250'></canvas>
    </div>
  );
};

export default MarketData;
