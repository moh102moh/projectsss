/**
 * transportServiceModel.js
 * يمثل بنية البيانات (Schema) المتوقعة لخدمات النقل (transport_services)
 * يستخدم للتحقق من صحة المدخلات في الكنترولر.
 */

export const TransportServiceSchema = {
    // ---- حقول إلزامية عند الإنشاء ----
    requiredFields: [
        'service_type', 
        'name_en', 
        'name_ar', 
        'capacity', 
        'pricing_method', 
        'base_price'
    ],
    
    // ---- تعريف أنواع الحقول والقيم المسموحة ----
    validFields: {
        service_type: { 
            type: 'string', 
            allowedValues: ['Rental', 'Transfer'],
            description_ar: 'نوع الخدمة: تأجير أو توصيل'
        },
        name_en: { type: 'string', maxLength: 255 },
        name_ar: { type: 'string', maxLength: 255 },
        capacity: { type: 'number', min: 1, isInteger: true, description_ar: 'سعة الركاب' },
        
        pricing_method: { 
            type: 'string', 
            allowedValues: ['Per_Day', 'Per_KM'],
            description_ar: 'طريقة التسعير: باليوم أو بالكيلومتر'
        },
        base_price: { type: 'number', min: 0.01, description_ar: 'السعر الأساسي للوحدة' },
        minimum_charge: { type: 'number', min: 0, defaultValue: 0 },
        
        is_available: { type: 'boolean', defaultValue: true },
        image_url: { type: 'string', isNullable: true, maxLength: 255 },
        notes: { type: 'string', isNullable: true },
    },

    // دالة مساعدة للتحقق من نوع الخدمة وطريقة التسعير
    isValidService: (data) => {
        if (data.pricing_method === 'Per_Day' && data.service_type !== 'Rental') {
            return { valid: false, message: "التسعير باليوم يجب أن يكون لخدمة التأجير (Rental)." };
        }
        if (data.pricing_method === 'Per_KM' && data.service_type !== 'Transfer') {
             return { valid: false, message: "التسعير بالكيلومتر يجب أن يكون لخدمة التوصيل (Transfer)." };
        }
        return { valid: true };
    }
};

// يمكن تصدير دالة جلب خدمة واحدة كجزء من المودل (للتنظيم)
export const getTransportServiceById = async (dbConnection, serviceId) => {
    const [rows] = await dbConnection.execute(
        "SELECT * FROM transport_services WHERE id = ?",
        [serviceId]
    );
    return rows.length ? rows[0] : null;
};