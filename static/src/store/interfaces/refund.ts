import RefundProductInfo from "./refundProductInfo";

export default interface Refund {
    refundID: string;
    paymentID: string;
    categoryWithProducts: RefundProductInfo[];
}