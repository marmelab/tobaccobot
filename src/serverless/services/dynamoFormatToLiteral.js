const dynamoFormatToLiteral = (dynamoData) => {
    if (typeof dynamoData !== 'object' && !Array.isArray(dynamoData)) {
        return dynamoData;
    }
    if (Array.isArray(dynamoData)) {
        return dynamoData.map(dynamoFormatToLiteral);
    }
    return Object.keys(dynamoData)
    .reduce((result, key) => {
        const data = dynamoData[key];
        if (key === 'S' || key === 'N' || key === 'B' || key === 'SS' || key === 'NS' || key === 'BS' || key === 'M' || key === 'L' || key === 'NULL' || key === 'BOOL') {
            return dynamoFormatToLiteral(data);
        }
        return {
            ...result,
            [key]: dynamoFormatToLiteral(data),
        };
    }, {});
};

export default dynamoFormatToLiteral;
