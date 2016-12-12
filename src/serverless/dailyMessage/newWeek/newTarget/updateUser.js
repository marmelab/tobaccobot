import smoker from '../../../services/smoker';

export default function updateUser(user) {
    return smoker.save({
        ...user,
        week: user.week + 1,
    });
}
