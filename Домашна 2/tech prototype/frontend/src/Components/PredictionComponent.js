import NavigationComponent from "./NavigationComponent";
import '../Styles/style.css';
import FooterComponent from "./FooterComponent";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


const PredictionComponent = () => {

    const [stock, setStock] = useState();
    const codeValue = useRef();
    const [codes, setCodes] = useState([]);

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/codestats');
                setCodes(response.data);
                setStock(response.data[0]);
            } catch (err) {
                console.error('Error fetching codes:', err);
            }
        };

        fetchCodes();
    }, []);



    const getPrediction = () => {
            setStock(codes.filter((code) => code.code === codeValue.current.value.toUpperCase())[0]);
    }


    return (
        <>
        <NavigationComponent/>

        <div className="container mt-5 box-shadow pt-4 pb-4 rounded">
            <div className="row d-flex justify-content-center">
                <div className="col-md-12 text-center d-flex flex-column">
                    <h4 style={{color: "#A00000"}}>ПРЕДИКЦИЈА</h4>
                    <p>Следи ја просечната цена за акциите на македонската берза!</p>
                </div>
            </div>
        </div>

        <div className="container d-flex flex-column mt-5 text-center justify-content-center align-items-center">
            <div>
                <h4 style={{color: "#A00000"}}>Внеси го кодот на акцијата чија цена сакате да биде предвидена:</h4>
            </div>
            <div className="w-50 d-flex">
                <input placeholder="ADIN" className="form-control w-100 mt-4" ref={codeValue}/>
                <button className="btn btn-light text-danger fw-bold mt-3 mx-5" onClick={() => getPrediction()}>Провери</button>
            </div>
        </div>


        <div className="container d-flex flex-column mt-5 box-shadow pt-4 pb-4 rounded">
            <div className="row mx-3">
            <div className="d-flex justify-content-around col-md-12 box-shadow pt-3 pb-3 rounded">
                <p className="mb-0">КОД</p>
                <p className="mb-0">МИНИМАЛНА ЦЕНА</p>
                <p className="mb-0">МАКСИМАЛНА ЦЕНА</p>
                <p className="mb-0">ПРОСЕЧНА ЦЕНА</p>
                <p></p>
            </div>

            <div className="d-flex justify-content-around col-md-12 box-shadow mt-5 rounded pt-3 pb-3 flex-column">
                {
                       stock&&
                       <>
                       <div className="d-flex justify-content-around col-md-12 box-shadow rounded pt-3 pb-3">
                            <p className="mb-0">{stock.code}</p>
                            <p className="mb-0">{stock.min_value} денари</p>
                            <p className="mb-0">{stock.max_value} денари</p>
                            <p className="mb-0">{parseFloat(stock.avg_value).toFixed(1)} денари</p>
                            <p style={{color: "#A00000"}}>предвиди -></p>
                        </div>
                         <h5 className="mt-5 mb-5 text-center" style={{color: "#A00000"}}>Предвидена цена: 357.0 денари</h5></>
                }
                {
                    stock===undefined&&<p className="text-center fw-bold" style={{color: "#A00000"}}>Кодот на акцијата не постои</p>
                }
            </div>
            </div>
        </div>

        <FooterComponent/>

        </>
    )
}

export default PredictionComponent;