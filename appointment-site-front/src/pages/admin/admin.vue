<template>
    <div class="timeslot-generate">
        <div class="page-header">
            <h1>تولید تایم اسلات‌ها</h1>
            <p>برای تولید تایم اسلات‌ها، سالن و بازه زمانی مورد نظر را انتخاب کنید</p>
        </div>

        <div class="form-container">
            <form @submit.prevent="generateTimeSlots" class="generate-form">
                <!-- انتخاب سالن -->
                <div class="form-group">
                    <label for="salon">سالن <span class="required">*</span></label>
                    <div v-if="loadingSalons" class="loading-field">در حال بارگذاری سالن‌ها...</div>
                    <select
                        v-else
                        id="salon"
                        v-model="selectedSalon"
                        class="form-control"
                        required
                        :disabled="salons.length === 1"
                    >
                        <option value="">-- انتخاب سالن --</option>
                        <option
                            v-for="salon in salons"
                            :key="salon.id"
                            :value="salon.id"
                        >
                            {{ salon.name }}
                        </option>
                    </select>
                    <small v-if="salons.length === 1" class="form-text text-muted">
                        شما فقط یک سالن مدیریت می‌کنید
                    </small>
                </div>

                <!-- بازه تاریخ -->
                <div class="date-range">
                    <div class="form-group">
                        <label for="start-date">از تاریخ <span class="required">*</span></label>
                        <input
                            type="date"
                            id="start-date"
                            v-model="startDate"
                            class="form-control"
                            required
                            :min="minDate"
                        >
                    </div>

                    <div class="form-group">
                        <label for="end-date">تا تاریخ <span class="required">*</span></label>
                        <input
                            type="date"
                            id="end-date"
                            v-model="endDate"
                            class="form-control"
                            required
                            :min="startDate || minDate"
                        >
                    </div>
                </div>

                <!-- دکمه‌ها -->
                <div class="form-actions">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isSubmitting"
                    >
            <span v-if="isSubmitting">
              <i class="fa fa-spinner fa-spin"></i> در حال تولید...
            </span>
                        <span v-else>تولید تایم اسلات‌ها</span>
                    </button>

                    <button
                        type="button"
                        @click="resetForm"
                        class="btn btn-secondary"
                        :disabled="isSubmitting"
                    >
                        بازنشانی فرم
                    </button>
                </div>
            </form>
        </div>

        <!-- نتایج تولید -->
        <div v-if="showResult" class="result-container">
            <div class="alert" :class="resultClass">
                <h4>{{ resultTitle }}</h4>
                <p>{{ resultMessage }}</p>

                <div v-if="generatedSlotsCount > 0" class="result-details">
                    <p>تعداد تایم اسلات‌های تولید شده: <strong>{{ generatedSlotsCount }}</strong></p>
                    <p>بازه زمانی: <strong>{{ formatDate(startDate) }}</strong> تا <strong>{{
                            formatDate(endDate)
                        }}</strong></p>
                </div>
            </div>
        </div>

        <!-- جدول تایم اسلات‌های تولید شده -->
        <div v-if="generatedSlots.length > 0" class="generated-slots">
            <h3>تایم اسلات‌های تولید شده</h3>

            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>تاریخ</th>
                        <th>زمان شروع</th>
                        <th>زمان پایان</th>
                        <th>وضعیت</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="slot in generatedSlots" :key="slot.id">
                        <td>{{ formatDate(slot.date) }}</td>
                        <td>{{ slot.start_time }}</td>
                        <td>{{ slot.end_time }}</td>
                        <td>
                            <span class="badge badge-success">فعال</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination-info" v-if="totalSlots > generatedSlots.length">
                نمایش {{ generatedSlots.length }} از {{ totalSlots }} تایم اسلت تولید شده
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import timeSlotService from '../services/timeSlotService';
import salonService from '../services/salonService';

