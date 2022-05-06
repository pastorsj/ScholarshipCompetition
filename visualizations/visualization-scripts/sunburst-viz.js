(async () => {
  window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/datastore.portfolio.sampastoriza.com";

  // Fetch data from AWS S3
  const parsedData = await fetch(
    `${url}/visualization_data/award_relationships.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);
  console.log("Parsed", parsedData);

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
  console.log("Data", data);

  // Chart the data
  //   Highcharts.setOptions(theme);
  Highcharts.setOptions({
    lang: {
      thousandsSep: ",",
    },
  });
  Highcharts.chart("sunburst-container", {
    chart: {
      height: "700px",
    },
    // Let the center circle be transparent
    colors: ["transparent"].concat(Highcharts.getOptions().colors),
    title: {
      text: "Contract and Subcontract Information",
    },
    subtitle: {
      text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
    },
    subtitle: {
      text: "Source: ",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
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