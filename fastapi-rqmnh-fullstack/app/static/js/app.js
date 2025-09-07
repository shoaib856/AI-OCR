
// console.log("youssef");


// let state = {
//   lines: [],
//   showAll: false,
//   imageNatural: {w:0,h:0},
//   scale: {x:1,y:1},
//   active: null,
// };

// function $(sel){return document.querySelector(sel);}
// function create(el, cls){const e=document.createElement(el); if(cls) e.className=cls; return e;}

// function fitCanvasToImage(){
//   const img = $("#preview");
//   const canvas = $("#overlay");
//   if(!img || !canvas) return;
//   // match canvas size to the displayed image size
//   canvas.width = img.clientWidth;
//   canvas.height = img.clientHeight;
//   if (state.imageNatural.w > 0 && state.imageNatural.h > 0) {
//     state.scale.x = img.clientWidth / state.imageNatural.w;
//     state.scale.y = img.clientHeight / state.imageNatural.h;
//   }
// }

// function drawBoxes(){
//   const canvas = $("#overlay");
//   const ctx = canvas.getContext("2d");
//   ctx.clearRect(0,0,canvas.width, canvas.height);

//   const draw = (box, color, lineWidth=2)=>{
//     const [x,y,w,h] = box;
//     ctx.lineWidth = lineWidth;
//     ctx.strokeStyle = color;
//     ctx.strokeRect(x*state.scale.x, y*state.scale.y, w*state.scale.x, h*state.scale.y);
//   };

//   if(state.showAll){
//     state.lines.forEach((l)=> draw(l.box, "rgba(255,255,255,0.9)", 1));
//   }
//   if(state.active){
//     draw(state.active.box, "rgba(90,120,255,1)", 3);
//   }
// }

// function setActiveLine(idx){
//   state.active = state.lines.find(l=>l.idx===idx);
//   drawBoxes();
// }

// function renderLines(){
//   const list = $("#lines");
//   list.innerHTML = "";
//   state.lines.forEach((l)=>{
//     const li = create("li");
//     li.textContent = l.text || "(بدون نص)";
//     li.title = `الدرجة: ${l.score ?? "?"}`;
//     li.onclick = ()=> setActiveLine(l.idx);
//     list.appendChild(li);
//   });
// }

// async function callExtract(file, lang, clasifier){
//   const fd = new FormData();
//   fd.append("file", file);
//   fd.append("SUPPORTED_LANGUAGES", lang);
//   fd.append("clasifier", clasifier ? "true" : "false");

//   const res = await fetch("/api/extract", { method:"POST", body: fd });
//   const data = await res.json();
//   if(!res.ok){
//     throw new Error(data?.detail || "HTTP error");
//   }
//   return data;
// }

// function parseResponse(data){
//   const lines = [];
//   if(Array.isArray(data?.line_datas)){
//     data.line_datas.forEach(pg => {
//       const arr = pg?.line_data || [];
//       arr.forEach((ln)=>{
//         lines.push({
//           idx: lines.length,
//           text: ln?.line_text,
//           score: ln?.score,
//           box: (ln?.line_box && ln.line_box.length===4) ? ln.line_box : [0,0,0,0],
//           words: Array.isArray(ln?.word_boxes) ? ln.word_boxes : [],
//         });
//       });
//     });
//   }
//   state.lines = lines;
// }

// function loadPreview(file){
//   return new Promise((resolve,reject)=>{
//     const url = URL.createObjectURL(file);
//     const img = $("#preview");
//     img.onload = () => {
//       state.imageNatural.w = img.naturalWidth;
//       state.imageNatural.h = img.naturalHeight;
//       fitCanvasToImage();
//       resolve();
//     };
//     img.onerror = reject;
//     img.src = url;
//   });
// }

// window.addEventListener("resize", fitCanvasToImage);

// document.addEventListener("DOMContentLoaded", () => {



