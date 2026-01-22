import React, { useState, useEffect } from "react";
import axios from "axios";

// تعريف مسار الـ API الأساسي لضمان عرض الصور بشكل صحيح
const API_BASE = "https://check-in-sy.com";

const DriversAndCars = () => {
  const [drivers, setDrivers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- فورم السائق ---
  const [form, setForm] = useState({
    id: null,
    service_id: "",
    driver_name: "",
    driver_phone: "",
    car_color: "",
    car_plate_number: "",
    car_model: "",
    driver_image: null, // سيتم تخزين الملف هنا
  });

  // سيتم تخزين URL للمعاينة أو مسار الصورة الحالي هنا
  const [previewImage, setPreviewImage] = useState(null); 

  // ---------------------- Fetch Data ----------------------
  useEffect(() => {
    fetchDrivers();
    fetchServices();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`/api/drivers`);
      setDrivers(res.data.drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
    setLoading(false);
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`/api/transports/admin/transport/services`);
      setServices(res.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // ---------------------- Handle Change ----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, driver_image: file });
    if (file) {
      // معاينة الصورة الجديدة من الملف
      setPreviewImage(URL.createObjectURL(file)); 
    } else {
      setPreviewImage(null);
    }
  };

  // ---------------------- Submit (Create/Update) ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (key !== 'id' && form[key] !== null && form[key] !== "") {
        if (key === 'driver_image' && form.driver_image instanceof File) {
          data.append(key, form[key]);
        } else if (key !== 'driver_image') {
          data.append(key, form[key]);
        }
      }
    });

    try {
      if (form.id) {
        // 🔹 مسار التعديل منفصل
        await axios.put(`/api/drivers/${form.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("تم التعديل بنجاح");
      } else {
        // 🔹 مسار الإنشاء
        await axios.post(`/api/drivers`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("تم إنشاء السائق");
      }
      resetForm();
      fetchDrivers();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert("حدث خطأ. تحقق من الكونسول للمزيد من التفاصيل.");
    }
  };

  // ---------------------- Edit ----------------------
  const handleEdit = (driver) => {
    setForm({
      id: driver.id,
      service_id: driver.service_id,
      driver_name: driver.driver_name,
      driver_phone: driver.driver_phone,
      car_color: driver.car_color,
      car_plate_number: driver.car_plate_number,
      car_model: driver.car_model,
      driver_image: null, // نضعها null لمنع إرسال مسار الصورة القديم كملف جديد.
    });
    
    if (driver.driver_image) {
      const imageUrl = driver.driver_image.startsWith('/') 
                       ? `$${driver.driver_image}` 
                       : `$/${driver.driver_image}`;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  };

  // ---------------------- Delete ----------------------
  const deleteDriver = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/api/drivers/${id}`);
      fetchDrivers();
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  // ---------------------- Reset ----------------------
  const resetForm = () => {
    setForm({
      id: null,
      service_id: "",
      driver_name: "",
      driver_phone: "",
      car_color: "",
      car_plate_number: "",
      car_model: "",
      driver_image: null,
    });
    setPreviewImage(null);
  };

  // دالة مساعدة للحصول على اسم الخدمة من الـ ID
  const getServiceName = (serviceId) => {
    const service = services.find(srv => srv.id === serviceId);
    return service ? service.name_ar : 'غير معروف';
  };

  if (loading) return <div>جارِ التحميل...</div>;

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>إدارة السائقين و السيارات</h2>

      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>{form.id ? "تعديل سائق" : "إضافة سائق جديد"}</h3>

        <select name="service_id" value={form.service_id} onChange={handleChange} required style={styles.input}>
          <option value="">اختر نوع الخدمة</option>
          {services.map((srv) => (
            <option key={srv.id} value={srv.id}>
              {srv.name_ar}
            </option>
          ))}
        </select>

        <input type="text" name="driver_name" placeholder="اسم السائق" value={form.driver_name} onChange={handleChange} required style={styles.input} />
        <input type="text" name="driver_phone" placeholder="رقم السائق" value={form.driver_phone} onChange={handleChange} style={styles.input} />
        <input type="text" name="car_color" placeholder="لون السيارة" value={form.car_color} onChange={handleChange} style={styles.input} />
        <input type="text" name="car_plate_number" placeholder="رقم اللوحة" value={form.car_plate_number} onChange={handleChange} style={styles.input} />
        <input type="text" name="car_model" placeholder="موديل السيارة" value={form.car_model} onChange={handleChange} style={styles.input} />

        <p style={{ marginTop: 10, marginBottom: 5 }}>صورة السائق (اتركها فارغة للحفاظ على الصورة الحالية):</p>
        <input type="file" onChange={handleImageChange} style={styles.input} />

        {previewImage && (
          <img src={previewImage} alt="preview" style={{ width: 100, borderRadius: 8, marginTop: 10 }} />
        )}

        <button type="submit" style={{ ...styles.btn, marginTop: 15 }}>
          {form.id ? "حفظ التعديلات" : "إضافة"}
        </button>

        {form.id && <button onClick={resetForm} style={styles.cancelBtn}>إلغاء التعديل</button>}
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>الصورة</th>
            <th>الاسم</th>
            <th>الخدمة</th>
            <th>الهاتف</th>
            <th>السيارة</th>
            <th>تحكم</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((dr) => (
            <tr key={dr.id}>
              <td>
                {dr.driver_image ? (
                  <img 
                    src={dr.driver_image.startsWith('/') 
                      ? `${API_BASE}${dr.driver_image}` 
                      : `${API_BASE}/${dr.driver_image}`} 
                    alt="Driver" 
                    style={{ width: 60, borderRadius: 6 }} 
                  />
                ) : "—"}
              </td>
              <td>{dr.driver_name}</td>
              <td>{getServiceName(dr.service_id)}</td>
              <td>{dr.driver_phone}</td>
              <td>{dr.car_model} - {dr.car_color} - {dr.car_plate_number}</td>
              <td>
                <button onClick={() => handleEdit(dr)} style={styles.smallBtn}>تعديل</button>
                <button onClick={() => deleteDriver(dr.id)} style={styles.delBtn}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    direction: "rtl",
    fontFamily: 'Tahoma, Arial, sans-serif'
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    background: "#f7f7f7",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  btn: {
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    alignSelf: 'flex-start'
  },
  cancelBtn: {
    marginLeft: 10,
    padding: "10px 20px",
    background: "#999",
    color: "#fff",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    alignSelf: 'flex-start'
  },
  smallBtn: {
    padding: "5px 10px",
    background: "#28a745",
    color: "#fff",
    borderRadius: 6,
    marginRight: 5,
    cursor: "pointer",
    border: "none",
  },
  delBtn: {
    padding: "5px 10px",
    background: "#dc3545",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    border: "none",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "right",
  },
  'table th, table td': {
    padding: '10px',
    border: '1px solid #ddd',
  },
  'table th': {
    backgroundColor: '#f2f2f2',
  }
};

export default DriversAndCars;
