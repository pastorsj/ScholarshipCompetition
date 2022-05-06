(async () => {
  window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/datastore.portfolio.sampastoriza.com";
  // Fetch the data from AWS S3 and parse it
  const parsedData = await fetch(
    `${url}/visualization_data/contract_costs_2_time.csv`
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
          radius: 4,
          fillColor: "orange",
        },
      },
    },
    series: seriesData,
  });
})();
