(async () => {
  // window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/sjp114";
  // Fetch the data from AWS S3 and parse it
  const parsedData = await fetch(
    `${url}/visualization_data/filtered_descriptions.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  const data = parsedData.map((datum) => ({
    name: datum.words,
    weight: parseInt(datum.freq),
  }));

  Highcharts.setOptions(personalTheme);
  Highcharts.chart("descriptions-wordcloud-container", {
    chart: {
      height: "500px",
    },
    plotOptions: {
      wordcloud: {
        minFontSize: 12,
        maxFontSize: 45,
      },
    },
    title: {
      text: "Wordcloud of Subcontract Descriptions",
    },
    subtitle: {
      text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
    },
    series: [
      {
        type: "wordcloud",
        data: data,
        spiral: "rectangular",
        name: "Occurrences",
      },
    ],
  });
})();
