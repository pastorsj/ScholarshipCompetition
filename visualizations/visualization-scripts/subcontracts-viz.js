(async () => {
  // window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/sjp114";
  // Fetch the data from AWS S3 and parse it
  const parsedData = await fetch(
    `${url}/visualization_data/contract_costs_2_time.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  const parsedContractsData = await fetch(
    `${url}/visualization_data/contract_info.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  // Parse data
  const seriesData = [
    {
      name: "Subcontracts",
      data: parsedData
        .map((datum) => ({
          name: new Date(datum.subaward_action_date),
          y: parseInt(datum.total_cost),
        }))
        .map((datum) => {
          datum.name = Date.UTC(
            datum.name.getUTCFullYear(),
            datum.name.getUTCMonth(),
            datum.name.getUTCDate()
          );
          return datum;
        })
        .map((datum) => [datum.name, datum.y]),
    },
  ];
  const dateMap = {};
  seriesData[0].data.forEach((res, i) => {
    dateMap[res[0]] = {
      date: parsedData[i].subaward_action_date,
    };
  });

  const allContractsMap = parsedContractsData.reduce((resultingMap, next) => {
    if (resultingMap[next.subaward_action_date]) {
      if (
        resultingMap[next.subaward_action_date].some(
          (datum) => datum.name === next.subawardee_name
        )
      ) {
        const series = resultingMap[next.subaward_action_date].find(
          (datum) => datum.name === next.subawardee_name
        );
        series.data.push({
          name: next.subaward_description,
          value: parseInt(next.subaward_amount),
        });
      } else {
        resultingMap[next.subaward_action_date].push({
          name: next.subawardee_name,
          data: [
            {
              name: next.subaward_description,
              value: parseInt(next.subaward_amount),
            },
          ],
        });
      }
    } else {
      resultingMap[next.subaward_action_date] = [
        {
          name: next.subawardee_name,
          data: [
            {
              name: next.subaward_description,
              value: parseInt(next.subaward_amount),
            },
          ],
        },
      ];
    }
    return resultingMap;
  }, {});

  // Create a line chart
  let subcontractBubbleChart;
  Highcharts.setOptions(personalTheme);
  const subcontractChart = Highcharts.chart("subcontracts-container", {
    chart: {
      zoomType: "x",
      type: "area",
      height: "500px",
    },
    title: {
      text: "Subcontract Spending (2016-2021)",
    },
    subtitle: {
      text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
    },
    yAxis: {
      title: {
        text: "Size of Subcontract ($)",
      },
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date of Subcontract",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        point: {
          events: {
            select: function () {
              const selectedDate = dateMap[this.x].date;
              Highcharts.setOptions(personalTheme);
              if (subcontractBubbleChart) {
                subcontractBubbleChart = subcontractBubbleChart.destroy();
              }
              subcontractBubbleChart = Highcharts.chart(
                "subcontracts-bubble-container",
                {
                  colors: ["#D138BF", "#CF5C36", "#44CCFF", "#21D19F"],
                  chart: {
                    type: "packedbubble",
                    height: "500px",
                  },
                  title: {
                    text: `Subcontracts awarded on ${new Date(
                      selectedDate
                    ).toLocaleDateString("en-US")}`,
                  },
                  subtitle: {
                    text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
                  },
                  tooltip: {
                    useHTML: true,
                    pointFormat: `<div style="width: 300px; white-space: pre-wrap;"><b>Description of Subcontract:</b> {point.name}</div><hr />
                      <div style="width: 300px; white-space: pre-wrap;"><b>Cost:</b> \${point.value}</div>`,
                  },
                  plotOptions: {
                    packedbubble: {
                      minSize: "20%",
                      maxSize: "90%",
                      zMin: 0,
                      zMax: 150000000,
                      layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: 0.02,
                      },
                      dataLabels: {
                        enabled: true,
                        format: "{point.name}",
                        style: {
                          color: "black",
                          textOutline: "none",
                          fontWeight: "normal",
                        },
                      },
                    },
                  },
                  series: allContractsMap[selectedDate],
                }
              );
            },
          },
        },
      },
      area: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 4,
          fillColor: "orange",
        },
      },
    },
    series: seriesData,
  });
})();
