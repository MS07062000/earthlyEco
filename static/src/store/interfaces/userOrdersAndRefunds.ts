export default interface UserOrdersAndRefundsState {
  loading: boolean;
  orders:any[];
  refunds:any[];
  error: string | null;
}
