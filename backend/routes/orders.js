import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllData
} from "../controllers/OrderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/create", createOrder);
router.put("/edit/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);
router.delete("/allData", getAllData);

export default router;