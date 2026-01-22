import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin-services-offers.css";

// تأكد من البورت مطابق للسيرفر


// ===================== Helper =====================
/**
 * توليد رابط الصورة الكامل مع التعامل مع مصفوفة المسارات
 * @param {string | string[] | null} imagePath - مسار (أو مصفوفة مسارات) الصورة من السيرفر.
 * @returns {string | null} رابط URL الكامل للصورة الأولى أو null.
 */ 
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // إذا كانت البيانات الواردة مصفوفة، نأخذ العنصر الأول
    const url = Array.isArray(imagePath) ? imagePath[0] : imagePath;

    if (!url) return null;

    // إذا كان الرابط كاملاً، نرجعه كما هو، وإلا نضيف البادئة
return url.startsWith("http://") || url.startsWith("https://") ? url : `https://check-in-sy.com/${url}`;

};


// ===================== Main Component =====================
export default function AdminServicesOffers() {
    const API_BASE = "https://check-in-sy.com/api";
    const [tab, setTab] = useState("services"); // 'services' or 'offers'

    // Paid services state
    const [services, setServices] = useState([]);
    const [svcLoading, setSvcLoading] = useState(false);
    const [svcError, setSvcError] = useState(null);

    // Special offers state
    const [offers, setOffers] = useState([]);
    const [offLoading, setOffLoading] = useState(false);
    const [offError, setOffError] = useState(null);

    // Forms / modals
    const [showSvcForm, setShowSvcForm] = useState(false);
    const [svcEdit, setSvcEdit] = useState(null);
    const [showOffForm, setShowOffForm] = useState(false);
    const [offEdit, setOffEdit] = useState(null);

    // Filters
    const [svcQuery, setSvcQuery] = useState("");
    const [offQuery, setOffQuery] = useState("");

    useEffect(() => {
        fetchServices();
        fetchOffers();
    }, []);

    // ===================== Paid Services API =====================
    const fetchServices = async () => {
        setSvcLoading(true);
        setSvcError(null);
        try {
        const res = await axios.get(`${API_BASE}/paid-services`);
            
            // 🛑🛑🛑 التعديل الرئيسي هنا: تحويل حقل images من نص JSON إلى مصفوفة 🛑🛑🛑
            const processedServices = res.data.map(service => {
                if (typeof service.images === 'string') {
                    try {
                        service.images = JSON.parse(service.images);
                    } catch (e) {
                        // في حالة فشل التحويل (إذا لم يكن JSON صالحًا)
                        service.images = []; 
                    }
                } else if (!Array.isArray(service.images)) {
                    // للتأكد من أنها مصفوفة حتى لو لم تكن نصًا
                    service.images = []; 
                }
                return service;
            });
            // 🛑🛑🛑 نهاية التعديل 🛑🛑🛑

            setServices(processedServices || []);
        } catch (err) {
            console.error(err);
            setSvcError(err.message || "خطأ في جلب الخدمات");
        } finally {
            setSvcLoading(false);
        }
    };

    const createService = async (formData) => {
  try {
    // لا تضبط headers هنا — axios/المتصفح يضبطونها تلقائياً مع boundary
    // جرب أولاً POST إلى /paid-services (بدون /create)
    const res = await axios.post(`${API_BASE}/paid-services/create`, formData);
    // لو سيرفرك يطلب /create، غيّر لـ `${API_BASE}/paid-services/create`
    fetchServices();
    setShowSvcForm(false);
    return res;
  } catch (err) {
    console.error("createService error:", err);
    console.error("server response:", err?.response?.status, err?.response?.data);
    alert("فشل إنشاء الخدمة: " + (err?.response?.data?.message || err.message));
    throw err;
  }
};

const updateService = async (id, formData) => {
  try {
    // لا تضبط headers يدوياً
    const res = await axios.put(`${API_BASE}/paid-services/${id}`, formData);
    fetchServices();
    setShowSvcForm(false);
    setSvcEdit(null);
    return res;
  } catch (err) {
    console.error("updateService error:", err);
    console.error("server response:", err?.response?.status, err?.response?.data);
    alert("فشل تعديل الخدمة: " + (err?.response?.data?.message || err.message));
    throw err;
  }
};

const deleteService = async (id) => {
  if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الخدمة؟")) return;
  try {
    const res = await axios.delete(`${API_BASE}/paid-services/${id}`);
    fetchServices();
    return res;
  } catch (err) {
    console.error("deleteService error:", err);
    console.error("server response:", err?.response?.status, err?.response?.data);
    alert("فشل حذف الخدمة: " + (err?.response?.data?.message || err.message));
    throw err;
  }
};

    // ===================== Special Offers API (بدون تغيير) =====================
    const fetchOffers = async () => {
        setOffLoading(true);
        setOffError(null);
        try {
        const res = await axios.get(`${API_BASE}/special-offers`);
            setOffers(res.data || []);
        } catch (err) {
            console.error(err);
            setOffError(err.message || "خطأ في جلب العروض");
        } finally {
            setOffLoading(false);
        }
    };

    const createOffer = async (formData) => {
        try {
           await axios.post(`${API_BASE}/special-offers`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchOffers();
            setShowOffForm(false);
        } catch (err) {
            console.error(err);
            alert("فشل إنشاء العرض: " + (err?.response?.data?.message || err.message));
        }
    };

    const updateOffer = async (id, formData) => {
        try {
           await axios.put(`${API_BASE}/special-offers/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            fetchOffers();
            setShowOffForm(false);
            setOffEdit(null);
        } catch (err) {
            console.error(err);
            alert("فشل تعديل العرض: " + (err?.response?.data?.message || err.message));
        }
    };

    const deleteOffer = async (id) => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا العرض؟")) return;
        try {
            await axios.delete(`${API_BASE}/special-offers/${id}`);
            fetchOffers();
        } catch (err) {
            console.error(err);
            alert("فشل حذف العرض: " + (err?.response?.data?.message || err.message));
        }
    };

    // ===================== Filtering =====================
    const filteredServices = services.filter((s) => {
        const q = svcQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            String(s.id).includes(q) ||
            (s.name || "").toLowerCase().includes(q) ||
            (s.description || "").toLowerCase().includes(q)
        );
    });

    const filteredOffers = offers.filter((o) => {
        const q = offQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            String(o.id).includes(q) ||
            (o.title || "").toLowerCase().includes(q) ||
            (o.description || "").toLowerCase().includes(q) ||
            (o.type || "").toLowerCase().includes(q)
        );
    });

    // ===================== Render =====================
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">لوحة التحكم — الخدمات و العروض</h2>
                    <div className="space-x-2">
                        <button
                            onClick={() => setTab("services")}
                            className={`px-3 py-1 rounded ${tab === "services" ? "bg-blue-600 text-white" : "bg-white border"}`}
                        >
                            الخدمات المدفوعة
                        </button>
                        <button
                            onClick={() => setTab("offers")}
                            className={`px-3 py-1 rounded ${tab === "offers" ? "bg-blue-600 text-white" : "bg-white border"}`}
                        >
                            العروض الخاصة
                        </button>
                    </div>
                </header>

                {/* Services Tab */}
                {tab === "services" && (
                    <section className="bg-white rounded shadow p-4">
                        <ServiceTab
                            services={filteredServices}
                            loading={svcLoading}
                            error={svcError}
                            onAdd={() => { setSvcEdit(null); setShowSvcForm(true); }}
                            onEdit={(s) => { setSvcEdit(s); setShowSvcForm(true); }}
                            onDelete={deleteService}
                            query={svcQuery}
                            setQuery={setSvcQuery}
                            fetch={fetchServices}
                            showForm={showSvcForm}
                            setShowForm={setShowSvcForm}
                            editItem={svcEdit}
                            create={createService}
                            update={updateService}
                        />
                    </section>
                )}

                {/* Offers Tab */}
                {tab === "offers" && (
                    <section className="bg-white rounded shadow p-4">
                        <OffersTab
                            offers={filteredOffers}
                            loading={offLoading}
                            error={offError}
                            onAdd={() => { setOffEdit(null); setShowOffForm(true); }}
                            onEdit={(o) => { setOffEdit(o); setShowOffForm(true); }}
                            onDelete={deleteOffer}
                            query={offQuery}
                            setQuery={setOffQuery}
                            fetch={fetchOffers}
                            showForm={showOffForm}
                            setShowForm={setShowOffForm}
                            editItem={offEdit}
                            create={createOffer}
                            update={updateOffer}
                        />
                    </section>
                )}
            </div>
        </div>
    );
}

// ===================== Modal (بدون تغيير) =====================
function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-600 px-2">إغلاق ✖</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}

// ===================== Service Tab =====================
function ServiceTab({ services, loading, error, onAdd, onEdit, onDelete, query, setQuery, fetch, showForm, setShowForm, editItem, create, update }) {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">قائمة الخدمات المدفوعة</h3>
                <div className="flex items-center gap-3">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في هذا الجدول" className="px-3 py-2 border rounded" />
                    <button onClick={onAdd} className="px-4 py-2 bg-green-600 text-white rounded">إضافة خدمة</button>
                    <button onClick={fetch} className="px-3 py-2 border rounded">تحديث</button>
                </div>
            </div>

            {loading ? <div>جاري التحميل...</div> : error ? <div className="text-red-600">{error}</div> :
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">الاسم</th>
                                <th className="p-2 text-left">الوصف</th>
                                <th className="p-2 text-left">السعر</th>
                                <th className="p-2 text-left">الصورة</th>
                                <th className="p-2 text-left">مفعل</th>
                                <th className="p-2 text-left">إجراﺀات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {services.length === 0 ? (
                                <tr><td colSpan={7} className="p-4 text-center">لا توجد نتائج</td></tr>
                            ) : services.map(s => (
                                <tr key={s.id}>
                                    <td className="p-2">{s.id}</td>
                                    <td className="p-2">{s.name}</td>
                                    <td className="p-2">{s.description}</td>
                                    <td className="p-2">{s.price}</td>
                                    {/* **استخراج المسار الأول من s.images للعرض** */}
                                    <td className="p-2">
                                        {/* بعد التعديل في fetchServices، s.images هي الآن مصفوفة فعلية أو [] */}
                                        {s.images && s.images.length > 0 ? (
                                            <img 
                                                src={getImageUrl(s.images[0])} 
                                                alt={s.name} 
                                                className="h-12 w-20 object-cover rounded" 
                                            />
                                        ) : (
                                            <span className="text-gray-500">لا توجد صورة</span>
                                        )}
                                    </td>
                                    <td className="p-2">{s.active ? 'نعم' : 'لا'}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <button onClick={() => onEdit(s)} className="px-2 py-1 border rounded">تعديل</button>
                                            <button onClick={() => onDelete(s.id)} className="px-2 py-1 bg-red-600 text-white rounded">حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            {showForm && (
                <Modal onClose={() => { setShowForm(false); }}>
                    <ServiceForm
                        initial={editItem}
                        onCancel={() => { setShowForm(false); }}
                        onSubmit={async (formData) => {
                            if (editItem) await update(editItem.id, formData);
                            else await create(formData);
                        }}
                    />
                </Modal>
            )}
        </>
    );
}

// ===================== Offers Tab (بدون تغيير) =====================
function OffersTab({ offers, loading, error, onAdd, onEdit, onDelete, query, setQuery, fetch, showForm, setShowForm, editItem, create, update }) {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">قائمة العروض الخاصة</h3>
                <div className="flex items-center gap-3">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في هذا الجدول" className="px-3 py-2 border rounded" />
                    <button onClick={onAdd} className="px-4 py-2 bg-green-600 text-white rounded">إضافة عرض</button>
                    <button onClick={fetch} className="px-3 py-2 border rounded">تحديث</button>
                </div>
            </div>

            {loading ? <div>جاري التحميل...</div> : error ? <div className="text-red-600">{error}</div> :
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">العنوان</th>
                                <th className="p-2 text-left">الوصف</th>
                                <th className="p-2 text-left">السعر</th>
                                <th className="p-2 text-left">الصورة</th>
                                <th className="p-2 text-left">نوع</th>
                                <th className="p-2 text-left">إجراﺀات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {offers.length === 0 ? (
                                <tr><td colSpan={7} className="p-4 text-center">لا توجد نتائج</td></tr>
                            ) : offers.map(o => (
                                <tr key={o.id}>
                                    <td className="p-2">{o.id}</td>
                                    <td className="p-2">{o.title}</td>
                                    <td className="p-2">{o.description}</td>
                                    <td className="p-2">{o.price}</td>
                                    <td className="p-2">
                                        {o.image_url ? <img src={getImageUrl(o.image_url)} alt={o.title} className="h-12 w-20 object-cover rounded" /> : <span className="text-gray-500">لا توجد صورة</span>}
                                    </td>
                                    <td className="p-2">{o.type}</td>
                                    <td className="p-2">
                                        <div className="flex gap-2">
                                            <button onClick={() => onEdit(o)} className="px-2 py-1 border rounded">تعديل</button>
                                            <button onClick={() => onDelete(o.id)} className="px-2 py-1 bg-red-600 text-white rounded">حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            {showForm && (
                <Modal onClose={() => setShowForm(false)}>
                    <OfferForm
                        initial={editItem}
                        onCancel={() => setShowForm(false)}
                        onSubmit={async (formData) => {
                            if (editItem) await update(editItem.id, formData);
                            else await create(formData);
                        }}
                    />
                </Modal>
            )}
        </>
    );
}

// ===================== Service Form =====================
function ServiceForm({ initial, onCancel, onSubmit }) {
    const [name, setName] = useState(initial?.name || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [price, setPrice] = useState(initial?.price || "");
    const [active, setActive] = useState(Boolean(initial?.active));
    const [image, setImage] = useState(null); 

    const getInitialPreview = () => {
        if (!initial?.images) return null;
        // هنا s.images هي مصفوفة بسبب التعديل في fetchServices
        const url = Array.isArray(initial.images) ? initial.images[0] : initial.images; 
        return getImageUrl(url);
    }

    const [preview, setPreview] = useState(getInitialPreview()); 
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!image) return;
        const url = URL.createObjectURL(image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

  const submit = async (e) => {
    e.preventDefault();

    if (!name || price === "") return alert("الحقول المطلوبة ناقصة");
    if (!initial && !image) return alert("الرجاء اختيار صورة للخدمة الجديدة");

    setSaving(true);

    try {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("description", description);
        fd.append("price", price);
        fd.append("active", active ? 1 : 0);

        // 🌟 إرسال مسارات الصور السابقة عند التعديل إذا لم يتم رفع ملف جديد
        if (initial?.images && initial.images.length > 0 && !image) {
            fd.append("existing_images", JSON.stringify(initial.images));
        }

        // إرسال ملف الصورة الجديدة
        if (image) fd.append("images", image);

        // === Debug: طباعة كل الحقول قبل الإرسال ===
        console.log("[ServiceForm] Original FormData:");
        for (const [key, value] of fd.entries()) {
            console.log(key, value);
        }

        // === Sanitize: السماح فقط بالحقلات المسموح فيها ===
        const allowedFields = ["name", "description", "price", "active", "existing_images", "images"];
        const sanitizedFd = new FormData();
        for (const [key, value] of fd.entries()) {
            if (allowedFields.includes(key)) {
                sanitizedFd.append(key, value);
            } else {
                console.warn("[ServiceForm] Removed field:", key);
            }
        }

        // إرسال البيانات sanitized فقط
        await onSubmit(sanitizedFd);
    } finally {
        setSaving(false);
    }
};

    return (
        <form onSubmit={submit} className="space-y-3">
            <h4 className="text-lg font-medium">{initial ? "تعديل الخدمة" : "إضافة خدمة"}</h4>
            <div className="grid grid-cols-2 gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" className="p-2 border rounded" />
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر" className="p-2 border rounded" type="number" step="0.01" />
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> مفعل
                </label>
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="الوصف" className="w-full p-2 border rounded" rows={4} />
            {/* حقل اختيار الصورة ومعاينتها */}
            <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3 py-2 border rounded">اختر صورة
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" />
                </label>
                {preview && <img src={preview} alt="preview" className="h-16 w-24 object-cover rounded" />}
                {initial && !image && <span className="text-sm text-gray-500">لترك الصورة الحالية، لا تختار ملفًا جديدًا.</span>}
            </div>
            
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">إلغاء</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "جارٍ الحفظ..." : "حفظ"}</button>
            </div>
        </form>
    );
}

// ===================== Offer Form (بدون تغيير) =====================
function OfferForm({ initial, onCancel, onSubmit }) {
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [price, setPrice] = useState(initial?.price || "");
    const [notes, setNotes] = useState(initial?.notes || "");
    const [type, setType] = useState(initial?.type || "other");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(initial?.image_url ? getImageUrl(initial.image_url) : null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!image) return;
        const url = URL.createObjectURL(image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const submit = async (e) => {
        e.preventDefault();
        if (!title) return alert("العنوان مطلوب");
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("title", title);
            fd.append("description", description);
            fd.append("price", price);
            fd.append("notes", notes);
            fd.append("type", type);
            if (image) fd.append("image", image);

            await onSubmit(fd);
        } finally { setSaving(false); }
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <h4 className="text-lg font-medium">{initial ? "تعديل العرض" : "إضافة عرض"}</h4>
            <div className="grid grid-cols-2 gap-2">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان" className="p-2 border rounded" />
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر" className="p-2 border rounded" type="number" step="0.01"/>
                <input value={type} onChange={(e) => setType(e.target.value)} placeholder="النوع" className="p-2 border rounded" />
                <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات" className="p-2 border rounded" />
                
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="الوصف" className="w-full p-2 border rounded" rows={3} />
            <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3 py-2 border rounded">اختر صورة
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="hidden" />
                </label>
                {preview && <img src={preview} alt="preview" className="h-16 w-24 object-cover rounded" />}
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">إلغاء</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "جارٍ الحفظ..." : "حفظ"}</button>
            </div>
        </form>
    );
}