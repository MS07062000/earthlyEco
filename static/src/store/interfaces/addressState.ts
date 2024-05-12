import address from "./address";

export default interface addressState {
  loading: boolean;
  addresses: address[] | null;
  defaultAddress: address | null;
  error: string | null;
}
