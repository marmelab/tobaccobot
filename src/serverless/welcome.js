import smoker from './services/smoker';

const welcomeMsg = name => (
`Hi ${name}, and thanks for joining the tobaccobot program!
During the next 4 weeks, I'll text you every morning to ask about your cigarette consumption of the day before.
Just reply with the number and I'll do my best to help you quit smoking!
And to begin with, how many cigarettes did you smoke yesterday ?`
);

export default function* welcome(smokerData) {
    // @TODO use botkit consoleBot then slack/octopush
    console.log(welcomeMsg(smokerData.name));
    yield smoker.save({
        ...smokerData,
        status: 'welcomed',
    });
}
