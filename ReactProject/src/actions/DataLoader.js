import Dispatcher from "../dispatcher/appDispatcher";
import axios from "axios";
import constant from "../constants/DataLoaderConstants.js";

export default class DataLoader {
    constructor(URL, prefix) {
        this.URL = URL;
        this.prefix = prefix;
    }

    load() {
        axios.get('https://localhost:44311/DMVOAuth', config)
            .then(res => {
                this.signalLoadStarted();

                let config = {
                    'Authorization' : 'Bearer:'
                    'OData-MaxVersion': 4.0,
                    'OData-Version': 4.0,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                }

                axios
                    .get(this.URL)
                    .then(this.signalLoadSuccess.bind(this))
                    .catch(this.signalLoadFailure.bind(this));
            })
            .catch(this.signalLoadFailure.bind(this));
    }

    signalLoadStarted() {
        let startedSignal = {
            actionType: constant.ACTION_PREFIX + this.prefix + constant.STARTED_SUFFIX
        };
        DataLoader.signal(startedSignal);
    }

    signalLoadSuccess(result) {
        let successSignal = {
            actionType:
                constant.ACTION_PREFIX + this.prefix + constant.SUCCESS_SUFFIX,
            data: result.data.value
        };
        DataLoader.signal(successSignal);
    }

    signalLoadFailure(error) {
        console.log("DataLoader received error from API:");
        console.log(error);

        let failureSignal = {
            actionType: constant.ACTION_PREFIX + this.prefix + constant.FAILURE_SUFFIX
        };
        DataLoader.signal(failureSignal);
    }

    signalLogIn(secRoles, username) {
        let loggedInSignal = {
            actionType: 'user_logged_in',
            data: { authorization: secRoles, user: username }
        };
        DataLoader.signal(loggedInSignal);
    }

    static signal(signalObj) {
        Dispatcher.dispatch(signalObj);
    }
}