import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";
import socketIOClient from "socket.io-client";
const URL = "http://localhost:5000/ticket";
const endpoint = "http://localhost:5000";
const socket = socketIOClient(endpoint);
const CustomerView = () => {
  const [ticketNumber, setTicketNumber] = useState(null);
  const [nowServing, setNowServing] = useState(0);
  const [lastTicket, setLastTicket] = useState(0);

  const [counters, setCounter] = useState([]);
  useEffect(() => {
    axios.get(URL + "/all_counters").then((res) => setCounter(res.data));
    axios.get(URL + "/last_ticket").then((res) => setLastTicket(res.data));
    axios.get(URL + "/get_current").then((res) => setNowServing(res.data));
    console.log("first use effect");
  }, []);
  useEffect(() => {
    axios.get(URL + "/get_current").then((res) => setNowServing(res.data));
    console.log("second");
  }, [counters]);

  useEffect(() => {
    socket.on("new-ticket", (ticketnum) => {
      setLastTicket(ticketnum);
    });
  }, []);
  useEffect(() => {
    socket.on("next", (counter) => {
      setCounter(counter);
    });
  }, []);
  const handleTakeNumber = () => {
    axios.get(URL + "/get_ticket").then((res) => {
      socket.emit("new-ticket", res.data);
      setLastTicket(res.data);
      setTicketNumber(res.data);
    });
  };

  return (
    <div className="customer_view">
      <h1 className="customer_head">Customer View
      <span style={{float :"right"}}><Link to="/manager">Go to Counter Manager</Link></span>
      </h1>
      

      <div className="upper_customer_view">
        {<p>Now Serving: {nowServing}</p>}
        {<p>Last Number: {lastTicket}</p>}
        {ticketNumber ? (
          <p>Your ticket number is: {ticketNumber}</p>
        ) : (
          <button onClick={handleTakeNumber} className="addticket_btn">
            Take a Number
          </button>
        )}
      </div>
    
      <div className="cards">
        {counters.map((counter, index) => (
          <div key={counter._id} className="card">
            <div
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                backgroundColor:
                  counter.customer_status === 0 && counter.current_serving === 0
                    ? "green"
                    : counter.customer_status === 1 ||
                      counter.manager_status == 0
                    ? "red"
                    : "gray",
                borderRadius: "50%",
                marginRight: "20px",
              }}
            />

            <span>Counter {index + 1}</span>
            {counter.current_serving !== 0 ? (
              <p>Current Number: {counter.current_serving}</p>
            ) : (
              <p>No customer is being served</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerView;
