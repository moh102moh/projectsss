'use client';
import { useState } from 'react';
import styles from '../BookingForm.module.css'; 

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+966',
    phone: '',
    service: '',
    description: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage('');

    const fullPhone = `${formData.phoneCode}${formData.phone}`;
    const dataToSend = { ...formData, phone: fullPhone };

    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const contentType = res.headers.get('content-type');
      let responseMessage = '✅ تم الإرسال بنجاح.';

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '❌ فشل في إرسال البيانات.');
        responseMessage = data.message || responseMessage;
      } else if (!res.ok) {
        throw new Error('❌ فشل في إرسال البيانات.');
      }

      setStatusMessage(responseMessage);

      
      setFormData({
        name: '',
        email: '',
        phoneCode: '+966',
        phone: '',
        service: '',
        description: '',
      });
    } catch (error) {
      setStatusMessage(error.message || '❌ تعذر إرسال الطلب. حاول لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1> حجز الخدمة</h1>

      {statusMessage && (
        <div className={styles.statusMessage}>
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="الاسم"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className={styles.phoneContainer}>
          <select
            name="phoneCode"
            value={formData.phoneCode}
            onChange={handleChange}
            required
          >
            <option value="+966">🇸🇦 +966</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+965">🇰🇼 +965</option>
            <option value="+964">🇮🇶 +964</option>
            <option value="+962">🇯🇴 +962</option>
            <option value="+20">🇪🇬 +20</option>
            <option value="+212">🇲🇦 +212</option>
            <option value="+218">🇱🇾 +218</option>
            <option value="+963">🇸🇾 +963</option>
            <option value="+961">🇱🇧 +961</option>
          </select>
          <input
            type="tel"
            name="phone"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="">اختر الخدمة</option>
          <option value="تصميم مواقع">تصميم مواقع</option>
          <option value="تطوير تطبيقات">تطوير تطبيقات</option>
          <option value="استشارات تقنية">استشارات تقنية</option>
        </select>

        <textarea
          name="description"
          placeholder="وصف مختصر عن الطلب"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  );
}
