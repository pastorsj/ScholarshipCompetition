(async () => {
  // window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/sjp114";

  // Fetch data from AWS S3
  const parsedData = await fetch(
    `${url}/visualization_data/award_relationships.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  // Create the series data for the chart
  const data = parsedData.map((datum) => {
    if (datum.final_layer === "FALSE") {
      return {
        parent: datum.parent,
        id: datum.id,
        name: datum.name,
      };
    }
    return {
      parent: datum.parent,
      id: datum.id,
      value: parseInt(datum.value),
      name: datum.name,
    };
  });

  // Chart the data
  Highcharts.setOptions(personalTheme);
  Highcharts.chart("sunburst-container", {
    chart: {
      height: "600px",
      width: 600,
    },
    // Let the center circle be transparent
    colors: ["transparent"].concat(Highcharts.getOptions().colors),
    title: {
      text: "Understanding the flow of contract funding",
    },
    subtitle: {
      text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
    },
    series: [
      {
        type: "sunburst",
        data: data,
        name: "Root",
        allowDrillToNode: true,
        cursor: "pointer",
        dataLabels: {
          format: "{point.name}",
          filter: {
            property: "innerArcLength",
            operator: ">",
            value: 16,
          },
          rotationMode: "circular",
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
            dataLabels: {
              filter: {
                property: "outerArcLength",
                operator: ">",
                value: 64,
              },
            },
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            colorVariation: {
              key: "brightness",
              to: -0.5,
            },
          },
          {
            level: 4,
            colorVariation: {
              key: "brightness",
              to: 0.5,
            },
          },
        ],
      },
    ],
    tooltip: {
      headerFormat: "",
      pointFormat:
        "<b>{point.name}</b><br/>Total cost of all subcontracts: $<b>{point.value}</b>",
    },
  });
})();
