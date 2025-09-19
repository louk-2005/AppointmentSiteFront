import api from '../../api/auth.js';

export default {
  // دریافت لیست تایم اسلات‌ها
  getTimeSlots(params = {}) {
    return api.get('/salons/timeslots/', { params });
  },

  // تولید تایم اسلات‌ها
  generateTimeSlots(data) {
    return api.post('/salons/timeslots/generate_slots/', data);
  },

  // مسدود کردن یک تایم اسلات
  blockTimeSlot(id, reason) {
    return api.post(`/salons/timeslots/${id}/block_slot/`, { reason });
  },

  // رفع مسدودی یک تایم اسلات
  unblockTimeSlot(id) {
    return api.post(`/salons/timeslots/${id}/unblock_slot/`);
  },

  // مسدود کردن بازه زمانی
  blockTimeRange(data) {
    return api.post('/salons/blocked-times/block_time_range/', data);
  },

  // رفع مسدودی بازه زمانی
  unblockTimeRange(data) {
    return api.post('/salons/blocked-times/unblock_time_range/', data);
  }
};