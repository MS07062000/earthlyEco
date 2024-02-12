import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchOrdersAndRefundsOfUserFailed,
  fetchOrdersAndRefundsOfUserInitiated,
  fetchOrdersAndRefundsOfUserSuccess,
} from "../slices/userOrdersAndRedundsSlice";
import { getOrderProcessed } from "../api/getOrderProcessed";
import { getRefundProcessed } from "../api/getRefundProcessed";
import Refund from "../interfaces/refund";
import Order from "../interfaces/order";

export const fetchOrdersAndRefunds =
  (userUID: string) =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchOrdersAndRefundsOfUserInitiated>
      | ReturnType<typeof fetchOrdersAndRefundsOfUserSuccess>
      | ReturnType<typeof fetchOrdersAndRefundsOfUserFailed>
    >
  ) => {
    dispatch(fetchOrdersAndRefundsOfUserInitiated());
    try {
      const orders: Order[] = await getOrderProcessed(userUID);
      const refunds: Refund[] = await getRefundProcessed(userUID);
      dispatch(fetchOrdersAndRefundsOfUserSuccess({ orders, refunds }));
    } catch (error) {
      dispatch(
        fetchOrdersAndRefundsOfUserFailed("Failed to fetch Orders and Refunds")
      );
    }
  };