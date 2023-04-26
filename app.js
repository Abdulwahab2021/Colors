const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const Adjustbutton = document.querySelectorAll('.adjust');
const lockButton = document.querySelectorAll('.lock');
const CloseAdjustment = document.querySelectorAll(".close-adjustment");
const SliderContainer = document.querySelectorAll(".sliders");
//This is for local storage
let savedPalettes = [];
let initialColors;
generateBtn.addEventListener('click', randomColors);
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {

    div.addEventListener("change", () => {

        updateTextUI(index);
    });
});
currentHexes.forEach(hex => {
    hex.addEventListener("click", () => { 

        copyToClipboar(hex);
    })
});
Adjustbutton.forEach((button, index) => {
    button.addEventListener('click', () => {
        OpenAdjustmentPanel(index);
    });
});

CloseAdjustment.forEach((button, index) => {
    button.addEventListener('click', () => {
        CloseAdjustmentPanel(index);
    })
});
lockButton.forEach((button, index) => {
    button.addEventListener('click', e => { 
        lockLayer(e, index);
    }) 
});
function lockLayer(e, index) {
    const lockSVG = e.target.children[0];
    const activeBg = colorDivs[index];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
        e.target.innerHTML = '<i class="fas fa-lock"></i>';
      } else {
        e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
      }
    console.log(activeBg)
}




//color generator
function generateHex() {

    const hexcolor = chroma.random();
    return hexcolor;
    // const letters = "#0123456789ABCDEF";
    // let hash = "#";
    // for (let i=0; i < 6; i++) {
    //     hash += letters[Math.floor(Math.random() * 16)];
    // }
    // return hash;
}
function randomColors() {
    initialColors = [];
    colorDivs.forEach((div, index) => {

        const hexText = div.children[0];
       
        const randomcolor = generateHex();
         
       
    if (div.classList.contains("locked")) {
        initialColors.push(hexText.innerText);
        return;
      } else {
        initialColors.push(chroma(randomcolor).hex());
      }
   
      

        div.style.backgroundColor = randomcolor;
        hexText.innerText = randomcolor;
       
        CheckTextContrast(randomcolor, hexText);
        const color = chroma(randomcolor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        colorssliders(color, hue, brightness, saturation);

      


    });
    resetInput();
    Adjustbutton.forEach((button, index) => { 
        CheckTextContrast(initialColors[index], button);
        CheckTextContrast(initialColors[index], lockButton[index]);

    })

}

function CheckTextContrast(color, text) {
       
        const luminance = chroma(color).luminance();
        if (luminance > 0.5) {
            text.style.color = "black";
        } else {
            text.style.color = "white";
        }
    }



function colorssliders(color, hue, brightness, saturation) {
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);

    const scaleSat = chroma.scale([noSat, color, fullSat]);
 

    const midbright = color.set("hsl.l", 0.5);
    const Scalebright = chroma.scale(["black", midbright, "white"]);
    
    brightness.style.backgroundImage = `linear-gradient(to right,${Scalebright(0)}, ${Scalebright(0.5)},${Scalebright(1)})`;

     saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )}, ${scaleSat(1)})`;
hue.style.backgroundImage= `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
    
}
   

function hslControls(e) {
 
    const index = e.target.getAttribute("data-hue") ||
        e.target.getAttribute("data-bright") ||
        e.target.getAttribute("data-sat");
    let ss = e.target;
   
      
    let slider = e.target.parentElement.querySelectorAll("input[type=range]");

     const hue = slider[0];
     const bright = slider[1];
    const sat = slider[2];
    // console.log(sat.value);
    const bgcolor = colorDivs[index].querySelector("h2").innerText;
    // console.log(initialColors[index]);
   
   
    let color = chroma(bgcolor)
        .set("hsl.s", sat.value)
        .set("hsl.l", bright.value)
        .set("hsl.h", hue.value);
    colorDivs[index].style.backgroundColor = color;
    colorssliders(color, hue, bright, sat);
    //  console.log(color);
   
}
function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);

   
    const texthex = activeDiv.querySelector("h2");
    texthex.innerText = color.hex();
    const icons = activeDiv.querySelectorAll(".controls button");
    CheckTextContrast(color, texthex);
    for (icon of icons) {
        CheckTextContrast(color, icon);
    }
    
}
function resetInput() {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider => { 

        if (slider.name === "hue") {
            const huecolor = initialColors[slider.getAttribute("data-hue")];
            const huevalue = chroma(huecolor).hsl()[0];
          slider.value=  Math.floor(huevalue);
           
        }

        if (slider.name === "brightness") {
            const brightcolor = initialColors[slider.getAttribute("data-bright")];
            const brightvalue = chroma(brightcolor).hsl()[1];
          slider.value=  Math.floor(brightvalue * 100)/100;
          
        }

        if (slider.name === "saturation") {
            const satcolor = initialColors[slider.getAttribute("data-sat")];
            const setvalue = chroma(satcolor).hsl()[2];
          slider.value=  Math.floor(setvalue * 100)/100;
           
        }
    })
 

}
popup.addEventListener("transitionend", () => {
    const popupBox = popup.children[0];
    popup.classList.remove("active");
    popupBox.classList.remove("active");
  });

