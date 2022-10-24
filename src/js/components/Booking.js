import { templates, select} from '../settings.js';
import AmoundWidget from './AmountWidget.js';


class Booking{
  constructor (element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    console.log(thisBooking);
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
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    thisBooking.peopleAmountWidget =  new AmoundWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget =  new AmoundWidget(thisBooking.dom.hoursAmount);
  }

}


export default Booking;