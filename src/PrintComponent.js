import React, { useRef } from "react";
//import { Button } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "./ComponentToPrint";
export default function PrintComponent(props) {
    let componentRef = useRef();

    //console.log(props);

    return (
        <>
            <div>
                {/* button to trigger printing of target component */}
                <ReactToPrint
                    trigger={() => <button>Print Receipt</button>}
                    content={() => componentRef}
                />

                {/* component to be printed */}
                <div style={{ display: "none" }}>
                    <ComponentToPrint products={props.products} ref={(el) => (componentRef = el)} />
                </div>

            </div>
        </>
    );
}