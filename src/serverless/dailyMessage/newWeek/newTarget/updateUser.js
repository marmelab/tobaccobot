import smoker from '../../../services/smoker';

export default function updateUser(user) {
    return smoker.save({
        ...user,
        remainingDays: user.remainingDays - 1,
        week: user.week + 1,
    });
}
