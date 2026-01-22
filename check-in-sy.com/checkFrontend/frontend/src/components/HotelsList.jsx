import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HotelsList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 7;

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotls/");
      setHotels(data);
    } catch (err) {
      console.error(err);
      alert("❌ خطأ في تحميل قائمة الفنادق");
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/api/hotls/${id}`);
      alert("✅ تم الحذف بنجاح");
      fetchHotels();
    } catch {
      alert("❌ فشل الحذف");
    }
  };

const BASE_URL = "https://check-in-sy.com";

const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/100";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};


  useEffect(() => {
    fetchHotels();
  }, []);

  const indexOfLast = currentPage * hotelsPerPage;
  const indexOfFirst = indexOfLast - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  if (loading) return <p>⏳ جاري تحميل البيانات...</p>;

  return (
    <div className="hotels-list">
      <div className="header">
        <h2>🏨 قائمة الفنادق</h2>
        <Link to="/dashboard/hotels/add" className="btn add-btn">
          ➕ إضافة فندق
        </Link>
      </div>

      {hotels.length === 0 ? (
        <p>لا يوجد فنادق حالياً</p>
      ) : (
        <>
          <table className="table hotels-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الوصف</th>
                <th>المدينة</th>
                <th>العنوان</th>
                <th>النجوم</th>
                <th>الهاتف</th>
                <th>الإيميل</th>
                <th>الصورة</th>
                <th>اسم الصورة</th>
                <th>أدنى سعر</th>
                <th>أعلى سعر</th>
                <th>التحكم</th>
                <th>عرض</th>
              </tr>
            </thead>

            <tbody>
              {currentHotels.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.description}</td>
                  <td>{h.city}</td>
                  <td>{h.address}</td>
                  <td>{h.stars}</td>
                  <td>{h.phone}</td>
                  <td>{h.email}</td>

                  <td>
                    {h.main_image ? (
                      <img
                        src={getImageUrl(h.main_image)}
                        alt={h.name}
                        className="hotel-img"
                      />
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>{h.main_image ? h.main_image.split("/").pop() : "—"}</td>
                  <td>{h.min_price}</td>
                  <td>{h.max_price}</td>

                  <td className="actions">
                    <Link
                      to={`/dashboard/hotels/edit/${h.id}`}
                      className="btn small edit"
                    >
                      ✏️ تعديل
                    </Link>
                    <button
                      onClick={() => deleteHotel(h.id)}
                      className="btn small danger"
                    >
                      🗑 حذف
                    </button>
                  </td>

                  <td>
                    <Link
                      to={`/dashboard/hotels/view/${h.id}`}
                      className="btn small info"
                    >
                      🔍 عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="btn small"
            >
              ⬅️ السابق
            </button>

            <span className="page-info">
              الصفحة {currentPage} من {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="btn small"
            >
              التالي ➡️
            </button>
          </div>
        </>
      )}

      {/* CSS */}
      <style jsx>{`
        .hotels-list {
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          direction: rtl;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .header h2 {
          font-size: 22px;
          color: #333;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .table th {
          background: #007bff;
          padding: 10px;
          color: #fff;
          font-size: 14px;
        }

        .table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          font-size: 13px;
          vertical-align: middle;
        }

        .table tr:hover td {
          background: #f5faff;
        }

        .hotel-img {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .btn {
          padding: 7px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          color: #fff;
          transition: 0.2s;
          font-size: 13px;
        }

        .add-btn {
          background: #28a745;
        }

        .add-btn:hover {
          background: #1e7e34;
        }

        .small {
          padding: 5px 10px;
          font-size: 12px;
        }

        .edit {
          background: #ffc107;
          color: #333;
        }

        .edit:hover {
          background: #e0a800;
        }

        .danger {
          background: #dc3545;
        }

        .danger:hover {
          background: #b02a37;
        }

        .info {
          background: #17a2b8;
        }

        .info:hover {
          background: #117a8b;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
        }

        .page-info {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
