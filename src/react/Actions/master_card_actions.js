import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export const STORED_MASTER_CARD_ACTIONS = "BUNQDESKTOP_STORED_MASTER_CARD_ACTIONS";

export function masterCardActionsSetInfo(
    masterCardActions,
    account_id,
    resetOldItems = false,
    BunqJSClient = false
) {
    const type = resetOldItems
        ? "MASTER_CARD_ACTIONS_SET_INFO"
        : "MASTER_CARD_ACTIONS_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            masterCardActions,
            account_id
        }
    };
}

export function loadStoredMasterCardActions(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session
            .loadEncryptedData(STORED_MASTER_CARD_ACTIONS)
            .then(data => {
                if(data && data.items) {
                    dispatch(masterCardActionsSetInfo(data.items, data.account_id));
                }
            })
            .catch(error => {});
    };
}

export function masterCardActionsUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(masterCardActionsLoading());
        BunqJSClient.api.masterCardAction
            .list(userId, accountId, options)
            .then(masterCardActions => {
                dispatch(
                    masterCardActionsSetInfo(
                        masterCardActions,
                        accountId,
                        false,
                        BunqJSClient
                    )
                );
                dispatch(masterCardActionsNotLoading());
            })
            .catch(error => {
                console.error(error);
                dispatch(masterCardActionsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while loading your master card payments"
                );
            });
    };
}

export function masterCardActionsLoading() {
    return { type: "MASTER_CARD_ACTIONS_IS_LOADING" };
}

export function masterCardActionsNotLoading() {
    return { type: "MASTER_CARD_ACTIONS_IS_NOT_LOADING" };
}

export function masterCardActionsClear() {
    return { type: "MASTER_CARD_ACTIONS_CLEAR" };
}
