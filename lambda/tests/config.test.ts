import { Config } from "../config"


describe('test Config', () => {
    let config: Config;
    beforeAll(() => {
        process.env.REGION = 'us-east-1'
        config = new Config().load();
    })

    test('test loading', () => {
        expect(config['awsRegion']).toBe('us-east-1')
    })
})