//   const form = $("#upload-form");
//   const fileInput = $("#file");
//   const langSel = $("#lang");
//   const clasifierChk = $("#clasifier");
//   const statusDiv = $("#status");
//   const toggleAll = $("#toggle-all");
//    document.querySelector('.col')?.classList.remove('visible');
//    document.querySelector('.results-list')?.classList.remove('visible');
  
//   // toggleAll.addEventListener("change", (e)=>{ state.showAll = !!e.target.checked; drawBoxes(); });
//     // toggleAll.addEventListener("change", (e)=>{ state.showAll ?"اظهار كل الصناديق":"إخفاء الصناديق";  drawBoxes(); });
//       toggleAll.addEventListener("click", (e)=>{ 
//     state.showAll = !state.showAll; // تبديل الحالة
//     drawBoxes(); 
//   });

   
  

//   form.addEventListener("submit", async (e)=>{
//     e.preventDefault();
//     const file = fileInput.files[0];
//     if(!file){
//       statusDiv.textContent = "رجاءً اختر صورة أولاً.";
//       statusDiv.style.color = "var(--bad)";
//       return;
//     }
//       const loader = document.getElementById("loader");
//       loader.style.display = "flex";
//     statusDiv.textContent = "جارِ الإرسال إلى واجهة التعرف...";
//     statusDiv.style.color = "var(--muted)";

//     await loadPreview(file);

//     try{
//       const data = await callExtract(file, langSel.value, clasifierChk.checked);


//       statusDiv.textContent = data?.signal || data?.status || "تم بنجاح";
//       statusDiv.style.color = "var(--ok)";
//       parseResponse(data);
//       renderLines();
//       drawBoxes();
//       // document.querySelector('.col').classList.add('visible');
//       // document.querySelector('.results-list').classList.add('visible');
//     }catch(err){
//       console.error(err);

//       statusDiv.textContent = "خطأ أثناء الاتصال بالخدمة.";
//       statusDiv.style.color = "var(--bad)";
//     }finally{
//           // loader.style.display = "none";

//     }
//   });

//   const img = $("#preview");
//   const observer = new ResizeObserver(fitCanvasToImage);
//   observer.observe(img);
// });




console.log("youssef");

let state = {
  lines: [],
  showAll: false,
  imageNatural: {w:0,h:0},
  scale: {x:1,y:1},
  active: null,
  startTime: null // لإضافة توقيت المعالجة
};

function $(sel){return document.querySelector(sel);}
function create(el, cls){const e=document.createElement(el); if(cls) e.className=cls; return e;}

function fitCanvasToImage(){
  const img = $("#preview");
  const canvas = $("#overlay");
  if(!img || !canvas) return;
  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;
  if (state.imageNatural.w > 0 && state.imageNatural.h > 0) {
    state.scale.x = img.clientWidth / state.imageNatural.w;
    state.scale.y = img.clientHeight / state.imageNatural.h;
  }
}

function drawBoxes(){
  const canvas = $("#overlay");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width, canvas.height);

  const draw = (box, color, lineWidth=2)=>{
    const [x,y,w,h] = box;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.strokeRect(x*state.scale.x, y*state.scale.y, w*state.scale.x, h*state.scale.y);
  };

  if(state.showAll){
    state.lines.forEach((l)=> draw(l.box, "rgba(255,255,255,0.9)", 1));
  }
  if(state.active){
    draw(state.active.box, "rgba(90,120,255,1)", 3);
  }
}

function setActiveLine(idx){
  state.active = state.lines.find(l=>l.idx===idx);
  drawBoxes();
}

function renderLines(){
  const list = $("#lines");
  list.innerHTML = "";
  state.lines.forEach((l)=>{
    const li = create("li");
    li.textContent = l.text || "(بدون نص)";
    li.title = `الدرجة: ${l.score ?? "?"}`;
    li.onclick = ()=> setActiveLine(l.idx);
    list.appendChild(li);
  });
  
  const linesCount = document.getElementById("lines-count");
  if (linesCount) {
    linesCount.textContent = state.lines.length;
  }
}

