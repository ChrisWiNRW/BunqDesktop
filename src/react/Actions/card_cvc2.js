import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function cardCvc2SetInfo(cvc2_codes, user_id, card_id) {
    return {
        type: "CARD_CVC2_SET_INFO",
        payload: {
            cvc2_codes: cvc2_codes,
            user_id: user_id,
            card_id: card_id
        }
    };
}

export function cardUpdateCvc2Codes(BunqJSClient, user_id, card_id) {
    return dispatch => {
        dispatch(cardCvc2Loading());
        BunqJSClient.api.cardCvc2
            .list(user_id, card_id)
            .then(cardsCvc2Codes => {
                // turn string dates into date objects
                cardsCvc2Codes = cardsCvc2Codes.map(cardsCvc2Code => {
                    const cardCvc2Info = cardsCvc2Code.CardGeneratedCvc2;
                    console.log(cardCvc2Info);
                    return {
                        ...cardCvc2Info,
                        created: new Date(cardCvc2Info.created),
                        updated: new Date(cardCvc2Info.updated),
                        expiry_time: new Date(cardCvc2Info.expiry_time),
                    }
                });

                dispatch(cardCvc2SetInfo(cardsCvc2Codes, user_id,card_id));
                dispatch(cardCvc2NotLoading());
            })
            .catch(error => {
                dispatch(cardCvc2NotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the CVC codes"
                );
            });
    };
}

// export function cardGenerateCvc2(BunqJSClient, user_id, card_id) {
//     return dispatch => {
//         dispatch(cardCvc2Loading());
//         BunqJSClient.api.cardCvc2
//             .post(user_id, card_id)
//             .then(cardsCvc2Codes => {
//                 console.log(cardsCvc2Codes);
//                 dispatch(cardCvc2NotLoading());
//             })
//             .catch(error => {
//                 dispatch(cardCvc2NotLoading());
//                 BunqErrorHandler(
//                     dispatch,
//                     error,
//                     "We failed to generate a new CVC code"
//                 );
//             });
//     };
// }

export function cardCvc2Loading() {
    return { type: "CARD_CVC2_IS_LOADING" };
}

export function cardCvc2NotLoading() {
    return { type: "CARD_CVC2_IS_NOT_LOADING" };
}

export function cardCvc2CodesClear() {
    return { type: "CARD_CVC2_CLEAR" };
}
