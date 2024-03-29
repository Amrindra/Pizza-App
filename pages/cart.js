import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import axios from "axios";
import { useRouter } from "next/router";
import { reset } from "../redux/cartSlice";
import OrderDetails from "../components/OrderDetails";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const amount = cart.total;
  const currency = "USD";
  const style = { layout: "vertical" };

  const createOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
//       const res = await axios.post(
//         "https://tonbb.sse.codesandbox.io/api/orders",
//         data
//       );
      if (res.status === 201) {
        dispatch(reset());
        router.push(`/orders/${res.data._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency
        }
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount
                    }
                  }
                ]
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1
              });
            });
          }}
        />
      </>
    );
  };

  // Create our number formatter for the currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const handleRemove = () => {
    dispatch(reset());
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </tbody>

          <tbody className={styles.orderItemDetail}>
            {cart.products.map((product) => (
              <tr className={styles.tr} key={product._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={product.img}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                    />
                  </div>
                </td>

                <td>
                  <span className={styles.name}>{product.title}</span>
                </td>

                <td>
                  <span className={styles.extras}>
                    {product.extraOption.map((extra) => (
                      <span key={extra._id}>{extra.text}, </span>
                    ))}
                  </span>
                </td>

                <td>
                  <span className={styles.price}>
                    {formatter.format(product.price)}
                  </span>
                </td>

                <td>
                  <span className={styles.quantity}>{product.quantity}</span>
                </td>

                <td>
                  <span className={styles.total}>
                    {formatter.format(product.price * product.quantity)}
                  </span>
                </td>

                <td>
                  <button onClick={handleRemove}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subtotal and Paypal section */}
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>
            {formatter.format(cart.total)}
          </div>

          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>

          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>
            {formatter.format(cart.total)}
          </div>

          {open ? (
            <div className={styles.paymentMethods}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                CASH ON DELIVERY
              </button>

              <PayPalScriptProvider
                options={{
                  "client-id":
                    "ATA-3v3bHB1wkIKWhRDimrYXGe-uOua03HKchRDY_idbhxc0YaFzeK53zXn0GlULAAkOvjz0Dfke1ghR",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "credit,card,p24"
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>
          )}
        </div>
      </div>
      {cash && <OrderDetails total={cart.total} createOrder={createOrder} />}
    </div>
  );
};

export default Cart;
