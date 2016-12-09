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

export const reallyBadLinks = [
    'http://www.lung.org/our-initiatives/tobacco/reports-resources/10-worst-diseases-smoking-causes.html',
    'http://www.lung.org/our-initiatives/tobacco/reports-resources/sotc/by-the-numbers/9-of-the-worst-diseases-you.html',
    'https://www.cdc.gov/tobacco/data_statistics/fact_sheets/health_effects/effects_cig_smoking/',
];

export const reallyBad = (link = reallyBadLinks[0]) => (
`if you really want to quit smoking, you must reduce your consumption right away.
In the meantime, how about some reading?
I recommend that you read this article about the diseases that can be caused by tobacco:
${link}`
);

export const badComboLinks = [
    'http://www.lung.org/our-initiatives/tobacco/reports-resources/sotc/by-the-numbers/10-health-effects-caused-by-smoking.html',
    'https://www.unitypoint.org/livewell/article.aspx?id=17ace3fc-fb01-45c3-8617-1beb81404fc4',
    'https://www.newscientist.com/article/dn19725-gross-disease-images-best-at-making-smokers-quit/',
];

export const badCombo = (combo, targetConsumption, link = badComboLinks[0]) => (
`It's been ${combo} days that you are over the objective of ${targetConsumption} cigarettes.
But you still can make it! Reduce your consumption today! Some new reading to help you quit smoking :
${link}`
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
        if (evaluation.combo.hit === 2) {
            return reallyBad(reallyBadLinks[(evaluation.combo.repeatition - 1) % 3]);
        }
        if (evaluation.combo.hit > 2) {
            return badCombo(
                evaluation.combo.hit,
                evaluation.targetConsumption,
                badComboLinks[(evaluation.combo.repeatition - 1) % 3]
            );
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
