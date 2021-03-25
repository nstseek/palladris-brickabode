import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SelectList from '../SelectList/SelectList.jsx';
import Select from '../../components/Select/Select.jsx';
import Input from '../../components/Input/Input.jsx';
import getRandomColor from '../../utils/randomColor';
import getRandomData from '../../utils/randomData';
import Chart from 'chart.js';
import './MarketData.scss';

const MarketData = () => {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [providerChartData, setProviderChartData] = useState([]);
  const chartRef = useRef(null);
  const providers = [
    { key: 'CBOE', value: 1 },
    { key: 'TSOU', value: 2 },
    { key: 'CHKS', value: 3 },
    { key: 'POTV', value: 4 },
    { key: 'QVZA', value: 5 }
  ];

  useEffect(() => {
    const newChartData = selectedProviders.map(({ key }) => {
      const color = getRandomColor();
      return {
        label: key,
        backgroundColor: color,
        borderColor: color,
        data: [
          getRandomData(),
          getRandomData(),
          getRandomData(),
          getRandomData(),
          getRandomData(),
          getRandomData(),
          getRandomData()
        ],
        fill: false
      };
    });
    setProviderChartData(newChartData);
  }, [selectedProviders]);

  useLayoutEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const config = {
      type: 'line',
      data: {
        labels: [
          '22:00:00',
          '23:00:00',
          '00:00:00',
          '01:00:00',
          '02:00:00',
          '03:00:00',
          '04:00:00'
        ],
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
          onChange={(event) => {
            if (
              selectedProviders.find(
                (provider) => provider.value === Number(event.target.value)
              )
            ) {
              return;
            }

            const provider = providers.find(
              (provider) => provider.value === Number(event.target.value)
            );

            if (provider) {
              setSelectedProviders([...selectedProviders, provider]);
            }
          }}
          onRemove={(value) => {
            const providerIndex = selectedProviders.findIndex(
              (provider) => provider.value === value
            );

            if (providerIndex >= 0) {
              const tmpSelectedProviders = [...selectedProviders];
              tmpSelectedProviders.splice(providerIndex, 1);
              setSelectedProviders(tmpSelectedProviders);
            }
          }}
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
          value='2021-03-25T22:00'
        />
        <Input
          label='end'
          id='end'
          type='datetime-local'
          value='2021-03-26T16:00'
        />
      </div>
      <canvas id='chart' width='400' height='250'></canvas>
    </div>
  );
};

export default MarketData;
