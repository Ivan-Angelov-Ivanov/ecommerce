export const tokensReducer = (state = false, action) => {
    switch(action.type) {
        case "TOKENS_APPLIED":
            return action.payload;
        default:
            return state
    }
}