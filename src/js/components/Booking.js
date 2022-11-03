import { templates, select, settings, classNames} from '../settings.js';
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
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount  = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.hourPicker   = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePicker   = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.tables       = document.querySelectorAll(select.booking.tables);
    thisBooking.dom.floor        = document.querySelector(select.booking.floor);
    thisBooking.dom.submit       = document.querySelector(select.booking.submit);
    thisBooking.dom.durationInput= document.querySelector(select.booking.durationInput);
    thisBooking.dom.peopleInput  = document.querySelector(select.booking.peopleInput);
    thisBooking.dom.address      = document.querySelector(select.booking.address);
    thisBooking.dom.phone        = document.querySelector(select.booking.phone);
    thisBooking.dom.starters     = document.querySelectorAll(select.booking.starters);
  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmoundWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget  = new AmoundWidget(thisBooking.dom.hoursAmount);
    thisBooking.hourPicker         = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePicker         = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.dom.wrapper.addEventListener('update', function(event){
      thisBooking.updateDOM();
      if (
        event.target == thisBooking.dom.hourPicker ||
        event.target == thisBooking.dom.datePicker
      ){
        thisBooking.choosenTable = {};
        for (let table of thisBooking.dom.tables){
          table.classList.remove('choosen');
        }
      }
    });

    thisBooking.dom.floor.addEventListener('click', function(event){
      thisBooking.chooseTable(event);
    });

    thisBooking.dom.submit.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.sendBooking();
    });


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
      .then(function([bookings, eventsCurrent, eventsRepeat]){

        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);

      });
  }
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      // console.log(thisBooking.booked);
    }
    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      // console.log(thisBooking.booked);
    }
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }

      }
    }
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock+=0.5){
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  chooseTable(event){
    const thisBooking = this;

    console.log('thisbooking',thisBooking);

    if (
      event.target.classList.contains('table') &&
      !event.target.classList.contains('booked') &&
      !event.target.classList.contains('choosen')
    ){
      thisBooking.choosenTable = {};
      for (let table of thisBooking.dom.tables){
        table.classList.remove('choosen');
      }

      event.target.classList.add('choosen');
      const choosenHour = utils.numberToHour(thisBooking.hour);
      const choosenDate = thisBooking.date;
      const choosenTableId = event.target.getAttribute('data-table');

      thisBooking.choosenTable.hour = choosenHour;
      thisBooking.choosenTable.date = choosenDate;
      thisBooking.choosenTable.tableId = choosenTableId;

      console.log(thisBooking.choosenTable);
    } else if (
      event.target.classList.contains('table')
        && !event.target.classList.contains('booked')
        && event.target.classList.contains('choosen')){

      thisBooking.choosenTable = {};
      for (let table of thisBooking.dom.tables){
        table.classList.remove('choosen');
      }
    }
  }
  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      }else{
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
  sendBooking(){
    const thisBooking = this;

    console.log(thisBooking.choosenTable);
    const url = settings.db.url + '/' + settings.db.bookings;

    if(typeof thisBooking.choosenTable == 'undefined'){
      window.alert('WYBIERZ STOLIK');
    }
    else {
      const payload = {
        date: thisBooking.choosenTable.date,
        hour: thisBooking.choosenTable.hour,
        table: parseInt(thisBooking.choosenTable.tableId),
        duration: parseInt(thisBooking.dom.durationInput.value),
        ppl: parseInt(thisBooking.dom.peopleInput.value),
        starters: [],
        phone: thisBooking.dom.phone.value,
        adress: thisBooking.dom.address.value,
      };

      for(let starter of thisBooking.dom.starters){
        if (starter.checked){
          payload.starters.push(starter.value);
        }
      }
      console.log('payload', payload);
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table))
        .then(thisBooking.updateDOM());
    }
    console.log(thisBooking);



  }
}

export default Booking;