const dataObj = {};
const dataArray = [];
const valuesArray = [];
const population = {};
const percentArray = [];

async function getData() {
  await d3.csv('./data.csv', data => {
    if (dataObj[data.County]) {
      dataObj[data.County] += Number(data.Total);
    } else {
      dataObj[data.County] = Number(data.Total);
    }
  });

  await d3.csv('./population.csv', data => {
    population[data.County] = Number(data.Population);
  });

  Object.keys(dataObj).forEach(key => {
    valuesArray.push(dataObj[key]);
    console.log(population[key]);
    percentArray.push(Number(dataObj[key]) / (Number(population[key]) / 10000));
    dataArray.push({ county: key, total: Number(dataObj[key]), population: population[key] });
  });

  colorTotal();
  colorPopulation();
}

function colorTotal() {
  const color = d3
    .scaleLinear()
    .domain([d3.min(valuesArray), d3.mean(valuesArray), d3.max(valuesArray)])
    .range(['green', 'yellow', 'red']);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip');

  dataArray.forEach(element => {
    d3.select(`.total-map #${element.county}`)
      .style('fill', color(element.total))
      .on('mouseover', () =>
        tooltip.style('display', 'block').html(
          `<p><strong>${element.county} County</strong></p>
          <p>${element.total} Crime(s)</p>`,
        ),
      )
      .on('mousemove', () => tooltip.style('top', `${d3.event.pageY + 10}px`).style('left', `${d3.event.pageX + 20}px`))
      .on('mouseout', () => tooltip.style('display', 'none'));
  });
}

function colorPopulation() {
  console.log(percentArray);
  const color = d3
    .scaleLinear()
    .domain([d3.min(percentArray), d3.mean(percentArray), d3.max(percentArray)])
    .range(['green', 'yellow', 'red']);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip');

  dataArray.forEach(element => {
    d3.select(`.population-map #${element.county}`)
      .style('fill', color(element.total / (element.population / 10000)))
      .on('mouseover', () =>
        tooltip.style('display', 'block').html(
          `<p><strong>${element.county} County</strong></p>
          <p>${(element.total / (element.population / 10000)).toFixed(2)} Crime(s) </p>`,
        ),
      )
      .on('mousemove', () => tooltip.style('top', `${d3.event.pageY + 10}px`).style('left', `${d3.event.pageX + 20}px`))
      .on('mouseout', () => tooltip.style('display', 'none'));
  });
}

getData();
