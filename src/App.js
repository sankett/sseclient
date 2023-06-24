import logo from './logo.svg';
import './App.css';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import useScanDetection from 'use-scan-detection'
import { Button, Input } from '@mui/material';
import { ReactToPrint } from 'react-to-print';
import React, { useRef, useEffect, useCallback } from "react";
import PrintComponent from "./PrintComponent";
import axios from 'axios';
// import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from "signalr";
import $ from 'jquery';
window.jQuery = $;

require('signalr');

const Barcode = require("react-barcode");
function App() {
  //   useEffect(() => {
  //  this.handleEvent = this.handleEvent.bind();
  //   }, []);
  console.log('app render');
  const [post, setPost] = useState('');
  //const noImage=

  // const [connection, setConnection] = useState(null);
  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'quantity', headerName: 'Quantity', editable: true },
    {
      field: 'price', headerName: 'Price', width: 180, renderCell: (params) => {
        return priceFormatter(params.value);
      }
    },
    { field: 'discount', headerName: 'Discount', editable: true },
    { field: 'discountedPrice', headerName: 'DiscountedPrice', editable: true }
  ];
  /*const [masterProducts, setmasterPproducts] = useState([
    { id: 1, UPC: '8762345986', name: 'iPhone', qunatity: 1, price: '799.00', Image: '../../assets/iPhone.jpg' },
  { id: 2, UPC: '6782498536', name: 'Samsung S3', qunatity: 1, price: '399.00', Image: '../../assets/samsung.png' },
  { id: 3, UPC: '2965357012', name: 'One Plus', qunatity: 1, price: '599.00', Image: '../../assets/1plus.png' }]);
  */

      const [masterProducts, setmasterPproducts] = useState([
        { 
        id: 1, 
        barcode_id: '8762345986', 
        name: 'Biscuit', 
        quantity: 1, 
        availability: true,
        price: 19.99,
        description: '',
        discount: 25,
        offers: 'some sample text' ,
        Image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' 
       },
       { 
        id: 2, 
        barcode_id: '6782498536', 
        name: 'Cadbury', 
        quantity: 1, 
        availability: true,
        price: 12.99,
        description: '',
        discount: 12,
        offers: 'some sample text' ,
        Image: '' 
       },
       { 
        id: 3, 
        barcode_id: '123456789', 
        name: 'Wafers', 
        quantity: 1, 
        availability: true,
        price: 20.00,
        description: '',
        discount: 10,
        offers: 'some sample text' ,
        Image: '' 
       }]);   
  const [selectedProducts, setproducts] = useState([]);
  const [currentProduct, setcurrentProduct] = useState(null);

  useEffect(() => {
    // const connect = new HubConnectionBuilder()
    // .configureLogging(LogLevel.Debug)
    //   .withUrl("http://localhost:6118/signalr/hubs", {
    //     // skipNegotiation: true,
    //     // transport: HttpTransportType.WebSockets
    //   })
    //   .withAutomaticReconnect()
    //   .build();

    //   connection = new signalR.HubConnectionBuilder()
    // .configureLogging(signalR.LogLevel.Debug)
    // .withUrl("http://localhost:5000/decisionHub", {
    //   skipNegotiation: true,
    //   transport: signalR.HttpTransportType.WebSockets
    // })
    // .build();

    // setConnection(connect);
    var connection = $.hubConnection('http://localhost:6118');
    var proxy = connection.createHubProxy('chathub');

    console.log(proxy);

    proxy.on('broadcastNotification', handleEvent);

    // atempt connection, and handle errors
    connection.start({ transport: ['webSockets', 'longPolling'] })
      .done(function () { console.log('Now connected, connection ID=' + connection.id); })
      .fail(function (param) { console.log('Could not connect'); console.log(param); });

    return () => proxy.off('broadcastNotification', handleEvent);

  }, [selectedProducts]);

  const handleEvent = function (arg) {
    onComplete(arg);
  };

  // useEffect(() => {
  //   if (connection) {
  //     connection
  //       .start()
  //       .then(() => {
  //         connection.on("ReceiveBarcode", (message) => {
  //           setPost(message);
  //         });
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // }, [connection]);

  // useEffect(() => {
  //   axios.get('http://localhost:8000/POS/GetPOSString')
  //     .then(response => {
  //       setPost(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, []);


  const priceFormatter = (cell) => {
    return (
      <span>
        $
        <span style={{ textalign: 'right' }}>{cell}</span> Per Unit
      </span>
    );
  };

  // const barcodeFormatter = (cell) => {
  //   return (
  //     <span >
  //       <Barcode height='30' value={cell} />
  //     </span>
  //   );
  // };
  const onComplete1 = (barcode) => {
    fetch(`http://localhost:3001/products/${barcode}`).then(response => response.json()).then(data => {
      console.log("data",data);
    });
  }

  const onComplete = (barcode) => {
   
    var existingProduct = selectedProducts.find(f => f.barcode_id === barcode);
    if (existingProduct) {
      selectedProducts.forEach(p => {
        if (p.barcode_id === barcode) {
          p.quantity++;
          setcurrentProduct(p);
        }
      });

      setproducts([...selectedProducts]);
      return;
    }
    fetch(`http://localhost:3001/products/${barcode}`).then(response => response.json()).then(data => {
      console.log("data",data);
      var p = masterProducts.filter(f => f.barcode_id === barcode);
    
      if(p.length)
      {
       let updatedProduct= p.map((product)=>({
          ...product,
          discountedPrice:CalculateDiscountedPrice(product.price,product.discount)
        }));
        
        setcurrentProduct(data);
        setproducts([...updatedProduct, ...selectedProducts]);
        
      }
    });
    /*var p = masterProducts.filter(f => f.barcode_id === barcode);
    
    if(p.length)
    {
     let updatedProduct= p.map((product)=>({
        ...product,
        discountedPrice:CalculateDiscountedPrice(product.price,product.discount)
      }));
      console.log("u",updatedProduct[0])
      setcurrentProduct(updatedProduct[0]);
      setproducts([...updatedProduct, ...selectedProducts]);
      console.log(selectedProducts);
    }*/

  }
  
  const CalculateDiscountedPrice = (price,discount) =>{
    return (price-(price*discount/100));
  };
     
    
  const totalPrice = () =>
    selectedProducts.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    )

  const totalProducts = () =>
    selectedProducts.reduce(
      (sum, product) => sum + product.quantity,
      0
    )

  const emptyItem = () => {
    return (<div style={{ display: 'flex', flexDirection: 'column', width: '40%', margin: '0 auto', textAlign: 'center' }}>
      <h1>Please start scanning</h1>
    </div>)
  };

  const itemTemplate = () => {
    console.log(currentProduct);
    return (<div style={{ display: 'flex', flexDirection: 'row', width: '40%', margin: '0 auto', borderRight: '1px solid grey' }}>
      <div style={{ minWidth: '260px' }}><img width='260' alt='' src={currentProduct?.Image}></img></div>
      <div style={{ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', marginLeft: '10px', textAlign: 'left' }}>
        <div>#{currentProduct?.barcode_id || ''}</div>
        <div style={{ fontWeight: 'bold', fontSize: '22px' }}>{currentProduct?.name || ''}</div>
        <div style={{ fontWeight: 'bold' }}>Price: ${currentProduct?.price || ''}</div>
        <div style={{ fontWeight: 'bold' }}>Discount: {currentProduct?.discount || ''}%</div>
        <div style={{ fontWeight: 'bold' }}>Description:{currentProduct?.description || ''}</div>
      </div>
    </div>)
  };

  const itemList = () => {
    return (<div style={{ display: 'flex', flexDirection: 'column', margin: '0 auto', minHeight: '100px', width:'100%' }}> <p style={{ display: 'flex', fontWeight: 'bold', fontSize: '22px' }}>{totalProducts()} Items</p>
      <DataGrid style={{ display: 'flex' }} rows={selectedProducts} columns={columns} hideFooter hideHeader />
      <button style={{ fontWeight: 'bold', height: '50px', fontSize: '22px', verticalAlign: 'middle', backgroundColor: 'darkgray', border: 'none' }}>Pay {'$' + totalPrice()}</button>
    </div>)
  }
  const componentRef = useRef();
  return (
    <div>


      {!currentProduct && !selectedProducts.length && emptyItem()}
      {selectedProducts.length && (<div className="App" style={{ display: 'flex', flexDirection: 'row', width: '80%', margin: '30px auto' }}>
        {!!currentProduct && itemTemplate()}

        <div style={{ display: 'flex', flexDirection: 'column', width: '50%', margin: '0 auto' }}>
          {itemList()} <div style={{ display: 'flex', marginLeft: 'auto', marginRight: '60px', marginTop: '20px' }} ><PrintComponent products={selectedProducts} /></div>

        </div>

        {/* <ReactToPrint
          content={reactToPrintContent}
          documentTitle="AwesomeFileName"
        /> */}
      </div >)}

    </div>
  );
}

export default App;