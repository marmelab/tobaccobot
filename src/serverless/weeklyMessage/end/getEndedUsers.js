export default users =>
    users.filter(user => user.remainingDays === 0);
