(async () => {
  window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/datastore.portfolio.sampastoriza.com";
  // Fetch the data from AWS S3 and parse it
  const parsedData = await fetch(
    `${url}/visualization_data/contract_costs_time.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  // Parse data
  const seriesData = [
    {
      name: "Subcontracts",
      data: parsedData.map((datum) => ({
        name: datum.subaward_action_date,
        y: parseInt(datum.total_cost),
      })),
    },
  ];

  console.log("Series Data", seriesData);

  // Create a line chart
  //   Highcharts.setOptions(theme);
  Highcharts.setOptions({
    lang: {
      thousandsSep: ",",
    },
  });
  Highcharts.chart("subcontracts-container", {
    chart: {
      zoomType: "x",
      type: "area",
    },
    title: {
      text: "Subcontracts over time",
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
      accessibility: {
        rangeDescription: "Range: 2016 to 2019",
      },
      labels: {
        enabled: true,
        formatter: function () {
          // Format the axis tick labels using each month
          //   return seriesData[0].data[this.value].name;
          console.log("Value", this.value);
          console.log("This", this);
          return this.value;
        },
      },
      title: {
        text: "Date of Subcontract",
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    plotOptions: {
      area: {
        marker: {
          enabled: true,
          symbol: "circle",
          radius: 2,
        },
      },
    },
    series: seriesData,
  });
})();
