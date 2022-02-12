import Product from "../../../models/Product";
import dbConnect from "../../../util/mongoose";

export default async function handler(req, res) {
  const { method } = req;

  dbConnect();

  if (method === "GET") {
  }
  if (method === "POST") {
    try {
      // creating new product in the mongodb
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
