import * as d3 from 'd3';
import fetch from 'isomorphic-fetch';
import { reportUrl } from 'config';

const weeks = [0, 7, 14, 21, 28];
const errorMsg = document.getElementById('error');
const invalidMsg = document.getElementById('invalid');

const getParams = (query) => {
    if (!query) return {};

    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            const [key, value] = param.split('=');
            return {
                ...params,
                [key]: value ? decodeURIComponent(value) : '',
            };
        }, {});
};

function renderXaxis(svg, xScale, height, margin) {
    svg.append('g')
    .attr('transform', `translate(${margin}, ${height - margin})`)
    .call(d3.axisBottom(xScale).tickFormat(v => `d${v}`).tickValues(weeks))
    .style('font-size', '24px');
}

function renderYAxis(svg, yScale, margin) {
    svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`)
    .call(d3.axisLeft(yScale))
    .style('font-size', '24px');
}

function renderTargetGraph(svg, xScale, yScale, height, margin) {
    return function (targetConsumptionHistory) {
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
    };
}

function rendetConsumptionGraph(svg, xScale, yScale, margin) {
    return function (consumptionHistory) {
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
    };
}

function render(consumptionHistory, targetConsumptionHistory) {
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

    renderTargetGraph(svg, x, y, height, margin)(targetConsumptionHistory);
    rendetConsumptionGraph(svg, x, y, margin)(consumptionHistory);
    renderXaxis(svg, x, height, margin);

    renderYAxis(svg, y, margin);
}

if (window.location.search && window.location.search.length > 0) {
    const { phone } = getParams(window.location.search.substr(1));

    fetch(reportUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
            phone,
        }),
    })
    .then(response => response.json())
    .then((response) => {
        if (response.statusCode !== 200) {
            const error = Error(response.body.message);
            error.code = response.body.code;
            throw error;
        }
        return response.body;
    })
    .then(({ consumptionHistory, targetConsumptionHistory }) => {
        d3.select(window).on('resize', () => render(consumptionHistory, targetConsumptionHistory));
        render(consumptionHistory, targetConsumptionHistory);
    })
    .catch((err) => {
        if (err.code === 'NotFound') {
            invalidMsg.classList.remove('hidden');
            return;
        }

        errorMsg.classList.remove('hidden');
    });
} else {
    invalidMsg.classList.remove('hidden');
}