async function callExtract(file, lang, clasifier){
  const fd = new FormData();
  fd.append("file", file);
  fd.append("SUPPORTED_LANGUAGES", lang);
  fd.append("clasifier", clasifier ? "true" : "false");

  const res = await fetch("/api/extract", { method:"POST", body: fd });
  const data = await res.json();
  if(!res.ok){
    throw new Error(data?.detail || "HTTP error");
  }
  return data;
}

function parseResponse(data){
  const lines = [];
  if(Array.isArray(data?.line_datas)){
    data.line_datas.forEach(pg => {
      const arr = pg?.line_data || [];
      arr.forEach((ln)=>{
        lines.push({
          idx: lines.length,
          text: ln?.line_text,
          score: ln?.score,
          box: (ln?.line_box && ln.line_box.length===4) ? ln.line_box : [0,0,0,0],
          words: Array.isArray(ln?.word_boxes) ? ln.word_boxes : [],
        });
      });
    });
  }
  state.lines = lines;
}

function loadPreview(file){
  return new Promise((resolve,reject)=>{
    const url = URL.createObjectURL(file);
    const img = $("#preview");
    img.onload = () => {
      state.imageNatural.w = img.naturalWidth;
      state.imageNatural.h = img.naturalHeight;
      fitCanvasToImage();
      resolve();
    };
    img.onerror = reject;
    img.src = url;
  });
}

