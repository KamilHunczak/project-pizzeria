import { templates, select, settings} from '../settings.js';
import AmoundWidget from './AmountWidget.js';
import HourPicker from './HourPicker.js';
import DatePicker from './DatePicker.js';
import utils from '../utils.js';


class Booking{
  constructor (element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();

    // console.log(thisBooking);
  }
  render(element){
    const thisBooking = this;

    const generateHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generateHTML;

  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount  = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.hourPicker   = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePicker   = document.querySelector(select.widgets.datePicker.wrapper);

    thisBooking.peopleAmountWidget = new AmoundWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget  = new AmoundWidget(thisBooking.dom.hoursAmount);
    thisBooking.hourPicker         = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePicker         = new DatePicker(thisBooking.dom.datePicker);
  }
  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);


    const params = {
      booking:[startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    const urls = {
      bookings:       settings.db.url + '/' + settings.db.bookings
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.events
                                     + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat)
    ])
      .then(function(allResponse){
        const bookingResponse =       allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse =  allResponse[2];

        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json()
        ]);
      })
      .then(function(bookings){

        console.log(bookings);
      });



    console.log('urls', urls);
    console.log(thisBooking);
  }
}


export default Booking;