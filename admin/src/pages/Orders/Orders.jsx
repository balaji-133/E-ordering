import React from 'react'
import './Orders.css'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'
import {assets} from "../../assets/assets"

const Orders = ({url}) => {
  const [orders,setOrders]=useState([]);
  const fetchAllOrders=async()=>{
    const response = await axios.get(url+"/api/order/list");
    if(response.data.success){
      setOrders(response.data.data)
    }
    else{
      toast.error("Error");
    }
  }

  const statusHandler = async (e,orderId)=>{
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:e.target.value
    })
    if(response.data.success){
      await fetchAllOrders();
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])

  

  return (
    <div className="order add">
      <h2>Order page</h2>
      <div className="order-list">
        {orders.map((order,index) => (
          <div key={index} className="order-item">
            <div className="order-item-header">
              <img src={assets.parcel_icon} alt="" />
              <p className="order-item-food">
                {order.items.map((item,index) => (
                  index === order.items.length-1 
                    ? `${item.name}x${item.quantity}`
                    : `${item.name}x${item.quantity}, `
                ))}
              </p>
            </div>
            
            <div className="order-details">
              <div className="order-detail-item">
                <div className="order-item-name">
                <span className="order-detail-label">Name:</span>
                <span>{order.name}</span>
                </div>
              </div>
              <div className="order-detail-item">
                <span className="order-detail-label">Table No:</span>
                <span>{order.table}</span>
              </div>
              <div className="order-detail-item">
                <span className="order-detail-label">No.of people:</span>
                <span>{order.people}</span>
              </div>
              <div className="order-detail-item">
                <span className="order-detail-label">Items:</span>
                <span>{order.items.length}</span>
              </div>
              <div className="order-detail-item">
                <span className="order-detail-label">Price:</span>
                <span>${order.amount}</span>
              </div>
            </div>
            
            <div className="order-item-footer">
              <div className="order-status">
                <select onChange={(e)=>statusHandler(e,order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out of Delivery">Out of Delivery</option>
                  <option value="Received">Received</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
)
}

export default Orders