import Order from "../../../models/Order";
import dbConnect from "../../../util/mongoose";

//we use async function because it's the CRUD operation and we don't know how long will it take for processing
export default async function handler(req, res) {
  //extrac {method} and this method may conatain Post, Get, PUt, Delete from request
  const { method } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const orders = await Order.find(req.body);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "POST") {
    try {
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}