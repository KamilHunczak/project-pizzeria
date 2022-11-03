import { templates} from '../settings.js';

class HomePage{
  constructor(element){
    const thisHomePage = this;

    thisHomePage.render(element);
    thisHomePage.initCarousel();
  }
  render(element){
    const thisHomePage = this;

    thisHomePage.dom = {};
    thisHomePage.dom.wrapper = element;

    const generateHTML = templates.homePage();
    thisHomePage.dom.wrapper.innerHTML = generateHTML;


  }
  initCarousel(){
    const elem = document.querySelector('.main-carousel');
    console.log(elem);
    const flkty = new Flickity( elem, {
    // options
      cellAlign: 'left',
      contain: true

    });
    console.log(flkty);

  }

}


export default HomePage;