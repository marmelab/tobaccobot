import generatorToCPS from './utils/generatorToCPS';

export function* subscribe(event, context) {
    console.log({ event, context});

    return {
        statusCode: 200,
        headers: {
            'x-custom-header': 'My Header Value',
        },
        body: JSON.stringify({ message: 'result' }),
    };
}

export default generatorToCPS(subscribe);
