import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/support/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await axios.put(
        `/api/support/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await fetchTickets();
    } catch (err) {
      alert("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">جارٍ تحميل الطلبات...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">طلبات الدعم الفني</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-right">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">المستخدم</th>
              <th className="p-2 border">البريد الإلكتروني</th>
              <th className="p-2 border">العنوان</th>
              <th className="p-2 border">الوصف</th>
              <th className="p-2 border">الحالة</th>
              <th className="p-2 border">تاريخ الإنشاء</th>
              <th className="p-2 border">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={t.id} className="hover:bg-gray-100">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{t.full_name || "—"}</td>
                <td className="p-2 border">{t.email || "—"}</td>
                <td className="p-2 border">{t.subject}</td>
                <td className="p-2 border">{t.description}</td>
                <td className="p-2 border">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      t.status === "open"
                        ? "bg-yellow-500"
                        : t.status === "in_progress"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                  >
                    {t.status === "open"
                      ? "مفتوح"
                      : t.status === "in_progress"
                      ? "قيد المعالجة"
                      : "تم المعالجة"}
                  </span>
                </td>
                <td className="p-2 border">
                  {new Date(t.created_at).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <select
                    disabled={updating}
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="open">مفتوح</option>
                    <option value="in_progress">قيد المعالجة</option>
                    <option value="closed">تم المعالجة</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
