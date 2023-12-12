const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");
const speakBtn = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#battery");
const internet = document.querySelector("#internet");
const turn_on = document.querySelector("#turn_on");
const msgs = document.querySelector(".messages");
const j_into = document.querySelector("#j_intro");

document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
  recognition.start();
});

//jarvis commands
let fridayComs = [];
fridayComs.push("hi friday");
fridayComs.push("what are your commands");
fridayComs.push("close this - to close opened popups");
fridayComs.push(
  "change my information - information regarding your acoounts and you"
);
fridayComs.push("whats the weather or temperature");
fridayComs.push("show the full weather report");
fridayComs.push("are you there - to check fridays presence");
fridayComs.push("shut down - stop voice recognition");
fridayComs.push("open google");
fridayComs.push('search for "your keywords" - to search on google ');
fridayComs.push("open whatsapp");
fridayComs.push("open youtube");
fridayComs.push('play "your keywords" - to search on youtube ');
fridayComs.push("close this youtube tab - to close opened youtube tab");
fridayComs.push("open firebase");
fridayComs.push("open netlify");
fridayComs.push("open twitter");
fridayComs.push("open my twitter profile");
fridayComs.push("open instagram");
fridayComs.push("open my instagram profile");
fridayComs.push("open github");
fridayComs.push("open my github profile");

//weather setup
function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}`;
      weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
      weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `sir the weather in ${data.name} is ${
        data.weather[0].description
      } and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
    }
  };

  xhr.send();
}

// convert kelvin to celcius
function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

//time setup
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

//tell about weather
let weatherStatement = "";
let charge, chargeStatus, connectivity, currentTime;
chargeStatus = "Unpplugged";

