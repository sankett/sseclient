import React, { useState, useEffect } from "react";
import $ from 'jquery';
window.jQuery = $;
require('signalr');
const Barcode = require("react-barcode");

function Approach1() {
    const [selectedProducts, setSelectedproducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        console.log('useEffect');
        var connection = $.hubConnection('http://localhost:6118');
        var proxy = connection.createHubProxy('chathub');
        console.log(proxy);
        proxy.on('broadcastNotification', handleEvent);
        // atempt connection, and handle errors
        connection.start({ transport: ['webSockets', 'longPolling'] })
        .done(function () { console.log('Now connected, connection ID=' + connection.id); })
        .fail(function (param) { console.log('Could not connect'); console.log(param); });

        return () => proxy.off('broadcastNotification', handleEvent);

    }, []);

    const handleEvent = function (barcode) {
        console.log('handleEvent',barcode);
        fetch(`https://sseserver.onrender.com/products/${barcode}`).
        then(response => response.json()).then(product => {
            console.log(product)
            setCurrentProduct(product);
            setSelectedproducts((selectedProducts) => {
                const temp = selectedProducts.find(p => p.id === product.id);
                if(temp){
                      temp.quantity += product.quantity;
                        return [...selectedProducts];             
                }
                else{
                    return [...selectedProducts, product]   
                }
               
                
            });
        });

    }

    useEffect(() => {
        console.log('useEffect2', selectedProducts);
        let temptotal = 0;
        selectedProducts.map((product) => {
            temptotal = temptotal + product.price * product.quantity;
        });
        setTotal(temptotal);
    }, [selectedProducts]);

    return (
        <div>
            <span style={{textAlign: "center"}}><h4>Approach 1 <span style={{color: "blue"}}>( Service > (SignalR) UI >(Async) API)</span></h4></span>
            { selectedProducts.length > 0 && <table style={{width: "98%", marginLeft: "1%", border: "1px solid black"}}>
                <thead>
                    <tr>
                        <th style={{width: "10%"}}></th>
                       
                        <th style={{width: "55%",textAlign: "left"}}>Product</th>
                        <th style={{width: "10%"}}>Price</th>
                        <th style={{width: "10%"}}>Quantity</th>
                        <th style={{width: "10%"}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    
                    selectedProducts.map((product) => (
                        <tr key={product.id} style={{paddingTop:"20px"}}>
                             <td style={{width: "10%", textAlign: "center"}}>
                                <img src={product.Image} alt={product.name} style={{width: "140px", height: "100px"}} />
                             </td>
                           
                            <td style={{width: "65%", textAlign: "left"}}>
                            <span style={{fontWeight:"bold"}}>{product.name}</span><br></br>
                            
                            {product.description}<br></br>
                            
                            </td>
                            <td style={{width: "10%", textAlign: "center"}}>{product.price}</td>
                            <td style={{width: "10%", textAlign: "center"}}>{product.quantity}</td>
                            <td style={{width: "10%", textAlign: "center"}}>{product.price * product.quantity}</td>
                        </tr>
                    ))                    
                }
                <tr>
                        <th style={{width: "10%"}}></th>
                       
                        <th style={{width: "55%"}}></th>
                        <th style={{width: "10%"}}></th>
                        <th style={{width: "10%"}}></th>
                        <th style={{width: "10%"}}>{total}</th>
                    </tr>
                </tbody>
            </table>}
            
        </div>
    )
}

export default Approach1;