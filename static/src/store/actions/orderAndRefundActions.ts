import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchOrdersAndRefundsOfUserFailed,
  fetchOrdersAndRefundsOfUserInitiated,
  fetchOrdersAndRefundsOfUserSuccess,
} from "../slices/userOrdersAndRedundsSlice";
import { getUserOrders, getUserRefunds } from "../api";
import { Refund, Order } from "../interfaces";

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
      const orders: Order[] = await getUserOrders(userUID);
      const refunds: Refund[] = await getUserRefunds(userUID);
      dispatch(fetchOrdersAndRefundsOfUserSuccess({ orders, refunds }));
    } catch (error) {
      dispatch(
        fetchOrdersAndRefundsOfUserFailed("Failed to fetch Orders and Refunds")
      );
    }
  };
