

import React, { use, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PuplicRequest } from '../utils/requestMethod';

function OneProduct() {

    const [product, setProduct] = useState([])
    const { id } = useParams();

    useEffect(() => {
    const getProduct = async () => {
        
        try {
            const res = await PuplicRequest.get(`/product/one/${id}`);
            setProduct(res.data.product);
        } catch (err) {
            console.error("خطأ أثناء جلب المنتج:", err);
        }
    };

    getProduct();
}, []);
    return (
        <div className="container my-5">
            <div className="row align-items-center" style={{ maxWidth: '900px', margin: 'auto' }}>
                <div className="col-md-7 pe-4">
                    <h2 className="fw-bold mb-3" style={{ color: '#09c' }}>{product.name}</h2>
                    <h4 className="text-danger mb-4">{product.price} EGP</h4>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#fff' }}>
                        {product.description}.
                    </p>
                    <Link to={"/orders"}>
                        <button
                            className="btn btn-lg mt-3"
                            style={{ borderRadius: '30px', padding: '10px 30px', backgroundColor: '#09c', border: 'none', color: 'black' }}
                        >
                            ADD TO ORDER🛒
                        </button>
                    </Link>
                </div>


                <div className="col-md-5">
                    <img
                        src={product.image}
                        alt="قهوة عربية"
                        className="img-fluid rounded"
                        style={{ objectFit: 'cover', height: '300px', width: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OneProduct;
