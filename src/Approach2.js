import React, { useState, useEffect } from "react";

function Approach2() {
    const [message, setMessage] = useState([]);
    const [data, setData] = useState("test");

    const [selectedProducts, setSelectedproducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
      const baseazurerUrl = "https://ssenode.azurewebsites.net";
      const baserenderUrl = "https://sseserver.onrender.com";
      const baselocalUrl = "http://localhost:3001";
        //const eventSource = new EventSource(`https://sseserver.onrender.com/sse/${data}`);
        const eventSource = new EventSource(`https://sseserver.onrender.com/connect`);
        setTimeout(() => {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scandata: "1111" })
        };
          fetch(`https://sseserver.onrender.com/broadcastdata`, requestOptions )
            .then((res) => res.json())
            .then((data) => {
              console.log("data", data);
              
            });
        }, 2000);
            
        
        eventSource.onmessage = (event) => {
          try {
            const product = JSON.parse(event.data);
            console.log("eventdata", product);
            setMessage((message) => [...message, product]);
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

          } catch (error) {
            console.error("Failed to parse JSON data", error);
          }
        };
        
    
        return () => {
          eventSource.close();
        };
      }, []);

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
          
             <span style={{textAlign: "center"}}><h3>Approach 2 </h3></span> 
             <span style={{textAlign: "center", paddingLeft: "20%"}}>
              <img src="./ap2.jpg" alt="logo" style={{width: "60%", height: "300px"}} /></span>
          { selectedProducts.length > 0 && <table style={{width: "98%", marginLeft: "1%", border: "1px solid black"}}>
                <thead>
                    <tr>
                        <th style={{width: "10%"}}></th>
                       
                        <th style={{width: "55%", textAlign: "left"}}>Product</th>
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
                                <img src={product.Image} alt={product.name} style={{width: "100px", height: "100px"}} />
                             </td>
                           
                            <td style={{width: "65%", textAlign: "left"}}>
                            <span style={{fontWeight:"bold", fontSize: "14px"}}>{product.name}</span><br></br>
                            
                            <span style={{fontSize: "12px"}}>{product.description}</span><br></br>
                            
                            </td>
                            <td style={{width: "10%", textAlign: "center", fontSize: "14px"}}>{product.price}</td>
                            <td style={{width: "10%", textAlign: "center", fontSize: "14px"}}>{product.quantity}</td>
                            <td style={{width: "10%", textAlign: "center", fontSize: "14px"}}>{product.price * product.quantity}</td>
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
            </table>
}
        </div>
          
        
      );
}

export default Approach2;