import {
    createStore
} from "redux"
let reducer = (state, action) => {
    if (action.type === "login-success") {
        return {
            ...state,
            loggedIn: true
        }
    }
    if (action.type === "set-messages") {
        return {
            ...state,
            msgs: action.messages
        }
    }
    if (action.type === "login-unsuccess") {
        return {
            ...state,
            loggedIn: false,
            active: action.activeUser
        }
    }
    if (action.type === "active") {
        return {
            ...state,
            active: action.activeUser
        }
    }
    if (action.type === "admin") {
        return {
            ...state,
            admin: true
        }
    }

    return state
}

const store = createStore(
    reducer, {
        msgs: [],
        loggedIn: false,
        active: [],
        admin: false

    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store