//onload(windows)
window.onload = () => {
  //onstartup
  turn_on.play();
  turn_on.addEventListener("onend", () => {
    setTimeout(() => {
      autoJarvis();
      readOut("Ready to go sir");
      if (localStorage.getItem("jarvis_setup") === null) {
        readOut("Sir,kindly fill the form");
      }
    }, 200);
  });

  //jarvis commands adding
  fridayComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p></br>`;
  });

  //time-clock
  //time.textContent = `${hrs} :${mins} :${secs}`
  //setInterval(() =>{
  //let date = new Date();
  //let hrs = date.getHours();
  //let mins = date.getMinutes();
  //let secs = date.getSeconds();
  //time.textContent = `${hrs} :${mins} :${secs}`
  //},1000);

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    currentTime = strTime;
    time.textContent = strTime;
  }

  formatAMPM(date);
  setInterval(() => {
    formatAMPM(date);
  }, 60000);

  // auto friday

  function autoJarvis() {
    setTimeout(() => {
      recognition.start();
    }, 1000);
  }

  //
  // start jarvis with btn
  document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
    recognition.start();
  });

  document.querySelector("#stop_jarvis_btn").addEventListener("click", () => {
    stopingR = true;
    recognition.stop();
  });

  //battery setup
  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${(
      batteryObject.level * 100
    ).toFixed(2)}%`;
    charge = batteryObject.level * 100;
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${(
        batteryObject.level * 100
      ).toFixed(2)}% Charging`;
      chargeStatus = "plugged in";
    }
  }

  //internet setup
  if (navigator.onLine) {
    document.querySelector("#internet").textContent = "online";
    connectivity = "online";
  } else {
    document.querySelector("#internet").textContent = "offline";
    connectivity = "offline";
  }

  setInterval(() => {
    if (navigator.onLine) {
      document.querySelector("#internet").textContent = "online";
      connectivity = "online";
    } else {
      document.querySelector("#internet").textContent = "offline";
      connectivity = "offline";
    }
  }, 60000);
};

//create a new chat
function createMsg(who, msg) {
  let newmsg = document.createElement("p");
  newmsg.innerText = msg;
  newmsg.setAttribute("class", who);
  msgs.appendChild(newmsg);
}

//jarvis setup
if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
}
//jarvis information setup
//const setup = document.querySelector(".jarvis_setup");
//setup.style.display = "none"
//if (localStorage.getItem("jarvis_setup") === null) {
//setup.style.display = "block"
//setup.querySelector("button").addEventListener("click", userInfo)
//}
//speech recognition setup
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
  console.log("VR active");
};

//arr of windows

recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;

  transcript = transcript.toLowerCase();

  //console.log(`my words : ${transcript}`);
  createMsg("usermsg", transcript);

  if (transcript.includes("hello,assistant")) {
    readOut("hello sir");
  }
  if (transcript.includes("tell me about yourself")) {
    let play = document.getElementById("play");
    function playMusic() {
      let audio = Audio("Jarvis.mp3");
      audio.play();
    }
  }

  if (transcript.includes("what are your commands")) {
    readOut("I follow the following commands");
    document.querySelector(".commands").style.display = "block";
  }
  if (transcript.includes("close this")) {
    readOut("closed");
    document.querySelector(".commands").style.display = "none";
    setup.style.display = "none";
  }
  if (transcript.includes("current time")) {
    readOut(currentTime);
  }
  if (transcript.includes("open youtube")) {
    readOut("opening youtube sir");
    let a = window.open("https://www.youtube.com/?gl=IN");
    windowsB.push(a);
  }
  if (transcript.includes("open google")) {
    readOut("opening google sir");
    let a = window.open("https://www.google.co.in/");
    windowsB.push(a);
  }
  if (transcript.includes("open firebase")) {
    readOut("opening forebash sir");
    let a = window.open("https://firebase.google.com/");
    windowsB.push(a);
  }
  if (transcript.includes("open github")) {
    readOut("opening github sir");
    let a = window.open("https://github.com/");
    windowsB.push(a);
  }
  if (transcript.includes("open my github")) {
    readOut("opening your github sir");
    let a = window.open("https://github.com/safirahmad67890");
    windowsB.push(a);
  }
  if (transcript.includes("open instagram")) {
    readOut("opening instagram sir");
    let a = window.open("https://instagram.com/");
    windowsB.push(a);
  }

  //google search
  if (transcript.includes("in google")) {
    readOut("here's the results");
    let input = transcript.split("");
    input.splice(0, 11);
    input.pop();
    input = input.join("").split("").join("+");
    console.log(input);
    let a = window.open(`https://www.google.co.in/search?q=${input}`);
    windowsB.push(a);
  }
  //youtube  search
  if (transcript.includes("in youtube")) {
    readOut("here's the results");
    let input = transcript.split("");
    input.splice(0, 11);
    input.pop();
    input = input.join("").split("").join("+");
    console.log(input);
    let a = window.open(`https://www.youtube.com/search?q=${input}`);
    windowsB.push(a);
  }

  if (transcript.includes("open Gmail")) {
    readOut("opening gmail sir");
    let a = window.open("https://www.gmail.com/");
    windowsB.push(a);
  }

  // canva

  if (transcript.includes("open my canva designs")) {
    readOut("opening canva designs");
    let a = window.open("https://www.canva.com/folder/all-designs");
    windowsB.push(a);
  }

  if (transcript.includes("open canva") || transcript.includes("open camera")) {
    readOut("opening canva");
    let a = window.open("https://www.canva.com/");
    windowsB.push(a);
  }

  if (transcript.includes("who i am?")) {
    readOut("yes sir , you are my master , my creator");
  }

  if (transcript.includes("open instagram")) {
    readOut("opening instagram sir");
    let a = window.open("https://www.instagram.com");
    windowsB.push(a);
  }

  if (transcript.includes("open twitter")) {
    readOut("opening twitter sir");
    let a = window.open(`https://twitter.com/`);
    windowsB.push(a);
  }
  if (transcript.includes("take me back")) {
    window.open("http://127.0.0.1:5500/");
  }

  // calendar
  if (transcript.includes("open calendar")) {
    readOut("opening calendar");
    let a = window.open("https://calendar.google.com/");
    windowsB.push(a);
  }
  // close all opened tabs
  if (transcript.includes("close all tabs")) {
    readOut("closing all tabs sir");
    windowsB.forEach((e) => {
      e.close();
    });
  }

  if (transcript.includes("top headlines")) {
    readOut("These are today's top headlines sir");
    getNews();
  }

  if (transcript.includes("news regarding")) {
    // readOut("These are today's top headlines sir")
    let input = transcript;
    let a = input.indexOf("regarding");
    input = input.split("");
    input.splice(0, a + 9);
    input.shift();
    input.pop();

    readOut(`here's some headlines on ${input.join("")}`);
    getCategoryNews(input.join(""));
  }

  // weather report
  if (transcript.includes("what is the temperature")) {
    readOut(weatherStatement);
  }

  if (transcript.includes("full weather report")) {
    readOut("opening the weather report sir");
    let a = window.open(
      `https://www.google.com/search?q=weather+in+${
        JSON.parse(localStorage.getItem("jarvis_setup")).location
      }`
    );
    windowsB.push(a);
  }
  // availability check
  if (transcript.includes("are you there")) {
    readOut("yes sir");
  }
  // close voice recognition
  if (transcript.includes("shut down")) {
    readOut("Ok sir i will take a nap");
    stopingR = true;
    recognition.stop();
  }
};

recognition.onend = function () {
  if (stopingR === false) {
    setTimeout(() => {
      recognition.start();
    }, 500);
  } else if (stopingR === true) {
    recognition.stop();
    //document.querySelector("#stop_jarvis_btn").style.display = "none";
  }
};

//To stop when we press stop button
recognition.continuous = true;

startBtn.addEventListener("click", () => {
  recognition.start();
});

stopBtn.addEventListener("click", () => {
  recognition.stop();
});

function readOut(message) {
  const speech = new SpeechSynthesisUtterance(message);
  const allVoices = speechSynthesis.getVoices();
  speech.text = message;
  speech.voice = allVoices[2];
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
  console.log("speaking out");
  createMsg("jmsg", message);
}

//small jarvis

// small jarvis
const smallJarvis = document.querySelector("#small_jarvis");

smallJarvis.addEventListener("click", () => {
  window.open(
    `${window.location.href}`,
    "newWindow",
    "menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0"
  );
  window.close();
});

document.querySelector("#jarvis_start").addEventListener("click", () => {
  recognition.start();
});

speakBtn.addEventListener("click", () => {
  readOut("Hi, my dear friends");
});
