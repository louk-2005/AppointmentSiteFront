<template>
  <div class="appointment-booking">
    <h1>رزرو نوبت</h1>

    <!-- انتخاب سالن -->
    <div class="form-group">
      <label>سالن:</label>
      <select v-model="selectedSalon" @change="fetchServices">
        <option value="">انتخاب سالن</option>
        <option v-for="salon in salons" :key="salon.id" :value="salon.id">
          {{ salon.name }}
        </option>
      </select>
    </div>

    <!-- انتخاب سرویس -->
    <div class="form-group" v-if="services.length">
      <label>سرویس:</label>
      <select v-model="selectedService" @change="fetchAvailableSlots">
        <option value="">انتخاب سرویس</option>
        <option v-for="service in services" :key="service.id" :value="service.id">
          {{ service.name }} ({{ service.duration }} دقیقه) - {{ service.price }} تومان
        </option>
      </select>
    </div>

    <!-- انتخاب تاریخ -->
    <div class="form-group" v-if="selectedService">
      <label>تاریخ:</label>
      <input type="date" v-model="selectedDate" @change="fetchAvailableSlots" :min="minDate">
    </div>

    <!-- نمایش تایم اسلات‌های موجود -->
    <div v-if="availableSlots.length" class="slots-container">
      <h3>تایم‌های موجود:</h3>
      <div class="slots-grid">
        <div
          v-for="slot in availableSlots"
          :key="slot.id"
          class="slot-item"
          :class="{ 'selected': selectedSlot === slot.id }"
          @click="selectSlot(slot)"
        >
          {{ slot.start_time }} - {{ slot.end_time }}
        </div>
      </div>
    </div>

    <!-- توضیحات -->
    <div class="form-group" v-if="selectedSlot">
      <label>توضیحات:</label>
      <textarea v-model="notes" rows="3"></textarea>
    </div>

    <!-- دکمه رزرو -->
    <button
      class="btn-book"
      @click="bookAppointment"
      :disabled="!selectedSlot || booking"
    >
      {{ booking ? 'در حال رزرو...' : 'رزرو نوبت' }}
    </button>

    <!-- پیام‌ها -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from "../../api/auth.js";
export default {
  data() {
    return {
      salons: [],
      services: [],
      availableSlots: [],
      selectedSalon: '',
      selectedService: '',
      selectedDate: new Date().toISOString().split('T')[0],
      selectedSlot: null,
      notes: '',
      booking: false,
      message: '',
      messageType: ''
    };
  },
  computed: {
    minDate() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    async fetchSalons() {
      try {
        const response = await api.get('/salons/salons/');
        this.salons = response.data;
      } catch (error) {
        this.showMessage('خطا در دریافت لیست سالن‌ها', 'error');
      }
    },

    async fetchServices() {
      if (!this.selectedSalon) return;

      try {
        const response = await api.get(`/appointments/services/?salon=${this.selectedSalon}`);
        this.services = response.data;

        this.resetSelection();
      } catch (error) {
        this.showMessage('خطا در دریافت لیست سرویس‌ها', 'error');
      }
    },

    async fetchAvailableSlots() {
      if (!this.selectedService || !this.selectedDate) return;

      try {
        const response = await api.get('/appointments/appointments/available_slots/', {
          params: {
            salon_id: this.selectedSalon,
            date: this.selectedDate
          }
        });
        this.availableSlots = response.data;
        this.selectedSlot = null;
      } catch (error) {
        this.showMessage('خطا در دریافت تایم‌های موجود', 'error');
      }
    },

    selectSlot(slot) {
      this.selectedSlot = slot.id;
    },

    async bookAppointment() {
      if (!this.selectedSlot) return;

      this.booking = true;

      try {
        await api.post('/appointments/appointments/', {
          service: this.selectedService,
          time_slot: this.selectedSlot,
          notes: this.notes
        });

        this.showMessage('نوبت شما با موفقیت رزرو شد', 'success');
        this.resetForm();
      } catch (error) {
        const errorMsg = error.response?.data?.detail || 'خطا در رزرو نوبت';
        console.log(error.response)
        this.showMessage(errorMsg, 'error');
      } finally {
        this.booking = false;
      }
    },

    resetSelection() {
      this.selectedService = '';
      this.selectedDate = new Date().toISOString().split('T')[0];
      this.availableSlots = [];
      this.selectedSlot = null;
    },

    resetForm() {
      this.resetSelection();
      this.notes = '';
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  },
  mounted() {
    this.fetchSalons();
  }
};
</script>

<style scoped>
.appointment-booking {
  max-width: 800px;
  margin: 150px auto 100px;
  padding: 35px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #ffffff 0%, #fff5f7 100%);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(233, 30, 99, 0.1);
  border: 1px solid #fce4ec;
}

h1 {
  text-align: center;
  color: #d81b60;
  margin-bottom: 35px;
  font-weight: 700;
  font-size: 32px;
  position: relative;
  padding-bottom: 20px;
}

h1:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #f8bbd0, #d81b60);
  border-radius: 4px;
}

.form-group {
  margin-bottom: 28px;
}

label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #880e4f;
  font-size: 16px;
}

select, input, textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #fce4ec;
  border-radius: 12px;
  font-size: 16px;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(233, 30, 99, 0.05);
}

select:focus, input:focus, textarea:focus {
  border-color: #f48fb1;
  box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.15);
  outline: none;
}

.slots-container {
  margin: 35px 0;
}

.slots-container h3 {
  color: #ad1457;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 20px;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 18px;
}

.slot-item {
  padding: 18px 12px;
  background-color: #fff;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #fce4ec;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.08);
  font-weight: 500;
  color: #880e4f;
}

.slot-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.15);
  border-color: #f8bbd0;
  background-color: #fff5f7;
}

.slot-item.selected {
  background: linear-gradient(135deg, #f8bbd0, #d81b60);
  color: white;
  border-color: transparent;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.3);
}

.btn-book {
  background: linear-gradient(135deg, #f06292, #d81b60);
  color: white;
  border: none;
  padding: 18px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  margin-top: 25px;
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.3);
}

.btn-book:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(233, 30, 99, 0.4);
  background: linear-gradient(135deg, #ec407a, #c2185b);
}

.btn-book:disabled {
  background: linear-gradient(135deg, #f8bbd0, #f48fb1);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color: #ad1457;
}

.message {
  padding: 18px;
  margin-top: 30px;
  border-radius: 12px;
  font-weight: 500;
  text-align: center;
  animation: fadeIn 0.5s ease;
  border-left: 5px solid;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.success {
  background: linear-gradient(135deg, #f8bbd0, #fce4ec);
  color: #ad1457;
  border-left-color: #d81b60;
}

.message.error {
  background: linear-gradient(135deg, #ffcdd2, #ffebee);
  color: #c2185b;
  border-left-color: #e91e63;
}

/* Responsive Design */
@media (max-width: 768px) {
  .appointment-booking {
    margin: 50px 15px;
    padding: 25px;
  }

  .slots-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  h1 {
    font-size: 28px;
  }

  .btn-book {
    font-size: 16px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .slots-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .slot-item {
    padding: 14px 8px;
    font-size: 14px;
  }

  h1 {
    font-size: 24px;
  }
}
</style>