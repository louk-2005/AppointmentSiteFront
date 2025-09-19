import api from '../..//api/auth.js';

export default {
  // دریافت لیست سالن‌ها
  getSalons(params = {}) {
    return api.get('/salons/salons/', { params });
  },

  // دریافت جزئیات یک سالن
  getSalon(id) {
    return api.get(`/salons/salons/${id}/`);
  },

  // ایجاد سالن جدید
  createSalon(data) {
    return api.post('/salons/salons/', data);
  },

  // ویرایش سالن
  updateSalon(id, data) {
    return api.put(`/salons/salons/${id}/`, data);
  },

  // حذف سالن
  deleteSalon(id) {
    return api.delete(`/salons/salons/${id}/`);
  }
};