import * as d3 from 'd3';
import fetch from 'isomorphic-fetch';

const consumptionHistory = [
    40,
    30, 38, 36, 34, 34, 32, 30,
    28, 26, 24, 22, 20, 22, 20,
    18, 16, 16, 14, 12, 8, 10,
    8, 6, 4, 2, 0, 0, 0,
];

const targetConsumptionHistory = [30, 20, 10, 0];

function renderXaxis(svg, xScale, height, margin) {
    svg.append('g')
    .attr('transform', `translate(${margin}, ${height - margin})`)
    .call(d3.axisBottom(xScale).tickFormat(v => `d${v}`).tickValues([0, 7, 14, 21, 28]))
    .style('font-size', '24px');
}

function renderYAxis(svg, yScale, margin) {
    svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`)
    .call(d3.axisLeft(yScale))
    .style('font-size', '24px');
}

function renderTargetGraph(svg, xScale, yScale, height, margin) {
    const targetLine = d3
    .line()
    .curve(d3.curveStepAfter)
    .x((d, i) => margin + xScale(i * 7))
    .y(d => margin + yScale(d));

    const targetArea = d3
    .area()
    .curve(d3.curveStepAfter)
    .x((d, i) => margin + xScale(i * 7))
    .y(d => margin + yScale(d))
    .y0(height - margin)
    .y1(d => yScale(d) + margin);

    svg.append('path')
    .datum(targetConsumptionHistory)
    .attr('d', targetArea)
    .attr('fill', '#aaffaa');

    svg.append('path')
    .datum(targetConsumptionHistory)
    .style('stroke', 'black')
    .attr('d', targetLine)
    .attr('fill', 'none');
}

function rendetConsumptionGraph(svg, xScale, yScale, margin) {
    const consumptionLine = d3
    .line()
    .x((d, i) => margin + xScale(i))
    .y(d => margin + yScale(d));

    svg
    .append('path')
    .datum(consumptionHistory)
    .attr('d', consumptionLine)
    .style('stroke', 'black')
    .attr('fill', 'none');

    svg
    .append('g')
    .selectAll('circle')
    .data(consumptionHistory)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', (_, cx) => margin + xScale(cx))
    .attr('cy', cy => margin + yScale(cy));
}

function render() {
    d3.select('svg').remove();
    const height = parseInt(d3.select('#report').style('height'), 10);
    const width = parseInt(d3.select('#report').style('width'), 10);
    const margin = 40;

    const y = d3.scaleLinear()
    .range([height - (margin * 2), 0])
    .domain([0, d3.max(consumptionHistory)]);

    const x = d3.scaleLinear()
    .range([0, width - (margin * 2)])
    .domain([0, targetConsumptionHistory.length * 7]);

    const svg = d3.select('#report')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    renderTargetGraph(svg, x, y, height, margin);
    rendetConsumptionGraph(svg, x, y, margin);
    renderXaxis(svg, x, height, margin);

    renderYAxis(svg, y, margin);
}

d3.select(window).on('resize', render);

render();
