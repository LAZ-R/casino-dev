import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { getSvgIcon } from "./services/icons.service.js";
import { showToast } from "./services/toast.service.js";
import { 
  convertMillisecondsToTimeObject,
  convertTimeValuesToMilliseconds,
  getCompactColonTimeStringByTimeValues, 
  getCompactVerboseTimeStringByTimeValues, 
  getFullColonTimeStringByMilliseconds, 
  getFullColonTimeStringByTimeValues, 
  getFullVerboseTimeStringByTimeValues 
} from "./utils/dateAndTime.utils.js";
import { getRandomIntegerBetween } from "./utils/math.utils.js";
import { setHTMLTitle, logAppInfos } from "./utils/UTILS.js";
// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');

let currentUserBank = 1000;
let currentBanditAmount = 100;
const icon = ['🔥', '💡', '🚀', '☀️', '❤️', '✨', '💯'];

const loremIpsum = `
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae imperdiet est, nec fringilla sem. Donec lectus ex, dignissim non vestibulum et, consectetur vitae erat. Phasellus et tortor nec risus semper rutrum porta vitae odio. Sed at mollis turpis. Integer pulvinar lobortis mi, lobortis dictum mi commodo in. Fusce augue metus, scelerisque ac molestie et, ultricies vitae purus. Sed at pharetra augue, at eleifend metus.
  <br>
  Aenean lorem odio, fringilla et hendrerit nec, hendrerit et felis. Maecenas interdum porta tellus, nec ultrices lectus commodo sit amet. Vivamus a turpis metus. Nunc mattis velit non enim aliquam volutpat. Aenean eleifend risus sed augue facilisis, congue pretium ipsum consequat. Suspendisse eu nulla placerat, mattis nisl eu, feugiat nisl. Nulla felis risus, aliquet eu posuere eu, imperdiet sed velit. Sed ac tellus cursus, mollis sapien id, dapibus nisl. Proin mauris nisi, blandit quis efficitur vulputate, venenatis ut nisl. Phasellus viverra quis nunc iaculis rutrum. Duis at tortor convallis, eleifend nunc venenatis, dapibus neque. Duis imperdiet mollis lacus mattis bibendum. Curabitur sit amet tellus gravida, viverra libero id, tincidunt orci.
</p>
`;

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

// USER INTERACTIONS ##########################################################
const onButtonClick = (toastClass) => {
  showToast(toastClass, `clicked on ${toastClass}`);
};
window.onButtonClick = onButtonClick;

const onLaunchBanditClick = (isAllIn) => {
  if (currentUserBank > 0) {
    launchBandit(isAllIn);
  }
}
window.onLaunchBanditClick = onLaunchBanditClick;

const onBanditAmountChange = (event) => {
  console.log(event.srcElement.value);
  currentBanditAmount = event.srcElement.value;
}
window.onBanditAmountChange = onBanditAmountChange;

