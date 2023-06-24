import React from "react";
import { DataGrid } from '@mui/x-data-grid';
export default class ComponentToPrint extends React.Component {

    render() {
        const priceFormatter = (cell) => {
            return (
                <span>
                    $
                    <span style={{ textalign: 'right' }}>{cell}</span> Per Unit
                </span>
            );
        };
        const totalPrice = () =>
            this.props.products.reduce(
                (sum, product) => sum + product.quantity * product.price,
                0
            )
        // console.log(this.props.products);
        const columns = [
            { field: 'name', headerName: '', width: 200 },
            { field: 'quantity', headerName: '', editable: true },
            {
                field: 'price', headerName: '',width:190, renderCell: (params) => {
                    return priceFormatter(params.value);
                }
            }
        ];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: '30px auto' }}>
                <div style={{ marginBottom:'15px', display: 'flex', fontSize: '22px', fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', width: '100%' }} >Receipt</div>
                <DataGrid style={{ display: 'flex' }} rows={this.props.products} columns={columns} hideFooter hideHeader />
                <button style={{ fontWeight: 'bold', height: '50px', fontSize: '22px', verticalAlign: 'middle', backgroundColor: 'darkgray', border: 'none' }}>Total {'$' + totalPrice()}</button>

            </div>
        );
    }
}
