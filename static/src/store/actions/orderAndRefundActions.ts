import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchOrdersAndRefundsOfUserFailed,
  fetchOrdersAndRefundsOfUserInitiated,
  fetchOrdersAndRefundsOfUserSuccess,
} from "../slices/userOrdersAndRedundsSlice";
import { getUserOrders, getUserRefunds } from "../api";
import { Refund, Order } from "../interfaces";
import apiErrorHandler from "./utils/apiErrorHandler";

export const fetchOrdersAndRefunds =
  () =>
  async (
    dispatch: Dispatch<
      | ReturnType<typeof fetchOrdersAndRefundsOfUserInitiated>
      | ReturnType<typeof fetchOrdersAndRefundsOfUserSuccess>
      | ReturnType<typeof fetchOrdersAndRefundsOfUserFailed>
    >
  ) => {
    dispatch(fetchOrdersAndRefundsOfUserInitiated());
    try {
      const { data: orders }: { data: Order[] } = await getUserOrders();
      const { data: refunds }: { data: Refund[] } = await getUserRefunds();
      // console.log(orders, refunds);
      dispatch(fetchOrdersAndRefundsOfUserSuccess({ orders, refunds }));
    } catch (error) {
      apiErrorHandler(
        error,
        "Failed to fetch Orders and Refunds",
        fetchOrdersAndRefundsOfUserFailed
      )(dispatch);
    }
  };