const launchBandit = (isAllIn) => {
  const userBankDisplay = document.getElementById('userBank');
  const firstSlotDisplay = document.getElementById('firstSlotDisplay');
  const secondSlotDisplay = document.getElementById('secondSlotDisplay');
  const thirdSlotDisplay = document.getElementById('thirdSlotDisplay');
  const banditResultsDisplay = document.getElementById('banditResults');
  const buttonsContainer = document.getElementById('buttonsContainer');

  buttonsContainer.innerHTML = '';
  
  firstSlotDisplay.classList.remove('finished');
  secondSlotDisplay.classList.remove('finished');
  thirdSlotDisplay.classList.remove('finished');
  firstSlotDisplay.classList.remove('winning');
  secondSlotDisplay.classList.remove('winning');
  thirdSlotDisplay.classList.remove('winning');
  firstSlotDisplay.classList.remove('jackpot');
  secondSlotDisplay.classList.remove('jackpot');
  thirdSlotDisplay.classList.remove('jackpot');
  banditResultsDisplay.innerHTML = '...';

  let amount = isAllIn ? currentUserBank : currentBanditAmount;
  currentUserBank -= amount;
  userBankDisplay.innerHTML = `${currentUserBank} €`;
  let gains = 0;

  const switchInterval1 = setInterval(() => {
    firstSlotDisplay.innerHTML = icon[getRandomIntegerBetween(1, 7) - 1];
  }, 50);
  
  const switchInterval2 = setInterval(() => {
    secondSlotDisplay.innerHTML = icon[getRandomIntegerBetween(1, 7) - 1];
  }, 50);
  
  const switchInterval3 = setInterval(() => {
    thirdSlotDisplay.innerHTML = icon[getRandomIntegerBetween(1, 7) - 1];
  }, 50);

  setTimeout(() => {
    const banditSlots = {
      firstSlot: getRandomIntegerBetween(1, 7),
      secondSlot: getRandomIntegerBetween(1, 7),
      thirdSlot: getRandomIntegerBetween(1, 7),
    }
    console.log(banditSlots);

    clearInterval(switchInterval1);
    firstSlotDisplay.innerHTML = icon[banditSlots.firstSlot - 1];
    firstSlotDisplay.classList.add('finished');

    setTimeout(() => {
      clearInterval(switchInterval2);
      secondSlotDisplay.innerHTML = icon[banditSlots.secondSlot - 1];
      secondSlotDisplay.classList.add('finished');

      setTimeout(() => {
        clearInterval(switchInterval3);
        thirdSlotDisplay.innerHTML = icon[banditSlots.thirdSlot - 1];
        thirdSlotDisplay.classList.add('finished');
      
        if (banditSlots.firstSlot === banditSlots.secondSlot && banditSlots.firstSlot === banditSlots.thirdSlot) {
          if (banditSlots.firstSlot === 7) {
            gains = isAllIn ? amount * 20 : amount * 10;
            banditResultsDisplay.innerHTML = '⭐⭐⭐ JACKPOT ⭐⭐⭐';
            firstSlotDisplay.classList.add('jackpot');
            secondSlotDisplay.classList.add('jackpot');
            thirdSlotDisplay.classList.add('jackpot');
          } else {
            gains = isAllIn ? amount * 8 : amount * 4;
            banditResultsDisplay.innerHTML = '⭐⭐ 3 slots identiques ⭐⭐';
            firstSlotDisplay.classList.add('winning');
            secondSlotDisplay.classList.add('winning');
            thirdSlotDisplay.classList.add('winning');
          }
        } else if (banditSlots.firstSlot === banditSlots.secondSlot || banditSlots.secondSlot === banditSlots.thirdSlot || banditSlots.firstSlot === banditSlots.thirdSlot) {
          gains = isAllIn ? amount * 4 : amount * 2;
          banditResultsDisplay.innerHTML = '⭐ 2 slots identiques ⭐';
          if (banditSlots.firstSlot === banditSlots.secondSlot) {
            firstSlotDisplay.classList.add('winning');
            secondSlotDisplay.classList.add('winning');
          } else if (banditSlots.firstSlot === banditSlots.thirdSlot) {
            firstSlotDisplay.classList.add('winning');
            thirdSlotDisplay.classList.add('winning');
          } else if (banditSlots.secondSlot === banditSlots.thirdSlot) {
            secondSlotDisplay.classList.add('winning');
            thirdSlotDisplay.classList.add('winning');
          }
        } else {
          banditResultsDisplay.innerHTML = 'PERDU';
        }
        currentUserBank += gains;
        userBankDisplay.innerHTML = `${currentUserBank} €`;
        document.getElementById('banditAmountInput').setAttribute('max', currentBanditAmount);
        buttonsContainer.innerHTML = `
          <button id="launchBanditButton" onclick="onLaunchBanditClick(false)" class="lzr-button lzr-solid lzr-primary lzr-margin-bottom" style="width: 100%; height: 12svh;">Lancer</button>
          <button id="allInButton" onclick="onLaunchBanditClick(true)" class="lzr-button lzr-solid lzr-primary lzr-margin-bottom" style="width: 100%; height: 12svh;">All in !</button>
        `;
      }, 1000);
    }, 1000);
  }, 2000);

  

}

// DATA #######################################################################

// IHM RENDER #################################################################

// LOGGING ####################################################################

// INITIALIZATION /////////////////////////////////////////////////////////////////////////////////

logAppInfos(APP_NAME, APP_VERSION);
setHTMLTitle(APP_NAME);
//setStorage();

// EXECUTION //////////////////////////////////////////////////////////////////////////////////////
HEADER.innerHTML = `${APP_NAME}`;
MAIN.innerHTML = `
<div class="user-bank-display lzr-margin-bottom">
<span>Porte-feuille</span>
<span id="userBank" class="user-bank">
  ${currentUserBank} €
</span>
</div>
<div class="bandit-amount-display lzr-margin-bottom">
  <span>Mise actuelle</span>
  <span>
    <input 
      type="number" 
      id="banditAmountInput" 
      min="1" 
      max="${currentUserBank}" 
      step="1" 
      value="${currentBanditAmount}" 
      onchange="onBanditAmountChange(event)" />
    <span>€</span>
  </span>
</div>
<div class="bandit-container lzr-margin-bottom">
  <span id="firstSlotDisplay" class="bandit-slot finished jackpot">💯</span>
  <span id="secondSlotDisplay" class="bandit-slot finished jackpot">💯</span>
  <span id="thirdSlotDisplay" class="bandit-slot finished jackpot">💯</span>
</div>
<span id="banditResults" class="bandit-results lzr-margin-bottom">...</span>
<div id="buttonsContainer" class="buttons-container">
  <button id="launchBanditButton" onclick="onLaunchBanditClick(false)" class="lzr-button lzr-solid lzr-primary lzr-margin-bottom" style="width: 100%; height: 12svh;">Lancer</button>
  <button id="allInButton" onclick="onLaunchBanditClick(true)" class="lzr-button lzr-solid lzr-primary lzr-margin-bottom" style="width: 100%; height: 12svh;">All in !</button>
</div>
`;