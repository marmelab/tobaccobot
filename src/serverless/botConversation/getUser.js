import smoker from '../services/smoker';

export default function (phoneNumber) {
    return smoker.get(phoneNumber);
}