function copyToClipboar(hex) {
    const el = document.createElement("textarea");
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
  
    document.execCommand("copy");
    document.body.removeChild(el);
    const popupBox = popup.children[0];
    //console.log(popupBox);
    popup.classList.add("active");
    popupBox.classList.add("active");
}
function OpenAdjustmentPanel(index) {
    SliderContainer[index].classList.toggle('active');
}
function CloseAdjustmentPanel(index) {
    SliderContainer[index].classList.remove('active');
}

const saveBtn = document.querySelector('.save');
console.log(saveBtn);
const submitSave = document.querySelector('.submit-save');
const CloseSave = document.querySelector('.close-save');
const SaveContainer = document.querySelector('.save-container');
const SaveInput = document.querySelector('.save-container input');
const libraryContainer = document.querySelector('.library-container');
const librarybtn = document.querySelector('.library');
const closeLibratyBtn = document.querySelector('.close-library');

saveBtn.addEventListener('click', openPalatte);
CloseSave.addEventListener('click', closePalatte);
submitSave.addEventListener("click", savePalette);
librarybtn.addEventListener("click", opentLibrary);
closeLibratyBtn.addEventListener("click", CloseLibrary);
function openPalatte(e) {
    const popup = SaveContainer.children[0];
    SaveContainer.classList.add("active");
    popup.classList.add("active");

}

function closePalatte(e) {
    const popup = SaveContainer.children[0];
    SaveContainer.classList.remove("active"); 
    popup.classList.remove("remove");
    
}

function savePalette(e) {
    SaveContainer.classList.remove("active");
    popup.classList.remove("active");
    const name = SaveInput.value;
    
    const colors = [];
    currentHexes.forEach(hex => {
        colors.push(hex.innerText);
    });
    //Generate Objects

    let paletteNr = savedPalettes.length;
    const paletteObj = { name, colors, nr: paletteNr };
    savedPalettes.push(paletteObj);
    console.log(savedPalettes);
    savetoLocal(paletteObj);
    SaveInput.value = "";

    //Generate the palette for library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add('small-preview');
    paletteObj.colors.forEach(smallcolor => {
        const smalldiv = document.createElement('div');
        smalldiv.style.backgroundColor = smallcolor;
        preview.appendChild(smalldiv);
      

    });

    const palettebtn = document.createElement('button');
    palettebtn.classList.add('pick-palette-btn');
    palettebtn.classList.add(paletteObj.nr);
    palettebtn.innerText = "Select";

    //Attach event to the  button

    palettebtn.addEventListener('click', e => {
        CloseLibrary();
       
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0];
            CheckTextContrast(color, text);
            updateTextUI(index);
            

        });
        resetInput();
    });

    //Append to Library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(palettebtn);
    libraryContainer.children[0].appendChild(palette);

}

function savetoLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
    }
    else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function opentLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add("active");
}

function CloseLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");
}
function getLocal() {
    debugger
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
        
    } else {
        debugger
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        savedPalettes = [...paletteObjects];
        paletteObjects.forEach(paletteObj => {
            debugger
            console.log(paletteObj);

      //Generate the palette for Library
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");
      const title = document.createElement("h4");
      title.innerText = paletteObj.name;
      const preview = document.createElement("div");
      preview.classList.add("small-preview");
            paletteObj.colors.forEach(smallColor => {
          debugger
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
      });
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "Select";

      //Attach event to the btn
      paletteBtn.addEventListener("click", e => {
        CloseLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;
          const text = colorDivs[index].children[0];
          checkTextContrast(color, text);
          updateTextUI(index);
        });
        resetInputs();
      });

      //Append to Library
      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette);
    });
      
    }
    
}

getLocal();
randomColors();