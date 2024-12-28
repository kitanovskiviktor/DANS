// src/StockAnalyzer.js
import React, { useState, useRef } from "react";
import FooterComponent from "./FooterComponent";
import NavigationComponent from "./NavigationComponent";

function StockAnalysis() {
  const [stockData, setStockData] = useState([]);
  const codeValue = useRef();
  const limitValue = useRef();

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(
        `http://localhost:5000/analyze-stock?code=${codeValue.current.value.toUpperCase()}&limit=${limitValue.current.value}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("Received data:", data);
      setStockData(data);
    } catch (err) {
      setStockData([]);
    }
  };

  const renderValue = (value) => {
    return value === null ? "N/A" : value;
  };

  return (
    <>
      <NavigationComponent />

      <div className="container mt-5 box-shadow pt-4 pb-4 rounded">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 text-center d-flex flex-column">
            <h4 style={{ color: "#A00000" }}>АНАЛИЗА</h4>
            <p>Следи ја анализата за акциите на македонската берза!</p>
          </div>
        </div>
      </div>

      <div className="container d-flex flex-column mt-5 text-center justify-content-center align-items-center">
        <div>
          <h4 style={{ color: "#A00000" }}>
            Внеси го кодот на акцијата чија цена сакате да биде анализирана:
          </h4>
        </div>
        <div className="w-50 d-flex">
          <input
            placeholder="ADIN"
            className="form-control w-100 mt-4"
            ref={codeValue}
          />
          <select ref={limitValue}>
            <option value="1">1</option>
            <option value="7">7</option>
            <option value="30">30</option>
          </select>
          <button
            className="btn btn-light text-danger fw-bold mt-3 mx-5"
            onClick={(e) => handleSubmit(e)}
          >
            Анализирај
          </button>
        </div>
      </div>

      <div className="container d-flex flex-column mt-5 box-shadow pt-4 pb-4 rounded">
        <div className="row mx-3">
          <div className="d-flex justify-content-around col-md-12 box-shadow pt-3 pb-3 rounded">
            <p className="mb-0">Date</p>
            <p className="mb-0">Price</p>
            <p className="mb-0">RSI</p>
            <p className="mb-0">MACD</p>
            <p className="mb-0">CCI</p>
            <p className="mb-0">SMA_10</p>
            <p className="mb-0">EMA_10</p>
            <p className="mb-0">WMA_10</p>
            <p className="mb-0">EMA_20</p>
            <p className="mb-0">TEMA</p>
            <p className="mb-0">Signal</p>
          </div>

          <div className="d-flex justify-content-around col-md-12 box-shadow mt-5 rounded pt-3 pb-3 flex-column">
            {stockData.map((row, index) => (
              <div className="d-flex justify-content-around col-md-12 box-shadow rounded pt-3 pb-3">
                <p className="mb-0">{renderValue(row.datum).split(" ").splice(0, 4).join(" ")}</p>
                <p className="mb-0">{renderValue(row.posledna_transakcija)}</p>
                <p className="mb-0">{renderValue(row.RSI)}</p>
                <p className="mb-0">{renderValue(row.MACD)}</p>
                <p className="mb-0">{renderValue(row.CCI)}</p>

                <p className="mb-0">{renderValue(row.SMA_10)}</p>
                <p className="mb-0">{renderValue(row.EMA_10)}</p>
                <p className="mb-0">{renderValue(row.WMA_10)}</p>

                <p className="mb-0">{renderValue(row.EMA_20)}</p>
                <p className="mb-0">{renderValue(row.TEMA)}</p>

                {renderValue(row.signal) === "Buy" ? (
                  <p className="mb-0" style={{ color: "green" }}>
                    {renderValue(row.signal)}
                  </p>
                ) : renderValue(row.signal) === "Sell" ? (
                  <p className="mb-0" style={{ color: "red" }}>
                    {renderValue(row.signal)}
                  </p>
                ) : (
                  <p className="mb-0" style={{ color: "orange" }}>
                    {renderValue(row.signal)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}

export default StockAnalysis;