export default {
    name: 'TimeSlotGenerate',
    data() {
        return {
            salons: [],
            selectedSalon: '',
            startDate: '',
            endDate: '',
            minDate: new Date().toISOString().split('T')[0],
            isSubmitting: false,
            loadingSalons: true,
            showResult: false,
            resultClass: '',
            resultTitle: '',
            resultMessage: '',
            generatedSlotsCount: 0,
            generatedSlots: [],
            totalSlots: 0
        };
    },
    computed: {
        ...mapGetters(['currentUser']),
        formValid() {
            return this.selectedSalon && this.startDate && this.endDate;
        }
    },
    async created() {
        await this.loadSalons();
        this.setDefaultDates();
    },
    methods: {
        async loadSalons() {
            try {
                this.loadingSalons = true;
                const response = await salonService.getSalons();
                this.salons = response.data;

                // اگر کاربر فقط یک سالن دارد، آن را به عنوان پیش‌فرض انتخاب کن
                if (this.salons.length === 1) {
                    this.selectedSalon = this.salons[0].id;
                }
            } catch (error) {
                console.error('خطا در دریافت سالن‌ها:', error);
                this.$toast.error('خطا در دریافت لیست سالن‌ها');
            } finally {
                this.loadingSalons = false;
            }
        },

        setDefaultDates() {
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            this.startDate = today.toISOString().split('T')[0];
            this.endDate = nextWeek.toISOString().split('T')[0];
        },

        async generateTimeSlots() {
            if (!this.formValid) {
                alert('لطفاً تمام فیلدها را پر کنید');
                return;
            }

            try {
                this.isSubmitting = true;
                this.showResult = false;

                const payload = {
                    start_date: this.startDate,
                    end_date: this.endDate
                };

                // ارسال درخواست به API
                const response = await timeSlotService.generateTimeSlots(payload);

                // نمایش نتایج موفقیت‌آمیز
                // پاسخ مستقیماً در response.data قرار دارد
                this.showSuccessResult(response.data);

                // بارگذاری تایم اسلات‌های تولید شده برای نمایش
                await this.loadGeneratedSlots();

            } catch (error) {
                console.error('خطا در تولید تایم اسلات‌ها:', error);
                this.showErrorResult(error);
            } finally {
                this.isSubmitting = false;
            }
        },

        showSuccessResult(data) {
            this.showResult = true;
            this.resultClass = 'alert-success';
            this.resultTitle = 'تولید تایم اسلات‌ها با موفقیت انجام شد';

            // بررسی وجود داده‌های پاسخ
            if (data && typeof data === 'object') {
                this.resultMessage = data.message || 'تایم اسلات‌ها برای بازه زمانی مشخص شده تولید شدند';
                this.generatedSlotsCount = data.count || 0;
            } else {
                this.resultMessage = 'تایم اسلات‌ها با موفقیت تولید شدند';
                this.generatedSlotsCount = 0;
            }
        },

        showErrorResult(error) {
            this.showResult = true;
            this.resultClass = 'alert-danger';
            this.resultTitle = 'خطا در تولید تایم اسلات‌ها';

            // بررسی وجود خطا و ساختار آن
            if (error && error.response && error.response.data) {
                // اگر خطا از سرور آمده باشد
                const errorData = error.response.data;
                this.resultMessage = errorData.error || errorData.detail || 'خطایی در سرور رخ داده است';
            } else if (error && error.message) {
                // اگر خطا در سمت کلاینت باشد (مثلاً خطای شبکه)
                this.resultMessage = error.message;
            } else {
                // برای سایر موارد
                this.resultMessage = 'خطا در ارتباط با سرور';
            }

            console.error('خطا در تولید تایم اسلات‌ها:', error);
        },

        async loadGeneratedSlots() {
            try {
                // بارگذاری تایم اسلات‌های تولید شده برای نمایش
                const params = {
                    salon: this.selectedSalon,
                    start_date: this.startDate,
                    end_date: this.endDate,
                    page_size: 20 // نمایش 20 تایم اسلت اول
                };

                const response = await timeSlotService.getTimeSlots(params);
                this.generatedSlots = response.data.results || [];
                this.totalSlots = response.data.count || 0;
            } catch (error) {
                console.error('خطا در دریافت تایم اسلات‌های تولید شده:', error);
            }
        },

        resetForm() {
            if (this.salons.length > 1) {
                this.selectedSalon = '';
            }
            this.setDefaultDates();
            this.showResult = false;
            this.generatedSlots = [];
            this.totalSlots = 0;
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const options = {year: 'numeric', month: 'long', day: 'numeric'};
            return new Date(dateString).toLocaleDateString('fa-IR', options);
        }
    }
};
</script>

<style scoped>
.timeslot-generate {
    max-width: 1000px;
    margin: 150px auto 100px;
    padding: 20px;
}

.page-header {
    margin-bottom: 30px;
    text-align: center;
}

.page-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.page-header p {
    color: #7f8c8d;
    font-size: 1.1rem;
}

.form-container {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.generate-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #34495e;
}

.required {
    color: #e74c3c;
}

.form-control {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.date-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-text {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 5px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background-color: #3498db;
    color: white;
}

.btn-primary:hover {
    background-color: #2980b9;
}

.btn-secondary {
    background-color: #95a5a6;
    color: white;
}

.btn-secondary:hover {
    background-color: #7f8c8d;
}

.btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.result-container {
    margin-bottom: 30px;
}

.alert {
    padding: 15px 20px;
    border-radius: 4px;
    margin-bottom: 20px;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.alert h4 {
    margin-top: 0;
    margin-bottom: 10px;
}

.result-details {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.result-details p {
    margin-bottom: 5px;
}

.generated-slots {
    background: white;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.generated-slots h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
}

.table-responsive {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
}

.table-striped tbody tr:nth-of-type(odd) {
    background-color: #f8f9fa;
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 4px;
}

.badge-success {
    background-color: #28a745;
    color: white;
}

.pagination-info {
    margin-top: 15px;
    color: #6c757d;
    font-size: 0.9rem;
    text-align: center;
}

.loading-field {
    padding: 12px;
    color: #6c757d;
    font-style: italic;
}

@media (max-width: 768px) {
    .date-range {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>