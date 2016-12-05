export default function updateUser(user) {
    return {
        ...user,
        week: user.week + 1,
    };
}
