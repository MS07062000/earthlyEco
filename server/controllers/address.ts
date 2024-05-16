import { Request, Response } from "express";
import {
  addAddress,
  Address,
  deleteAddress,
  editAddress,
  getAddress,
  updateDefaultAddress,
} from "../services/userOperations/addressOperations";

export default {
  addAddress: async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      const address: Address = req.body?.address;
      if (userUID && address) {
        await addAddress(userUID, address);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  editAddress: async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      const { addressId } = req.params;
      const newAddress: Address = req.body?.address;
      if (userUID && addressId && newAddress) {
        await editAddress(userUID, addressId, newAddress);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  editDefaultAddress:async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      const { addressId } = req.params;
      if (userUID && addressId) {
        await updateDefaultAddress(userUID, addressId);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  deleteAddress: async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      const addressId: string = req.body?.address;
      if (userUID && addressId) {
        await deleteAddress(userUID, addressId);
        res.sendStatus(200);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
  getAddress: async (req: Request, res: Response) => {
    try {
      const userUID: string = req.body?.userUID;
      if (userUID) {
        const address = await getAddress(userUID);
        res.status(200).json({ data: address });
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    } catch (error) {
      res.sendStatus(400);
    }
  },
};
