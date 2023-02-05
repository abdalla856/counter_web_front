import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import socketIOClient from "socket.io-client";
const URL = "https://counterbackl.onrender.com/ticket";
const endpoint = "https://counterbackl.onrender.com";
const socket = socketIOClient(endpoint);
const CounterManager = () => {
  const [counterStatus, setCounterStatus] = useState("Online");
  const [currentTicket, setCurrentTicket] = useState("");
  const [counters, setCounters] = useState([]);
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(URL + "/all_counters").then((res) => setCounters(res.data));
  }, [counterStatus]);

  const toggleCounterStatus = (id, status) => {
    const index = counters.findIndex((counter) => counter._id === id);

    // Make a copy of the counters array
    const updatedCounters = [...counters];

    // Toggle the status of the counter
    updatedCounters[index].manager_status = status === 0 ? 1 : 0;
    console.log(updatedCounters);
    setCounters(updatedCounters);

    const API = URL + "/update_status";
    const data = { id: id, status: !status };
    axios
      .put(API, data)
      .then((res) => {
        socket.emit("next", res.data);
      })
      .catch((err) => console.log(err));
  };

  const completeCurrent = (id) => {
    const API = URL + "/complete_current";
    const data = { id: id };
    axios
      .put(API, data)
      .then((res) => socket.emit("next", res.data))
      .catch((err) => console.log(err));
  };

  const callNext = (id) => {
    const API = URL + "/get_next";
    const data = { id: id };
    console.log(id);
    axios
      .put(API, data)
      .then((res) => {
        res.data.serving === 0
          ? alert("No More Tickets to serve")
          : socket.emit("next", res.data.counters);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="counter_view">
      <h2 className="counter_head">Counter Manager View</h2>
      <div className="countercards">
        {counters.map((counter, index) => (
          <div className="countercard">
            Counter {index + 1}
            <div className="counter_btns">
              <button
                onClick={() =>
                  toggleCounterStatus(counter._id, counter.manager_status)
                }
              >
                {counter.manager_status === 0 ? "Go Offline" : "Go Online"}
              </button>
              <button onClick={() => completeCurrent(counter._id)}>
                Complete Current
              </button>
              <button onClick={() => callNext(counter._id)}>Call Next</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterManager;
