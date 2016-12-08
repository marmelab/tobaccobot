import * as d3 from 'd3';
import fetch from 'isomorphic-fetch';

const height = 600;
const width = 800;
const margin = 40;

const consumptionHistory = [
    30, 38, 36, 34, 34, 32, 30,
    28, 26, 24, 22, 20, 22, 20,
    18, 16, 16, 14, 12, 8, 10,
    8, 6, 4, 2, 0, 0, 0,
];

const targetConsumptionHistory = [30, 20, 10, 0];

const y = d3.scaleLinear()
.range([height - (margin * 2), 0])
.domain([0, d3.max(consumptionHistory)]);

const x = d3.scaleLinear()
.range([0, width - (margin * 2)])
.domain([1, targetConsumptionHistory.length * 7]);

const targetLine = d3
.line()
.curve(d3.curveStepAfter)
.x((d, i) => margin + x((i * 7) + 1))
.y(d => margin + y(d));

const targetArea = d3
.area()
.curve(d3.curveStepAfter)
.x((d, i) => margin + x((i * 7) + 1))
.y(d => margin + y(d))
.y0(height - margin)
.y1(d => y(d) + margin);

const svg = d3.select('#report')
.append('svg')
.attr('width', width)
.attr('height', height);

svg.append('path')
.datum(targetConsumptionHistory)
.attr('d', targetArea)
.attr('fill', '#aaffaa');

const targetGraph = svg.append('path')
.datum(targetConsumptionHistory)
.style('stroke', 'black')
.attr('d', targetLine)
.attr('fill', 'none');

const consumptionGraph = svg
.append('g')
.selectAll('circle')
.data(consumptionHistory)
.enter()
.append('circle')
.attr('r', 10)
.attr('cx', (_, cx) => margin + x(cx + 1))
.attr('cy', cy => margin + y(cy));

// Add the x Axis
svg.append('g')
.attr('transform', `translate(${margin}, ${height - margin})`)
.call(d3.axisBottom(x));

// text label for the x axis
svg.append('text')
.attr('transform', `translate(${width / 2}, ${height - 10})`)
.style('text-anchor', 'middle')
.text('Days');

// Add the y Axis
svg.append('g')
.attr('transform', `translate(${margin}, ${margin})`)
.call(d3.axisLeft(y));

svg.append('text')
.attr('transform', 'rotate(-90)')
.attr('y', 0)
.attr('x', 0 - (height / 2))
.attr('dy', '1em')
.style('text-anchor', 'middle')
.text('Cigarettes');
