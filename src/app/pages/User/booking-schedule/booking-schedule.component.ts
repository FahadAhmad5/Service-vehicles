import { ChangeDetectorRef, Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GeneralServiceService } from '../../../Service/GeneralService/general-service.service';
import { AuthService } from '../../../Service/AuthServices/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentsuccessfulComponent } from '../paymentsuccessful/paymentsuccessful.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-schedule',
  imports: [FullCalendarModule, CommonModule, FormsModule, PaymentsuccessfulComponent],
  templateUrl: './booking-schedule.component.html',
  styleUrl: './booking-schedule.component.css'
})
export class BookingScheduleComponent {

  schedules: any[] = [];
  showBookingForm = false;
  selectedDate: string = '';
  startTime: string = '';
  companyId: string | null = null;

  servicesArray: string[] = [];  
  selectedDay: string | null = null;
  tempBookingData: any = {}; 

  name: string = ''; 
  email: string = ''; 
  vehicle: string = ''; 
  success: boolean = false; 
   
  constructor(private generalService: GeneralServiceService, private cdr: ChangeDetectorRef, private AuthServices: AuthService, private route: ActivatedRoute, private router: Router) { }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    height: 600,
    headerToolbar: {
      // left: 'prev,next today',
      left: 'title',
      right: 'dayGridMonth,prev,next today'
    },
    events: [],
    dateClick: this.handleDateClick.bind(this),
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = params.get('id');

