import React from 'react'
import {
    DollarOutlined,
    ScheduleFilled,
    CustomerServiceFilled,
    GiftOutlined
  } from "@ant-design/icons";

const Advantages = () => {

    return (
        <>
        <div className="card-group">
        <div className="card m-3">
            <div className="row no-gutters">
              <DollarOutlined className="mt-3 pl-4 pt-3" style={{fontSize: "40px", color: "#666"}} />
              <div className="card-body">
                <h5 className="card-title">Best Prices</h5>
                <span className="card-text">Attractive promotions and discounts</span>
              </div>
            </div>
          </div>
          <div className="card m-3">
            <div className="row no-gutters">
              <ScheduleFilled className="mt-3 pl-4 pt-3" style={{fontSize: "40px", color: "#666"}} />
              <div className="card-body">
                <h5 className="card-title">Delivery in Time</h5>
                <span className="card-text">Providing the best service</span>
              </div>
            </div>
          </div>
          <div className="card m-3">
            <div className="row no-gutters">
              <CustomerServiceFilled className="mt-3 pl-4 pt-3" style={{fontSize: "40px", color: "#666"}} />
              <div className="card-body">
                <h5 className="card-title">Huge Variety</h5>
                <span className="card-text">New products every week</span>
              </div>
            </div>
          </div>
          <div className="card m-3">
            <div className="row no-gutters">
              <GiftOutlined className="mt-3 pl-4 pt-3" style={{fontSize: "40px", color: "#666"}} />
              <div className="card-body">
                <h5 className="card-title">Raffle every month</h5>
                <span className="card-text">Participate and win unique prizes</span>
              </div>
            </div>
          </div>
      </div>
        </>
    );
};

export default Advantages