import smoker from '../services/smoker';

export default function (user) {
    return smoker.save(user);
}