      if (this.companyId) {
        this.fetchSchedules(this.companyId);
      }
    });

  }

  fetchSchedules(companyId: string): void {
    this.AuthServices.get(`schedule/${companyId}`).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.schedules = Array.isArray(res.schedule) ? res.schedule : [res.schedule];
          this.populateCalendarEvents();
        }
        else {
          this.schedules = [];
        }
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
        this.generalService.showMessage('error', 'Failed to fetch schedules.');
        this.schedules = [];
      }
    });
  }


  

  cancelBooking(): void {
    this.showBookingForm = false;
  }

  handleDateClick(event: any): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
    const clickedDate = event.dateStr;
    const currentDate = new Date().toISOString().split('T')[0];

    if (clickedDate < currentDate) {
      this.generalService.showMessage('error', 'You cannot select a past date for booking.')
    }
    else {
      const dayOfWeek = new Date(clickedDate).toLocaleString('en-us', { weekday: 'long' });

      localStorage.setItem('selectedDay', dayOfWeek);

      this.selectedDate = clickedDate;
      this.showBookingForm = true;
    }
  }

  populateCalendarEvents(): void {
    const events: any[] = [];
    const currentMonth = new Date().getMonth();
    const year = new Date().getFullYear();

    this.schedules.forEach(schedule => {
      if (schedule.dates && schedule.dates.length > 0) {
        schedule.dates.forEach((customDate: string) => {
          events.push({
            title: `Custom Booking: ${schedule.start[0]} - ${schedule.end[0]}`,
            start: customDate,
            end: this.addDurationToDate(customDate, schedule.start[0], schedule.end[0]),
          });
        });
      }

      else if (schedule.day) {
        const dayOfWeek = schedule.day.toLowerCase();
        const dayOfWeekIndex = this.getDayOfWeekIndex(dayOfWeek);

        if (dayOfWeekIndex !== -1) {
          const firstDay = this.getFirstDayOfWeekInMonth(year, currentMonth, dayOfWeekIndex);
          let currentDay = new Date(firstDay);
          currentDay.setDate(currentDay.getDate() + 1);

          while (currentDay.getMonth() === currentMonth) {
            events.push({
              title: `Day Booking: ${schedule.start[0]} - ${schedule.end[0]}`,
              start: currentDay.toISOString(),
              end: currentDay.setHours(currentDay.getHours() + 1),
            });
            currentDay.setDate(currentDay.getDate() + 7);
          }
        }
      }
    });

    this.calendarOptions.events = events;
    this.cdr.detectChanges();
  }

  getFirstDayOfWeekInMonth(year: number, month: number, dayOfWeek: number): string {
    const firstDay = new Date(year, month, 1);
    const dayIndex = firstDay.getDay();
    const diff = (dayOfWeek - dayIndex + 7) % 7;
    firstDay.setDate(firstDay.getDate() + diff);
    return firstDay.toISOString().split('T')[0];
  }

  addDurationToDate(date: string, start: string, end: string): string {
    const startTime = start.split(":");
    const endTime = end.split(":");
    const dateObject = new Date(date);

    dateObject.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
    const endDateObject = new Date(dateObject);
    endDateObject.setHours(parseInt(endTime[0]), parseInt(endTime[1]));

    return endDateObject.toISOString();
  }

  getDayOfWeekIndex(day: string): number {
    const daysMap: { [key: string]: number } = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6
    };

    const index = daysMap[day.toLowerCase()];

    if (index === undefined) {
      console.error(`Invalid day received: ${day}`);
      return -1;
    }

    return index;
  }

  confirmBooking() {
    if (!this.startTime) {
      this.generalService.showMessage('error', 'Please select a valid booking time.');
      return;
    }

    let serviceTime = localStorage.getItem('selectedServiceId');
    const selectedDay = localStorage.getItem('selectedDay');

    let servicesArray: string[] = [];

    if (serviceTime) {
      try {
        const parsedService = JSON.parse(serviceTime);
        servicesArray = Array.isArray(parsedService) ? parsedService : [parsedService];
      } catch (error) {
        servicesArray = [serviceTime];
      }
    }

    const bookingData = {
      date: this.selectedDate,
      time: this.startTime,
      services: servicesArray,
      company_id: this.companyId,
      day: selectedDay,
    };

    console.log('Initial Booking Data:', bookingData);

    this.AuthServices.post('company-availability', bookingData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // this.generalService.showMessage('success', 'Booking confirmed!');
          this.generalService.showMessage('success', 'time available!');

  
          this.tempBookingData = bookingData;
          this.servicesArray = servicesArray; 
          this.selectedDay = selectedDay; 
          
          //
          const bookingModal = document.getElementById('bookingModal');
          if (bookingModal) {
            (window as any).bootstrap.Modal.getInstance(bookingModal).hide();
          }
          const userDetailsModal = new (window as any).bootstrap.Modal(document.getElementById('userDetailsModal'));
          userDetailsModal.show();
        } else {
          this.generalService.showMessage('error', 'time is not available!');
        }
      },
      error: (err) => {
        console.error('Error confirming booking:', err);
        this.generalService.showMessage('error', 'time is not available!');
      }
    });
  }

  
  async Booking() {
    if (!this.name || !this.email || !this.vehicle) {
      this.generalService.showMessage('error', 'Please fill in all fields.');
      return;
    }
  
    const finalBookingData = {
      appointmentTime: this.startTime,
      services: this.servicesArray,
      company_id: this.companyId,
      appointmentDay: this.selectedDay,
      appointmentDate: this.selectedDate,
      name: this.name,
      email: this.email,
      vechile: this.vehicle,
    };
  
    this.AuthServices.post('appointment', finalBookingData).subscribe({
      next: (res: any) => {
        if (res.status === 201) {
          this.generalService.showMessage('success', 'Booking successfully completed!');
  
          if (res.session_url) {
            window.location.href = res.session_url;
          } else {
            this.generalService.showMessage('error', 'Booking confirmed, but payment URL not received.');
          }
        } else {
          this.generalService.showMessage('error', 'Booking failed!');
        }
        this.success = true;
        this.router.navigate(['/payment-success']);
        console.log('Payment Success:', this.success);
      },
      error: (err) => {
        console.error('Error finalizing booking:', err);
        this.generalService.showMessage('error', 'Failed to complete booking.');
      }
    });
  } 

}
