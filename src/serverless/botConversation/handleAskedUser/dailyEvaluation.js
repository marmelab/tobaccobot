export const backFromBad = () => (
`Great, you're back on track!
Keep up the good work.`
);

export const backFromReallyBad = targetConsumption => (
`You made it!
You are back in the objective of ${targetConsumption} cigarettes per day for this week!
Keep quit smoking!
We'll check again tomorrow.`
);

export const backFromBadCombo = () => (
`WOW! You made it!
You are now back on good tracks!
Never quit smoking again, it is worth the effort, you'll see!
We'll speak again tomorrow.`
);

export const reallyBackOnTrack = targetConsumption => (
`You made it!
You are back in the objective of ${targetConsumption} cigarettes per day for this week!
Keep quit smoking!
We'll check again tomorrow.`
);

export const greatProgress = delta => (
`Great.
Wow, you've made great progress, it's ${Math.abs(delta)} less than yesterday.
Congratulations!`
);

export const continuedGreatProgress = delta => (
`WOW! You did it again! ${Math.abs(delta)} less than yesterday!
Congratulations!
I am already waiting for tomorrow to see if you continue on the same track!`
);

export const bad = targetConsumption => (
`Ok, you're not on track, but it's not a big deal.
Perhaps you had a hard day?
The important thing is not to stop trying to quit.
You can do it, try smoking ${targetConsumption} cigarettes at most today!`
);

export const reallyBad = () => (
`if you really want to quit smoking, you must reduce your consumption right away.
In the meantime, how about some reading?
I recommend that you read this article about the diseases that can be caused by tobacco:
http://www.lung.org/our-initiatives/tobacco/reports-resources/10-worst-diseases-smoking-causes.html`
);

export const badCombo = (combo, targetConsumption) => (
`It's been ${combo} days that you are over the objective of ${targetConsumption} cigarettes.
But you still can make it! Reduce your consumption today! Some new reading to help you quit smoking :
http://www.lung.org/our-initiatives/tobacco/reports-resources/sotc/by-the-numbers/10-health-effects-caused-by-smoking.html`
);

export const reallyGood = () => (
`Thanks.
You're on track for the second day, keep up the good work!`
);

export const goodCombo = combo => (
`Good job!
It's now ${combo} days that you're in the objective. En route for a successfull week!`
);

export const good = () => (
`Thanks.
We'll speak again tomorrow.`
);

export default (evaluation) => {
    if (evaluation.backFromBad === 1) {
        return backFromBad();
    }

    if (evaluation.backFromBad === 2) {
        return backFromReallyBad(evaluation.targetConsumption);
    }

    if (evaluation.backFromBad > 2) {
        return backFromBadCombo();
    }

    if (evaluation.delta.slice(-1)[0] <= -3) {
        if (evaluation.delta.length >= 2 && evaluation.delta.slice(-2)[0] <= -3) {
            return continuedGreatProgress(evaluation.delta.slice(-1)[0]);
        }
        return greatProgress(evaluation.delta);
    }


    if (evaluation.state === 'bad') {
        if (evaluation.combo === 2) {
            return reallyBad();
        }
        if (evaluation.combo > 2) {
            return badCombo(evaluation.combo, evaluation.targetConsumption);
        }

        return bad(evaluation.targetConsumption);
    }

    if (evaluation.combo === 2) {
        return reallyGood();
    }

    if (evaluation.combo > 2) {
        return goodCombo(evaluation.combo);
    }

    return good();
};
