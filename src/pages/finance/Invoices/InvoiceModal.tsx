import React from 'react'
import _ from 'lodash'

export default function InvoiceModal(props) {
    const { rowData } = props;
    console.log("rowData", rowData);

    const packageClasses = [
        {
            imgName: "custompersonal-training-Online.svg",
            numberOfClasses: rowData.package.ptonline
        },
        {
            imgName: "custompersonal-training-Offline.svg",
            numberOfClasses: rowData.package.ptoffline
        },
        {
            imgName: "customgroup-Online.svg",
            numberOfClasses: rowData.package.grouponline
        },
        {
            imgName: "customgroup-Offline.svg",
            numberOfClasses: rowData.package.groupoffline
        },
        {
            imgName: "customclassic.svg",
            numberOfClasses: rowData.package.recordedclasses
        },

    ];



    const availablePackageClasses = _.reject(packageClasses, ["numberOfClasses", null]);
    
    const renderNumberClasses = () => {
        return availablePackageClasses.map((item, index) => {
            return <div className='text-center ml-3'>
                <img src={`./assets/${item.imgName}`} alt={item.imgName} />
                <p>{item.numberOfClasses}</p>
            </div>
        })

    }

    const renderPrices = () => {
        const totalNumberOfClasses = availablePackageClasses.reduce((acc, item) => acc + item.numberOfClasses, 0);
        const price = totalNumberOfClasses * rowData.package.fitnesspackagepricing[0].packagepricing[0].mrp
        return <>
            <p>{price.toLocaleString()}</p>
        </>
    }



    return (
        <div className=' container'>
            <div className='d-flex justify-content-between align-items-center px-4 py-3 ' style={{ backgroundColor: '#e4e4e499' }}>
                <div>
                    <h1>Invoice</h1>
                    <p><span className='font-weight-bold'>Invoice No.</span>: 10101010 </p>
                    <p><span className='font-weight-bold'>Date</span>: {rowData.bookingDate}</p>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center px-4  mt-5">
                <div>
                    <p><span className='font-weight-bold'>Package: </span>{rowData.packageName}</p>
                    <p><span className='font-weight-bold'>Duration: </span>{rowData.duration} Day(s)</p>
                    <p><span className='font-weight-bold'>Start Date: </span>{rowData.effective}</p>
                    <p><span className='font-weight-bold'>End Date: </span>{rowData.expiry}</p>
                </div>

                <div className='text-right' style={{ width: "40%" }}>
                    <h3>Client — {rowData.client || "No Client Name"}</h3>

                    {typeof (rowData.clientAddress) === "object" ? rowData.clientAddress.map((item => {
                        return <p>{item.address1} {item.city},{item.state} {item.zipcode}, {item.country}</p>
                    })) : "No Address"}

                    <p>{rowData.clientPhoneNumber || "No Phone Number"}</p>
                </div>
            </div>


            <div className='px-4 my-4' >
                <div className="d-flex justify-content-between align-items-center mt-5 mb-3" style={{ backgroundColor: '#e4e4e499' }}>
                    <p className='font-weight-bold m-1'>Service</p>
                    <p className='font-weight-bold m-1'>Cost</p>
                </div>

                <div className="d-flex justify-content-between align-items-center py-4" style={{ borderBottom: '1px solid gray' }}>
                    <div className="d-flex justify-content-center align-items-center">
                        <p className='font-weight-bold'>Movement</p>
                        {renderNumberClasses()}
                    </div>
                    {renderPrices()}
                </div>
            </div>

            <div className='text-right w-50 mx-4 mb-5 ml-auto '>
                <div className="d-flex justify-content-between align-items-center">
                    <p>Subtotal:</p>
                    <p>$108.00</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p>Discount:</p>
                    <p>$-8.00</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p>GST:</p>
                    <p>$18%</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <p className='font-weight-bold'>Invoice Total:</p>
                    <p className='font-weight-bold'>$120.00</p>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid gray', marginTop: '10rem' }}>
                <div>
                    <p className='mb-0 font-weight-bold'>Contact Changemaker</p>
                    <p>{rowData.userInfo.Firstname || "Missing first name"} {rowData.userInfo.Lastname || "Missing last name"}</p>
                </div>
                <p>www.abc.com</p>
                <p>{rowData.userInfo.email || "Missing Email"}</p>
                <p>{rowData.userInfo.Phone || "Missing Phone"}</p>
            </div>

        </div>
    )
}
