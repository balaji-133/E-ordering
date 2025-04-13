// import React, { useEffect } from "react";
// import "./placeorder.css";
// import { useContext } from "react";

// import { StoreContext } from "../../context/StoreContext";
// import { useState } from "react";
// import axios from "axios";

// const Placeorder = () => {
//   const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);

//   const [data,setData]=useState({
//     name:"",
//     table:"",
//     people:""
//   })

//   const onChangeHandler=(e)=>{
//     const name = e.target.name;
//     const value = e.target.value;
//     setData(data=>({...data,[name]:value}))
//   }

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     let orderItems = [];
//     food_list.map((item)=>{
//       if(cartItems[item._id]>0){
//         let itemInfo = item;
//         itemInfo["quantity"]=cartItems[item._id];
//         orderItems.push(itemInfo)
//       }
//     })

//     let orderData = {
//       table:data,
//       items:orderItems,
//       amount:getTotalCartAmount()+2,
//     }
//     let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
//     if(response.data.success){
//       const {session_url}=response.data;
//       window.location.replace(session_url);
//     }
//     else{
//       alert("Order failed");
//     }
//   }

//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       <div className="place-order-left">
//         <p className="title"> Delivery</p>
//         <div className="multi-fields">
//           <input required name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Enter name" />
//         </div>
//         <div className="multi-fields">
//           <label for="tables">Choose a table:</label>
//           <select required id="tables" name="table" onChange={onChangeHandler} value={data.table}>
//             <option value="table-1">Table 1</option>
//             <option value="table-2">Table 2</option>
//             <option value="table-3">Table 3</option>
//             <option value="table-4">Table 4</option>
//             <option value="table-5">Table 5</option>
//             <option value="table-6">Table 6</option>
//           </select>
//         </div>
//         <div className="multi-fields">
//         <label for="tables">No.of people</label>
//         <select required onChange={onChangeHandler} value={data.people} id="people" name="people">
//             <option value="1">1 person</option>
//             <option value="2">2 people</option>
//             <option value="3">3 people</option>
//             <option value="4">4 people</option>
//             <option value="5">5 people</option>
//             <option value="6">6 people</option>
//         </select>
//         </div>
//       </div>
//       <div className="place-order-right">
//       <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Sub Total</p>
//               <p>${getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Tax</p>
//               <p>${getTotalCartAmount()===0?0:2}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Total</p>
//               <p>${getTotalCartAmount()===0 ?0 : getTotalCartAmount()+2}</p>
//             </div>
//           </div>
//           <button type="submit" >Payment</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Placeorder;
import React, { useState, useContext } from "react";
import axios from "axios";
import "./placeorder.css";
import { StoreContext } from "../../context/StoreContext";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Placeorder = () => {
    const { 
        getTotalCartAmount, 
        token, 
        food_list, 
        cartItems, 
        url 
    } = useContext(StoreContext);
    
    const [formData, setFormData] = useState({
        name: "",
        table: "table-1",
        people: "1"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (getTotalCartAmount() === 0) {
                throw new Error("Your cart is empty");
            }

            const orderItems = food_list
                .filter(item => cartItems[item._id] > 0)
                .map(item => ({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: cartItems[item._id]
                }));

            const orderData = {
                items: orderItems,
                amount: getTotalCartAmount() + 2,
                name: formData.name,
                table: formData.table,
                people: parseInt(formData.people)
            };

            const response = await axios.post(
                `${url}/api/order/place`, 
                orderData, 
                { headers: { token } }
            );

            if (response.data.success) {
                window.location.href = response.data.session_url;
            } else {
                throw new Error(response.data.message || "Order failed");
            }
        } catch (err) {
            console.error("Order Error:", err);
            setError(err.response?.data?.message || err.message || "Order failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = getTotalCartAmount();
    const tax = subtotal === 0 ? 0 : 2;
    const total = subtotal + tax;

    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            navigate('/cart')
        }
        else if(getTotalCartAmount() == 0){
            navigate('/cart')
        }
    },[token])

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                
                <div className="multi-fields">
                    <input
                        required
                        name="name"
                        onChange={handleInputChange}
                        value={formData.name}
                        type="text"
                        placeholder="Enter your name"
                        minLength="2"
                    />
                </div>
                
                <div className="multi-fields">
                    <label htmlFor="tables">Choose a table:</label>
                    <select
                        required
                        id="tables"
                        name="table"
                        onChange={handleInputChange}
                        value={formData.table}
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={`table-${num}`}>
                                Table {num}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="multi-fields">
                    <label htmlFor="people">Number of people</label>
                    <select
                        required
                        onChange={handleInputChange}
                        value={formData.people}
                        id="people"
                        name="people"
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'person' : 'people'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Tax</p>
                            <p>${tax.toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${total.toFixed(2)}</b>
                        </div>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting || subtotal === 0}
                    >
                        {isSubmitting ? "Processing..." : "Proceed to Payment"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Placeorder;