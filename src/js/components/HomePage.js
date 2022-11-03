import { templates} from '../settings.js';

class HomePage{
  constructor(element){
    const thisHomePage = this;

    thisHomePage.render(element);

    console.log('this home page', thisHomePage);
  }
  render(element){
    const thisHomePage = this;

    thisHomePage.dom = {};
    thisHomePage.dom.wrapper = element;

    const generateHTML = templates.homePage();
    console.log(generateHTML);
    thisHomePage.dom.wrapper.innerHTML = generateHTML;
  }
}


export default HomePage;