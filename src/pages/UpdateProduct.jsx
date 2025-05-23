
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { PuplicRequest } from "../utils/requestMethod.js";
// import { toast } from "react-toastify";

// function UpdateProduct() {
//   const [product, setProduct] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const { id } = useParams();

//   const [inputs, setInputs] = useState({})

//   const handleChange = (e) => {
//     setInputs((prev) => {
//       return { ...prev, [e.target.name]: e.target.value }
//     })
//   }
//   // جلب المنتج
//   useEffect(() => {
//     const getProduct = async () => {
//       try {
//         const res = await PuplicRequest.get(`/product/one/${id}`);
//         setProduct(res.data.product);
//       } catch (err) {
//         toast.error("فشل في جلب المنتج");
//       }
//     };
//     getProduct();
//   }, [id]);

//   // جلب الفئات
//   useEffect(() => {
//     const getCategories = async () => {
//       try {
//         const res = await PuplicRequest.get(`/category`);
//         setCategories(res.data.categories);
//       } catch (err) {
//         console.error("خطأ في تحميل الفئات:", err);
//       }
//     };
//     getCategories();
//   }, []);

//   // تحديث المنتج
//   const handleUpdate = async () => {
//     try {
//       console.log(inputs);
//       const res = await PuplicRequest.patch(`/product/${id}`, inputs);
//       console.log(res);

//       toast.success("تم التحديث بنجاح");

//     } catch (err) {
//       toast.error("فشل في تحديث المنتج");
//     }
//   };

//   if (!product) return <p className="text-center">جارٍ تحميل البيانات...</p>;

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">تعديل المنتج</h2>
//       <div className="row justify-content-center">
//         <div className="col-md-8">

//           <div className="mb-3">
//             <label className="form-label">اسم المنتج</label>
//             <input type="text" className="form-control" name="name" defaultValue={product.name} onChange={handleChange}/>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">السعر</label>
//             <input type="number" className="form-control" name="price" defaultValue={product.price} onChange={handleChange}/>
//           </div>

//           <div className="mb-3">
//             <label className="form-label">الفئة</label>
//             <select
//               className="form-select"
//             >
//               <option value="">اختر الفئة</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} name="category" defaultValue={cat.name} onChange={handleChange}>{cat.name}</option>
//               ))}
//             </select>
//           </div>


//           <div className="mb-3">
//             <label className="form-label">الوصف</label>
//             <textarea className="form-control"rows="3" name="description" defaultValue={product.description} onChange={handleChange}></textarea>
//           </div>

//           <div className="text-center">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handleUpdate}
//             >
//               حفظ التعديلات
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default UpdateProduct;




















import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PuplicRequest } from "../utils/requestMethod.js";
import { toast } from "react-toastify";

function UpdateProduct() {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();

  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // جلب المنتج
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await PuplicRequest.get(`/product/one/${id}`);
        const productData = res.data.product;
        setProduct(productData);

        // تعبئة البيانات المبدئية داخل inputs
        setInputs({
          name: productData.name,
          price: productData.price,
          category: productData.category._id, // حفظ الـ ID فقط
          description: productData.description,
        });
      } catch (err) {
        toast.error("فشل في جلب المنتج");
      }
    };
    getProduct();
  }, [id]);

  // جلب الفئات
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await PuplicRequest.get(`/category`);
        setCategories(res.data.categories);
      } catch (err) {
        console.error("خطأ في تحميل الفئات:", err);
      }
    };
    getCategories();
  }, []);

  // تحديث المنتج
  const handleUpdate = async () => {
    try {
      const res = await PuplicRequest.patch(`/product/${id}`, inputs);
      console.log(res);

      toast.success("تم التحديث بنجاح");
    } catch (err) {
      toast.error("فشل في تحديث المنتج");
    }
  };

  if (!product) return <p className="text-center">جارٍ تحميل البيانات...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">تعديل المنتج</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">اسم المنتج</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={inputs.name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">السعر</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={inputs.price || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">الفئة</label>
            <select
              className="form-select"
              name="category"
              value={inputs.category || ""}
              onChange={handleChange}
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">الوصف</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={inputs.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              حفظ التعديلات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
