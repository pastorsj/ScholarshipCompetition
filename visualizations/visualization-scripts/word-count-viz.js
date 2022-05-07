(async () => {
  window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/datastore.portfolio.sampastoriza.com";
  // Fetch the data from AWS S3 and parse it
  const parsedData = await fetch(`${url}/visualization_data/word_counts.csv`)
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  const data = parsedData.map((datum) => ({
    name: datum.number_of_words,
    y: parseInt(datum.value),
  }));

  Highcharts.setOptions(personalTheme);
  Highcharts.chart("word-count-container", {
    chart: {
      type: "column",
      height: "500px",
    },
    title: {
      text: "Distribution of the number of different types <br /> of items being supplied by subcontractors",
    },
    subtitle: {
      text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
    },
    xAxis: {
      categories: [
        "1 Type",
        "2 Types",
        "3 Types",
        "4 Types",
        "5 Types",
        "6 Types",
        "7 Types",
      ],
      title: {
        text: "Number of different types of items being supplied",
      },
    },
    yAxis: {
      title: {
        text: "Number of subcontractors",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        data: data,
      },
    ],
    tooltip: {
      useHTML: true,
      headerFormat: "",
      pointFormat: `<div><b>Number of Subcontractors:</b> {point.y}</div>`,
    },
  });
})();
