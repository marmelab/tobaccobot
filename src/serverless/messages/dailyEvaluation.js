export const backOnTrack = () => (
`Great, you're back on track!
Keep up the good work.`
);

export const greatProgress = delta => (
`Great.
Wow, you've made great progress, it's ${Math.abs(delta)} less than yesterday.
Congratulations!`
);

export const bad = targetConsumption => (
`Ok, you're not on track, but it's not a big deal.
Perhaps you had an hard day?
The important thing is not to stop trying to quit.
You can do it, try smoking ${targetConsumption} cigarettes at most today!`
);

export const reallyBad = () => (
`if you really want to quit smoking, you must reduce your consumption right away.
In the meantime, how about some reading?
I recommend that you read this article about the diseases that can be caused by tobacco: http://www.lung.org/our-initiatives/tobacco/reports-resources/10-worst-diseases-smoking-causes.html`
);

export const reallyGood = () => (
`Thanks.
You're on track for the second day, keep up the good work!`
);

export const good = () => (
`Thanks.
We'll speak again tomorrow.`
);

export default (evaluation) => {
    if (evaluation.backFromBad) {
        return backOnTrack();
    }

    if (evaluation.delta <= -3) {
        return greatProgress(evaluation.delta);
    }

    if (evaluation.state === 'bad') {
        if (evaluation.combo === 1) {
            return bad(evaluation.targetConsumption);
        }

        return reallyBad();
    }

    if (evaluation.combo === 2) {
        return reallyGood();
    }

    return good();
};
