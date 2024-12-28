import NavigationComponent from "./NavigationComponent";
import '../Styles/style.css';
import FooterComponent from "./FooterComponent";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CompaniesComponent = () => {

    const [codes, setCodes] = useState([]);

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/codestats');
                setCodes(response.data);
                console.log(response.data);
            } catch (err) {
                console.error('Error fetching codes:', err);
            }
        };

        fetchCodes();
    }, []);

    return (
        <>
        <NavigationComponent/>

        <div className="container mt-5 box-shadow pt-4 pb-4 rounded">
            <div className="row d-flex justify-content-center">
                <div className="col-md-12 text-center d-flex flex-column">
                    <h4 style={{color: "#A00000"}}>КОМПАНИИ</h4>
                    <p>Следи ја просечната цена за акциите на македонската берза!</p>
                </div>
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
                    codes.map((code) => (
                        <div className="d-flex justify-content-around col-md-12 box-shadow mt-5 rounded pt-3 pb-3 align-items-center">
                            <p className="mb-0">{code.code}</p>
                            <p className="mb-0">{code.min_value} денари</p>
                            <p className="mb-0">{code.max_value} денари</p>
                            <p className="mb-0">{parseFloat(code.avg_value).toFixed(1)} денари</p>
                            <p className="mb-0" style={{color: "#A00000"}}>предвиди -></p>
                        </div>
                    ))
                }

            </div>
            </div>
        </div>

        <FooterComponent/>

        </>
    )
}

export default CompaniesComponent;