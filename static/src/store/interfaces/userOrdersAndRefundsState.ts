import Order from "./order";
import Refund from "./refund";

export default interface UserOrdersAndRefundsState {
  loading: boolean;
  orders: Order[];
  refunds: Refund[];
  error: string | null;
}
