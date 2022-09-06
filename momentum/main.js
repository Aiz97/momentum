//state
const timeSetting = document.getElementsByName('time');
const dateSetting = document.getElementsByName('date');
const greetingSetting = document.getElementsByName('greeting');
const quoteSetting = document.getElementsByName('quote');
const weatherSetting = document.getElementsByName('weather');
const audioSetting = document.getElementsByName('audio');
const todoSetting = document.getElementsByName('todo');
const tags = document.querySelector('.tag')
let language = document.getElementsByName('language')[0]
const photoSource = document.getElementsByName('photo-source')[0]
const cityWeather = document.querySelector('.city')

const state = {
    cityWeather: cityWeather.value,
    language: language.value,
    photoSource : photoSource.value,  
    tags : tags.value,
    time : Boolean(timeSetting[0].checked),
    date :  Boolean(dateSetting[0].checked),
    greeting :  Boolean(greetingSetting[0].checked),
    quote :  Boolean(quoteSetting[0].checked),
    weather :  Boolean(weatherSetting[0].checked),
    audio :  Boolean(audioSetting[0].checked),
    todo : Boolean(todoSetting[0].checked),
}

const time = document.querySelector('.time');
const dateItem = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const date = new Date();
const hours = date.getHours();
let randomNum = getRandomNum();
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

//get time of day
function getTimeOfDay() {
    let timeOfDay = '';
    if(00 <= hours && hours < 6) {
        timeOfDay = 'night';
    } else if (6 <= hours && hours < 12) {
        timeOfDay =  'morning';
    } else if (12 <= hours && hours < 18) {
        timeOfDay =  'afternoon';
    } else {timeOfDay =  'evening'};
    return timeOfDay;
}
getTimeOfDay();

//weather and greeting translation
const greetingTranslation = {
    "placeholder":{
        'ru' : "[Введите имя]",
        'en-US' : "[Enter name]",
        
    },
    "morning":{
        'ru' : "Доброе утро",
        'en-US' : "Good morning",
        'be' : "Добрай раніцы",
        
    },
    "afternoon":{
        'ru' : "Добрый день",
        'en-US' : "Good afternoon",
        'be' : "Добры дзень",
        
    },
    "evening":{
        'ru' : "Добрый вечер",
        'en-US' : "Good evening",
        'be' : "Добры вечар",
        
    },
    "night":{
        'ru' : "Доброй ночи ",
        'en-US' : "Good night",
        'be' : "Дабранач",
    }
}
const weatherTranslation ={
   
    "windSpeed" : {
        "ru":'Скорость ветра',
        "en-US":'Wind speed',
    },
   
    "Humidity" : {
        "ru":'Влажность',
        "en-US":'Humidity',

    },
    "defaultCity":{
        "ru":'Минск',
        "en-US":'Minsk',
    },
    "speed" : {
        "ru":'м/с',
        "en-US": 'm/s',
    },
}

//time
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}
showTime();

//date
function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString(state.language, options);
    dateItem.textContent = currentDate;
}

function showGreeting() {
    const name = document.querySelector('.name');
    greeting.textContent =`${greetingTranslation[getTimeOfDay()][state.language]}`;
    name.placeholder = `${greetingTranslation['placeholder'][state.language]}`;
}

// Local Storage
let name = document.querySelector('.name');
function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('language',state.language);
    localStorage.setItem('photoSource',state.photoSource);
    localStorage.setItem('tags',state.tags);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    } if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
    getWeather();
    getQuotes();
    if(localStorage.getItem('language')) {
        language.value = localStorage.getItem('language');
        state.language = localStorage.getItem('language');
        getWeather();
        showTime();
        showGreeting();
        getQuotes();
        settingTranslate();
    }
  
    if(localStorage.getItem('photoSource')) {
        photoSource.value = localStorage.getItem('photoSource');
        state.photoSource = localStorage.getItem('photoSource');
        setBg();
        hideTags();
    }
    if(localStorage.getItem('tags')) {
        tags.value = localStorage.getItem('tags');
        state.tags = localStorage.getItem('tags');
        getLinkToImageFlickr();
        getLinkToImageUnsplash();
        setBg();
    }
   
    if(localStorage.getItem('todos')) {
        var todosString = localStorage.getItem('todos');
        var todos = JSON.parse(todosString);
        todos.forEach(todo => generateTemplate(todo));
    }
}
window.addEventListener('DOMContentLoaded', getLocalStorage);