window.addEventListener("resize", fitCanvasToImage);

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#upload-form");
  const fileInput = $("#file");
  const langSel = $("#lang");
  const clasifierSel = $("#clasifier");
  const statusDiv = $("#status");
  const toggleAll = $("#toggle-all");
  const generateBtn = $("#btn-generate");
  const smallLoader = $("#small-loader");
  
  const elementsToTranslate = {
    'btn-generate': { ar: 'إنشاء النص ✨', en: 'Generate text ✨' },
    'toggle-all': { ar: 'إظهار/إخفاء الصناديق', en: 'Show All Boxs' },
    'hint-text': { ar: 'انقر على أي جملة في القائمة لتمييز مكانها على الصورة.', en: 'Click on any sentence in the list to highlight its location on the image.' },
    'sample-text': { ar: 'يمكنك تجربة صورة عينة من', en: 'You can try a sample image from' },
    'result-title': { ar: 'النتائج', en: 'Result' },
    'upload-title': { ar: 'رفع المستند', en: 'Upload document' },
    'upload-click': { ar: 'انقر للاختيار', en: 'Click to select' },
    'upload-formats': { ar: 'pdf, png, jpg, jpeg', en: 'pdf, png, jpg, jpeg' }
  };
  
  function updatePageDirectionAndText() {
    const selectedLang = langSel.value;
    if (selectedLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      translateToArabic();
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      translateToEnglish();
    }
  }
  
  function translateToArabic() {
    if (generateBtn) generateBtn.textContent = elementsToTranslate['btn-generate'].ar;
    if (toggleAll) toggleAll.textContent = elementsToTranslate['toggle-all'].ar;
    
    const hintElement = document.querySelector('.hint');
    const sampleElement = document.querySelector('.sample');
    const resultTitle = document.querySelector('.results-header strong');
    const uploadTitle = document.querySelector('.left h2');
    const uploadClick = document.querySelector('.con h4');
    const uploadFormats = document.querySelector('.con p');
    
    if (hintElement) hintElement.textContent = elementsToTranslate['hint-text'].ar;
    if (sampleElement) sampleElement.innerHTML = `${elementsToTranslate['sample-text'].ar} <code>/static/img/sample.png</code> إن وُجدت.`;
    if (resultTitle) resultTitle.textContent = elementsToTranslate['result-title'].ar;
    if (uploadTitle) uploadTitle.textContent = elementsToTranslate['upload-title'].ar;
    if (uploadClick) uploadClick.textContent = elementsToTranslate['upload-click'].ar;
    if (uploadFormats) uploadFormats.textContent = elementsToTranslate['upload-formats'].ar;
  }
  
  function translateToEnglish() {
    if (generateBtn) generateBtn.textContent = elementsToTranslate['btn-generate'].en;
    if (toggleAll) toggleAll.textContent = elementsToTranslate['toggle-all'].en;
    
  }
  
  updatePageDirectionAndText();
  
  langSel.addEventListener("change", updatePageDirectionAndText);
  
  document.querySelector('.col')?.classList.remove('visible');
  document.querySelector('.results-list')?.classList.remove('visible');
  
  generateBtn.addEventListener("click", () => {
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
  });
  
  fileInput.addEventListener("change", function(e) {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      
      const reader = new FileReader();
      reader.onload = function(e) {
        $("#preview").src = e.target.result;
        document.querySelector('.col').classList.add('visible');
        document.querySelector('.results-list').classList.add('visible');
        
        const list = $("#lines");
        list.innerHTML = "";
        const li = create("li");
        li.textContent = langSel.value === 'ar' ? 
          "تم رفع الصورة، انقر على 'إنشاء النص' للمعالجة" : 
          "Image uploaded, click 'Generate text' to process";
        li.style.color = "#6c757d";
        li.style.fontStyle = "italic";
        list.appendChild(li);
        
        setTimeout(() => {
          const img = $("#preview");
          if (img.complete) {
            state.imageNatural.w = img.naturalWidth;
            state.imageNatural.h = img.naturalHeight;
            fitCanvasToImage();
          } else {
            img.onload = () => {
              state.imageNatural.w = img.naturalWidth;
              state.imageNatural.h = img.naturalHeight;
              fitCanvasToImage();
            };
          }
        }, 100);
      }
      reader.readAsDataURL(file);
    }
  });
  
  toggleAll.addEventListener("click", (e)=>{ 
    state.showAll = !state.showAll;
    
    if (langSel.value === 'ar') {
      toggleAll.textContent = state.showAll ? "إخفاء الصناديق" : "إظهار كل الصناديق";
    } else {
      toggleAll.textContent = state.showAll ? "Hide Boxes" : "Show All Boxes";
    }
    
    drawBoxes(); 
  });

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const file = fileInput.files[0];
    if(!file){
      statusDiv.textContent = langSel.value === 'ar' ? 
        "الرجاء اختيار صورة أولاً" : 
        "Please select an image first.";
      statusDiv.style.color = "var(--bad)";
      return;
    }
    
    state.startTime = new Date();
    
    smallLoader.style.display = "inline-block";
    
    statusDiv.textContent = langSel.value === 'ar' ? 
      "جارِ معالجة الصورة..." : 
      "Processing image...";
    statusDiv.style.color = "var(--muted)";

    try {
      const clasifierValue = clasifierSel.value === 'ar';
      const data = await callExtract(file, langSel.value, clasifierValue);

      const endTime = new Date();
      const processingTime = (endTime - state.startTime) / 1000;
      
      statusDiv.textContent = data?.signal || data?.status || 
        (langSel.value === 'ar' ? "تم بنجاح" : "Success");
      statusDiv.style.color = "var(--ok)";
      parseResponse(data);
      renderLines();
      drawBoxes();
      
    } catch(err) {
      console.error(err);
      statusDiv.textContent = langSel.value === 'ar' ? 
        "خطأ أثناء معالجة الصورة" : 
        "Error processing image";
      statusDiv.style.color = "var(--bad)";
      
      const list = $("#lines");
      list.innerHTML = "";
      const li = create("li");
      li.textContent = langSel.value === 'ar' ? 
        "حدث خطأ أثناء المعالجة" : 
        "Error during processing";
      li.style.color = "#dc3545";
      list.appendChild(li);
    } finally {
      smallLoader.style.display = "none";
    }
  });

  const img = $("#preview");
  const observer = new ResizeObserver(fitCanvasToImage);
  observer.observe(img);
});