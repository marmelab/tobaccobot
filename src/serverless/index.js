export default (event, context, callback) => {

    console.log({ event, context });

    const response = {
        statusCode: 200,
        headers: {
            'x-custom-header' : 'My Header Value'
        },
        body: JSON.stringify({ message: 'Hello World!' })
    };

    callback(null, response);
};
