import expect from 'expect';
import dynamoFormatToLiteral from './dynamoFormatToLiteral';

describe('dynamoDB', () => {
    describe('dynamoFormatToLiteral', () => {
        it('should convert dynamoFormat to literal', () => {
            expect(dynamoFormatToLiteral({
                person: {
                    M: {
                        name: {
                            S: 'john',
                        },
                        phone: {
                            S: '0698745210',
                        },
                    },
                },
            })).toEqual({ person: { name: 'john', phone: '0698745210' } });
        });

        it('should change nothing if already a literal', () => {
            expect(dynamoFormatToLiteral({
                name: 'john',
                phone: '0698745210',
            })).toEqual({ name: 'john', phone: '0698745210' });
        });

        it('should work with array', () => {
            expect(dynamoFormatToLiteral([
                { name: { S: 'john' } },
                { phone: { S: '0698745210' } },
            ])).toEqual([
                { name: 'john' },
                { phone: '0698745210' },
            ]);
        });
    });
});
