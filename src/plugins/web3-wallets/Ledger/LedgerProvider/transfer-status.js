/** U2F status codes */
export const U2FStatus = {
    DEVICE_LOCKED: 28169,
    USER_REJECTED_REQUESTED_ACTION: 28167,
    DEVICE_INELIGIBLE: 4,
};
export const TransferStatus = {
    ...U2FStatus,
    DEVICE_ACCESS_DENIED: 1000000,
};
