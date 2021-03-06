import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export const STORED_PAYMENTS = "BUNQDESKTOP_STORED_PAYMENTS";

export function paymentsSetInfo(
    payments,
    account_id,
    resetOldItems = false,
    BunqJSClient = false
) {
    const type = resetOldItems ? "PAYMENTS_SET_INFO" : "PAYMENTS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            payments,
            account_id
        }
    };
}

export function loadStoredPayments(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session
            .loadEncryptedData(STORED_PAYMENTS)
            .then(data => {
                if(data && data.items) {
                    dispatch(paymentsSetInfo(data.items, data.account_id));
                }
            })
            .catch(error => {});
    };
}

export function paymentInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(paymentsLoading());

        BunqJSClient.api.payment
            .list(user_id, account_id, options)
            .then(payments => {
                dispatch(
                    paymentsSetInfo(payments, account_id, false, BunqJSClient)
                );
                dispatch(paymentsNotLoading());
            })
            .catch(error => {
                dispatch(paymentsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the payments for this monetary account"
                );
            });
    };
}

export function paymentsLoading() {
    return { type: "PAYMENTS_IS_LOADING" };
}

export function paymentsNotLoading() {
    return { type: "PAYMENTS_IS_NOT_LOADING" };
}

export function paymentsClear() {
    return { type: "PAYMENTS_CLEAR" };
}
