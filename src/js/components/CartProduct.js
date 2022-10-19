import {select} from '../settings.js';
import AmoundWidget from './AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element){
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = menuProduct.params;
    Object.assign(thisCartProduct.params, menuProduct.params);
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;

    console.log('thisCardProduct',thisCartProduct);

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget(element);
    thisCartProduct.initActions();
  }
  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    thisCartProduct.dom.amountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);

    console.log('CartProductElement',thisCartProduct.dom);
  }
  initAmountWidget(){
    const thisCardProduct = this;

    thisCardProduct.amountWidget = new AmoundWidget (thisCardProduct.dom.amountWidgetElem);
    thisCardProduct.dom.amountWidgetElem.addEventListener('update', function(){
      thisCardProduct.amount = thisCardProduct.amountWidget.value;
      thisCardProduct.price = thisCardProduct.amount * thisCardProduct.priceSingle;
      thisCardProduct.dom.price.innerHTML = thisCardProduct.price;
    });
  }
  remove(){
    const thisCardProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail:{
        cartProduct: thisCardProduct,
      },
    });

    thisCardProduct.dom.wrapper.dispatchEvent(event);
    console.log('remove');
  }
  initActions(){
    const thisCardProduct = this;

    thisCardProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });
    thisCardProduct.dom.remove .addEventListener('click', function(event){
      event.preventDefault();
      thisCardProduct.remove();
    });


  }
  getData(){
    const thisCardProduct = this;

    const product = {
      id: thisCardProduct.id,
      amount: thisCardProduct.amount,
      price: thisCardProduct.price,
      priceSingle: thisCardProduct.priceSingle,
      name: thisCardProduct.name,
      params: thisCardProduct.params,
    };

    return product;
  }
}
export default CartProduct;