//random number
function getRandomNum() {
    return Math.floor((Math.random() * 20) + 1);
}

//background
function setBg() {
    if(photoSource.value === "GitHub") {
        const timeOfDay = getTimeOfDay();
        const bgNum = String(getRandomNum()).padStart(2, "0");
        const body = document.body;
        const img = new Image();
        img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
        img.onload = () => {
        body.style.backgroundImage = `url(${img.src})`;} 
    } 
    else if(photoSource.value === "unsplash") {
        const imgUnsplash = new Image();
        async function getLinkToImageUnsplash() {
            const timeOfDay = getTimeOfDay();
            if(tags.value) {
                url = `https://api.unsplash.com/photos/random?query=${tags.value}&client_id=_-lPmUm1eMtOYAqYqiPSjNVAG3leQ4vbYkqzVr7zkC8`;
            } else {
              url = `https://api.unsplash.com/photos/random?query=${timeOfDay}&client_id=_-lPmUm1eMtOYAqYqiPSjNVAG3leQ4vbYkqzVr7zkC8`;
            }
            const res = await fetch(url);
            const data = await res.json();
            let link = data.urls.regular;
            imgUnsplash.src = `${link}`;
            
        }
        getLinkToImageUnsplash();
        imgUnsplash.onload = () => {      
        body.style.backgroundImage = `url(${imgUnsplash.src})`;}
    } 
    else if(photoSource.value === "flickr") {
        const imgFlickr = new Image();
        const timeOfDay = getTimeOfDay();
        async function getLinkToImageFlickr() {
            let url;
            if(tags.value){
              url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2c4e1f4aadda14403a0f0afa3354bdee&tags=${tags.value}&extras=url_l&format=json&nojsoncallback=1`;
            }else{
              url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2c4e1f4aadda14403a0f0afa3354bdee&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
            }
            const res = await fetch(url);
            const data = await res.json();
            const link = await data.photos.photo[getRandomNum(0,data.photos.photo.length)].url_l;
            imgFlickr.src = `${link}`;
          } 
          getLinkToImageFlickr();
          imgFlickr.onload = () => {      
          body.style.backgroundImage = `url(${imgFlickr.src})`;}
    }
}
setBg();

//slider
const getSlideNext = () => {
    randomNum = randomNum !== 20 ? randomNum + 1 : 1;
    setBg();
}
const getSlidePrev = () => {
    randomNum = randomNum !== 1 ? randomNum - 1 : 20;
    setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

const city = document.querySelector('.city');

city.addEventListener('change', getWeather);

//weather
async function getWeather() {
    if(city.value ==''){
        city.value = 'Minsk';
    };
    if(city.value =="Minsk" || city.value =="Минск"){
        city.value = weatherTranslation['defaultCity'][language.value];
        state.city = weatherTranslation['defaultCity'][language.value];
    };
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=e48e76048322f70a784089373fd94dc6&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    let temp = data.main.temp;
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = Math.round(temp)+'°C';
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${weatherTranslation['windSpeed'][state.language]}: ${data.wind.speed} ${weatherTranslation['speed'][state.language]}`;
    humidity.textContent = `${weatherTranslation['Humidity'][state.language]}: ${data.main.humidity}%`;
}
getWeather()

//quotes
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

async function getQuotes() {  
    const quotes = '/data.json';
    const res = await fetch(quotes);
    const data = await res.json(); 
    let pharaseNum = getRandomNum(0, Object.keys(data).length);
    author.textContent = data[pharaseNum][state.language].author;
    quote.textContent = `"${data[pharaseNum][state.language].text}"`;
}
getQuotes();
changeQuote.addEventListener('click', getQuotes);

//player and playlist
const audio = new Audio(); 
let playNum = 0;
const playList = [
    {      
      title: 'Aqua Caelestis',
      src: './assets/sounds/Aqua Caelestis.mp3',
      duration: '00:58'
    },  
    {      
      title: 'River Flows In You',
      src: './assets/sounds/River Flows In You.mp3',
      duration: '03:50'
    },
    {      
     title: 'Summer Wind',
     src: './assets/sounds/Summer Wind.mp3',
     duration: '01:50'
    },
    {      
     title: 'Ennio Morricone',
     src: './assets/sounds/Ennio Morricone.mp3',
     duration: '01:37'
    }
]
const play = document.querySelector('.play'); 
play.addEventListener('click', playAudio);
function playAudio() {
    play.classList.toggle("active");
    if (play.classList.contains('active')) {
        audio.src = playList[playNum].src;
        let img = new Image();
        img.src = './assets/svg/pause.svg'
        play.style.backgroundImage =  `url(${img.src})`;
        audio.currentTime = 0; 
        audio.play();
        activeItem(); 
    } else {
        let img = new Image();
        img.src = './assets/svg/play.svg'
        play.style.backgroundImage = `url(${img.src})`;
        audio.pause(); 
    }
}
const playListCont = document.querySelector('.play-list');
playList.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = element.title;
    playListCont.append(li);
});
const next = document.querySelector('.play-next');
const prev = document.querySelector('.play-prev');

next.addEventListener('click', playNext);
function playNext() {
    if(playNum + 1 >= playList.length){
        playNum = 0;
    } else {
        playNum++;
    }
    playAudio();
    activeItem();
}
prev.addEventListener('click', playPrev);
function playPrev() {
    if(playNum > 0) {
        playNum--;
    } else {
        playNum = 3;
    }
    playAudio();
    activeItem()
}
function activeItem() {
    const playItems = document.querySelectorAll('.play-item');
    for (let i = 0; i <= playItems.length; i++){
       if (playItems[i].classList.contains('item-active')){
            playItems[i].classList.remove('item-active');
        } playItems[playNum].classList.add('item-active');
    }
}
const mute = document.querySelector('.mute');
function muteAudio (){
    mute.classList.toggle('active')
    
    if(mute.classList.contains('active') == false ){
        mute.style.webkitMaskImage = "url(../assets/svg/sound.svg)";
        mute.style.backgroundColor = "white";
      audio.muted = false;
    }
    if(mute.classList.contains('active') == true){
        mute.style.webkitMaskImage = "url(../assets/svg/mute.svg)";
        mute.style.backgroundColor = "white";
        audio.muted = true;
    }
    
}
mute.addEventListener('click', muteAudio);

const seek = document.querySelector('.seek');
const audioDuration = document.querySelector('.audioDuration')
const currentAudioDuration = document.querySelector('.currentaudioDuration')
const audioTitle = document.querySelector('.audio-title')
let currentDuration =  0;
function currentTimeAudio(){
    seek.min=0;
    seek.max = audio.duration;
    seek.value = audio.currentTime;
    currentDuration = seek.value;
    setTimeout(currentTimeAudio,1000);
}
function seekAudio(){
    audio.currentTime = seek.value;
}
seek.addEventListener('change', seekAudio);
function showAudioDuration(){
      if(audio.duration){
        audioTitle.textContent = `${playList[playNum].title}`}
      if(audio.duration<60){
        audioDuration.textContent = `0:${Math.round(audio.duration)}`
      }
      if(audio.duration>=60){
        audioDuration.textContent = `${Math.trunc(audio.duration/60)}:${Math.round(audio.duration)%60}`
      }
   setTimeout(showAudioDuration,100)
   showCurrentAudioDuration()
}
  
function showCurrentAudioDuration(){
    
    if(audio.duration){
      if(currentDuration<60){
        currentAudioDuration.textContent = `0:${String(currentDuration).padStart(2, "0")}  /`
      }
      if(currentDuration>=60){
        currentAudioDuration.textContent = `${Math.trunc(currentDuration/60)}:${String(Math.round(currentDuration)%60).padStart(2, "0")}  /`
      }
  }
  
}
currentTimeAudio();
showAudioDuration();
//translation settings
const settingTranslation ={
    "settings" : {
        "ru":'Настройки ',
        "en-US":'Settings',
        },
    "Language" : {
        "ru":'Язык: ',
        "en-US":'Language: ',
        },
    "photosource" : {
        "ru":'Источник фото: ',
        "en-US":'Photo source: ',
        },
    "tags" : {
        "ru":'Теги: ',
        "en-US":'Tags: ',
        },
    "time" : {
        "ru":'Скрыть время ',
        "en-US":'Hide the time',
        },
    "date" : {
        "ru":'Скрыть дату ',
        "en-US":'Hide the date',
        },
    "greeting" : {
        "ru":'Скрыть приветствие ',
        "en-US":'Hide the greeting',
        },
    "quote" : {
        "ru":'Скрыть цитату ',
        "en-US":'Hide the quote',
        },
    "weather" : {
        "ru":'Скрыть погоду ',
        "en-US":'Hide the weather',
        },
    "audio" : {
        "ru":'Скрыть плеер ',
        "en-US":'Hide the audio',
        },
    "todo" : {
        "ru": 'Скрыть todo ',
        "en-US": 'Hide todo',
    },
    "placeholder" : {
        "ru": 'Добавить пункт...',
        "en-US": 'Add item...',
    },
}


const body = document.body;
body.addEventListener('click', (event) => {
    const settingBlock = document.querySelector('.setting-block');
    const tags = document.querySelector('.tag')
    const settingButton = document.querySelector('.setting-btn');
    const todoButton = document.querySelector('.todo');
    const todoBlock = document.querySelector('.todo-block');
  
    if (event.target.closest('.setting-btn')) {
        settingBlock.classList.toggle('active');
  
    } else if (event.target.closest('.todo')){
        todoBlock.classList.toggle('active');
    }
    if (!event.target.closest('.setting-block, .setting-btn')) {
        settingBlock.classList.remove('active');
    }  else if (!event.target.closest('.todo-block, .todo')){
        todoBlock.classList.remove('active');
    }
});


//settingTranslate
const titleLanguage = document.querySelector('.setting.language');
const titlePhotoSourse = document.querySelector('.setting.link-background');
const titleTags = document.querySelector('.setting.tags');
const titleBlocks = document.querySelectorAll('.block >span');
const titleSetting =document.querySelector('.setting-title');
const addNote = document.querySelector('.add-note');

function settingTranslate (){
  titleSetting.textContent = `${settingTranslation['settings'][state.language]}`;
  titleLanguage.textContent = `${settingTranslation['Language'][state.language]}`;
  titlePhotoSourse.textContent =`${settingTranslation['photosource'][state.language]}`;
  titleTags.textContent =`${settingTranslation['tags'][state.language]}`;
  titleBlocks[0].textContent =`${settingTranslation['time'][state.language]}`;
  titleBlocks[1].textContent =`${settingTranslation['date'][state.language]}`;
  titleBlocks[2].textContent =`${settingTranslation['greeting'][state.language]}`;
  titleBlocks[3].textContent =`${settingTranslation['quote'][state.language]}`;
  titleBlocks[4].textContent =`${settingTranslation['weather'][state.language]}`;
  titleBlocks[5].textContent =`${settingTranslation['audio'][state.language]}`;
  titleBlocks[6].textContent =`${settingTranslation['todo'][state.language]}`;
  addNote.placeholder = `${settingTranslation['placeholder'][state.language]}`;
};


function hideBlock(){
    const settingBlocks = document.querySelectorAll('.settings input');
    const weather = document.querySelector('.weather');
    const greeting = document.querySelector('.greeting-container');
    const change = document.querySelector('.change-quote');
    const player = document.querySelector('.player');
    const todo = document.querySelector('.todo');
    for(let key of settingBlocks){
       let nameblock = key.name;
      if(key.checked === true){
        switch (key.name) {
          case 'time':
            state.time = true;
            time.classList.add('hide');
            break;
          case 'date':
            state.date = true;
            dateItem.classList.add('hide');
            break;
          case 'greeting':
            state.greeting = true;
            greeting.classList.add('hide');
            break;
          case 'quote':
            state.quote = true;
            quote.classList.add('hide');
            author.classList.add('hide');
            change.classList.add('hide');
            break;
          case 'weather':
            state.weather = true;
            weather.classList.add('hide');
            break;
          case 'audio':
            state.audio = true;
            player.classList.add('hide');
            break;
          case 'todo':
            state.todo = true;
            todo.classList.add('hide');
            break;
        
        }
      }
      if(key.checked === false){
        switch (key.name) {
          case 'time':
            state.time = false;
            time.classList.remove('hide');
            break;
          case 'date':
            state.date = false;
            dateItem.classList.remove('hide');
            break;
          case 'greeting':
            state.greeting = false;
            greeting.classList.remove('hide');
            break;
          case 'quote':
            state.quote = false;
            quote.classList.remove('hide');
            author.classList.remove('hide');
            change.classList.remove('hide');
            break;
          case 'weather':
            state.weather = false;
            weather.classList.remove('hide');
            break;
          case 'audio':
            state.audio = false;
            player.classList.remove('hide');
            break;
          case 'todo':
            state.todo = false;
            todo.classList.remove('hide');
            break;
        }
  
      }
  }
  };
function hideTags (){ 
    const settingTags = document.querySelector('.setting-tags');
    if(photoSource.value === "unsplash" || photoSource.value === "flickr"){
      settingTags.style.display = "";
    }
    else{
      settingTags.style.display = "none";
    }
}
timeSetting[0].addEventListener('change', hideBlock)
dateSetting[0].addEventListener('change', hideBlock)
greetingSetting[0].addEventListener('change', hideBlock)
quoteSetting[0].addEventListener('change', hideBlock)
weatherSetting[0].addEventListener('change', hideBlock)
audioSetting[0].addEventListener('change', hideBlock)
todoSetting[0].addEventListener('change', hideBlock)


language.addEventListener('change', () => {
    state.language = language.value;
    getWeather();
    showTime();
    showGreeting();
    getQuotes();
    settingTranslate();
  
});
photoSource.addEventListener('change', () => {
    state.photoSource = photoSource.value;
    setBg();
    hideTags();
  
});
  
tags.addEventListener('change', () => {
    state.tags = tags.value;
    getLinkToImageFlickr();
    getLinkToImageUnsplash();
    setBg();
});
  
//todo
const submitForm = document.querySelector(".add");
const addButton = document.querySelector(".add-todo");
const todoList = document.querySelector(".todos");
const list = document.querySelectorAll(".todos li");

let listLength = list.length;

const generateTemplate = (todo) => {
  const html = `<li>
                  <input type="checkbox" id="todo_${listLength}">
                  <label for="todo_${listLength}">
                    <span class="check"></span>
                    ${todo}
                  </label>
                  <div class="delete"></div>
                </li>`;
  todoList.innerHTML += html;
};
let todos = [];
function addTodos(e) {
  e.preventDefault();
  const todo = submitForm.add.value.trim();
  if (todo.length) {
    listLength = listLength + 1;
    generateTemplate(todo);
    submitForm.reset();
    todos.push(todo);
  } 
  localStorage.setItem('todos', JSON.stringify(todos));
}

submitForm.addEventListener("submit", addTodos);


function deleteTodos(e) {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
  } 
  localStorage.setItem('todos', JSON.stringify(todos));
}

todoList.addEventListener("click", deleteTodos);


