import { Order } from "../models/index.js";

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching orders", error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching order", error: error.message });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { customer_name, product, quantity, amount, status, role_id } = req.body;

    const order = await Order.create({
      customer_name,
      product,
      quantity,
      amount,
      status,
      role_id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ msg: "Error creating order", error: error.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await order.update(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: "Error updating order", error: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await order.destroy();
    res.json({ msg: "Order deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting order", error: error.message });
  }
};
const getAllData = async (req,res) => {
   try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ msg: "Error fetching orders", error: error.message });
    }
}

// ✅ Single export at the end sdsdsd
export {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllData
};