//var container = document.getElementById("img-container");
//var edit = document.getElementById("img-edit");

//console.log=function(){}

//minimum size of a box




//TODO
//*js in js
//*dump vars to file

//classes
class edititem{
  constructor(startX = -1, startY = -1, dimX = -1, dimY = -1){
    this.startX = startX;
    this.startY = startY;
    this.dimX   = dimX;
    this.dimY   = dimY;
  }
}
class Data{
  constructor(){
    this.canvasLoaded = false;
    this.imgLoaded    = false;
    this.indexEdit    = -1;
    this.pageEdits    = new Map();
    this.startY       = new Number();
  }
}
//holds global variables
var elearning = {};

function dimensionsGet(event){
  var canvasX2 = event['layerX'];
  var canvasY2 = event['layerY'];
  var startX = elearning.canvasX < canvasX2 ? elearning.canvasX : canvasX2;
  var startY = elearning.canvasY < canvasY2 ? elearning.canvasY : canvasY2;
  var dimX = Math.abs(elearning.canvasX - canvasX2);
  var dimY = Math.abs(elearning.canvasY - canvasY2);
  var ei = new edititem();
  ei.dimX = dimX;
  ei.dimY = dimY;
  ei.startX = startX;
  ei.startY = startY;
  return ei;
}

function edititemGet(posX,posY){
  var keys = Array.from(editmap.keys())
  for (var i=0;i<keys.length;++i){
    var it=editmap.get(keys[i])
    //console.log("getEditItem:"+it,it.id,posX,posY)
    if(it.startX < posX && it.startX+it.dimX > posX && it.startY < posY && it.startY+it.dimY > posY){
      return it.id
    }
  }
  return -1
}

function canvasGetIdInt(xCord, yCord){
  console.log('canvasGetIdInt', xCord, yCord);
  for(let idx = 1; idx <= elearning.pdfPageCount; ++idx){
    if(elearning.pages[idx].startY > yCord){
      return idx - 1;
    }
  }
}

function canvasGetElement(xCord, yCord){
  console.log('canvasGetElement', xCord, yCord);
  for(let idx = 1; idx <= elearning.pdfPageCount; ++idx){
    if(elearning.pages[idx].startY > yCord){
      return document.getElementById('canvas_' + (idx - 1));
    }
  }
}

function canvasGetIdStr(xCord, yCord){
  console.log('canvasGetIdStr', xCord, yCord);
  for(let idx = 1; idx <= elearning.pdfPageCount; ++idx){
    if(elearning.pages[idx].startY > yCord){
      return 'canvas_' + (idx - 1);
    }
  }
}

function highlightItem(id){
  if(activeIndex==id){
    console.log("return")
    return
  }
  unhighlightItem(activeIndex)
  activeIndex=id
  var cai=editmap.get(Number(activeIndex))
  var newActiveEdit=getEditDiv(activeIndex)
  newActiveEdit.style.background=COLOR_RECT_HIGHLIGHT
  var cav=getCanvas(activeIndex)
  container.removeChild(cav)
  var newcav=createCanvas(activeIndex,cai.startX,cai.startY,cai.dimX,cai.dimY,COLOR_RECT_HIGHLIGHT)
  container.appendChild(newcav)
}

function init(){
  console.log('init');
  //Initial handlers
  document.getElementById('input-file-new').addEventListener('change', listenerOnChangeInputFileNew);
  
  //document.addEventListener('mouseup', listenerOnMouseUpDocument);
  // create an observer instance. we observe if all pages have been loaded, after that they are inserted into the document.
  elearning.observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      let nodeName = mutation.addedNodes[0].id;
      let nodeId = nodeName.split('_');
      nodeId = Number.parseInt(nodeId[nodeId.length - 1], 10);
      if(nodeName.indexOf('canvas') != -1){
        elearning.pages[nodeId].canvasLoaded = true;
      }
      else if(nodeName.indexOf('img') != -1){
        elearning.pages[nodeId].imgLoaded = true;
      }
      if(elearning.pages[nodeId].imgLoaded == true
          && elearning.pages[nodeId].canvasLoaded == true){
        elearning.pdfPagesLoaded++;
      }
      if(elearning.pdfPagesLoaded == elearning.pdfPageCount){
        elearning.observer.disconnect();
        loadImages();
      }
    });
  });
  
  reinit();
  //elearning.observer.observe(elearning.layoutImages, {/*attributes:true,*/ childList: true/*, characterData: true*/});
}

function layoutBuild(){
  console.log('layoutBuild ' + elearning.pdfPageCount);
  
  for(let idx = 1; idx <= elearning.pdfPageCount; ++idx){
    let newcanvas = document.createElement('canvas');
    newcanvas.id = 'img-canvas_' + idx;
    let newimage = document.createElement('img');
    newimage.id = 'img-img_' + idx;
    newcanvas.addEventListener('mousedown', canvasMouseDown);
    
    elearning.layoutImages.appendChild(newcanvas);
    elearning.layoutImages.appendChild(newimage);
  }
  return;
}

function listenerOnChangeInputFileNew(evt){
  console.log('listenerOnChangeInputFileNew');
  
  let tgt = evt.target || window.event.srcElement;
  let files = tgt.files;
  
  if (FileReader && files && files.length) {
    fr = new FileReader();
    fr.onload = function(e){
      fileLoaded(e);
    }
    //fr.readAsBinaryString(files[0]);
    //fr.readAsArrayBuffer(files[0])
    fr.readAsDataURL(files[0]);
    //fr.readAsText(files[0]);
    elearning.pdfFile = files[0].name;
  }
  else {
    console.error('No FileReader support!')
  }
}

function listenerOnClickButtonLoad(){
  console.log("listenerOnClickButtonLoad");
}

function listenerOnClickDeleteEdit(event){
  console.log("listenerOnClickDeleteEdite")
  var c=event.target.id.replace("delete","canvas")
  var d= event.target.id.replace("delete","edit")
  document.getElementById(c).remove()
  document.getElementById(d).remove();
}

function listenerOnClickEdit(event){
  console.log("listenerOnClickEdit");
  var id=event.target.id.split("_")[1]
  highlightItem(id)
}


function listenerOnClickButtonNew(){
  console.log('listenerOnClickButtonNew');
  let fileinput = document.getElementById('input-file-new');
  fileinput.click();
  return;
}

function listenerOnClickButtonSave(){
  console.log("listenerOnClickButtonSave");
}

function fileLoaded(event){
  console.log('fileLoaded');
  reinit();
  elearning.pdfData = event.target.result;
  //elearning.pdfBinary = stringConvertBytearrayTo(elearning.pdfText);
  processPdf();
}

function listenerOnMouseDownBottomdiv(){
  console.log("listenerOnMouseDownBottomdiv");
}


function listenerOnMouseDownBottomleftdiv(){
  console.log("listenerOnMouseDownBottomleftdiv");
}

function listenerOnMouseDownBottomrightdiv(){
  console.log("listenerOnMouseDownBottomrightdiv");
}

function canvasMouseDown(event){
  console.log("canvasMouseDown",event.target);
  //console.log(event,canvasid)
  let canvas=document.getElementById(event.target.id)
  elearning.canvasX = event["layerX"]
  elearning.canvasY = event["layerY"]
  canvas.addEventListener("mousemove", previewResize)
  canvas.addEventListener("mouseup", previewFinish)
  //canvas.addEventListener("mouseout", listenerOnMouseOutCanvas);
  event.preventDefault()
}

function listenerOnMouseDownLeftdiv(){
  console.log("listenerOnMouseDownLeftdiv");
}

function listenerOnMouseDownMaindiv(event){
  console.log("listenerOnMouseDownMaindiv",event);
  elearning.startX=event["clientX"];
  elearning.startY=event["clientY"];
  event.target.addEventListener("mousemove", moveDiv)
  event.target.addEventListener("mouseup", moveDivStop)
}

function listenerOnMouseDownRightdiv(){
  console.log("listenerOnMouseDownRightdiv");
}

function listenerOnMouseDownTopdiv(){
  console.log("listenerOnMouseDownTopdiv");
}

function listenerOnMouseDownTopleftdiv(){
  console.log("listenerOnMouseDownTopleftdiv");
}

function listenerOnMouseDownToprightdiv(){
  console.log("listenerOnMouseDownToprightdiv");
}

function previewResize(event){
  console.log('previewResize', event);
  let dims = dimensionsGet(event);
  let canvas2 = document.getElementById('temprect');
  if(canvas2 != null){
    canvas2.remove();
  }
  canvas2 = rectCreatePreview(dims.startX, dims.startY, dims.dimX, dims.dimY, this.id);
  canvas2.id = 'temprect';
}

function listenerOnMouseMoveMaindiv(event){
  console.log("listenerOnMouseMoveMaindiv", event)
  var newX=event["clientX"];
  var newY=event["clientY"];
  var startX  = newX-elearning.startX
  var startY  = newY  - elearning.startY;
  var dimX  = event.target.style.width;
  var dimY  = event.target.style.height;

  //delete old position
  //while(document.querySelector('[id^="active-rect-"]') !== null){
  //  document.querySelector('[id^="active-rect-"]').remove();
  //}
  var canvasid=canvasGetIdInt(newX,newY);
  //TODO parse ints
  console.log(newX,newY,startX,startY,dimX,dimY,canvasid)
  var test=document.getElementById('active-rect-main_1')
  console.log(test)
  //rectCreateActive(newX,newY,dimX,dimY,canvasid);
  return
}

function listenerOnMouseOutCanvas(event){
  console.log('listenerOnMouseOutEventCanvas');
  return;
  let target = event.target;
  target = document.getElementById(target.id);
  target.removeEventListener('mousemove', listenerOnMouseMoveCanvas);
}

function previewFinish(event){
  console.log('previewFinish', this.id);
  let target = event.target;
  let int_targetId = target.id.split('_');
  int_targetId = Number.parseInt(int_targetId[int_targetId.length - 1], 10);
  let canvas = document.getElementById(this.id);
  canvas.removeEventListener('mousemove', previewResize);
  let temprect = document.getElementById('temprect');
  if(temprect != null){
    temprect.remove();
  }
  
  let canvasX2 = event['layerX'];
  let canvasY2 = event['layerY'];
  let startX = elearning.canvasX < canvasX2 ? elearning.canvasX : canvasX2;
  let startY = elearning.canvasY < canvasY2 ? elearning.canvasY : canvasY2;
  let dimX = Math.abs(elearning.canvasX - canvasX2);
  let dimY = Math.abs(elearning.canvasY - canvasY2);
  if(dimX < elearning.MINIMUM_SIZE_BOX || dimY < elearning.MINIMUM_SIZE_BOX){
    let it = edititemGet(canvasX2, canvasY2);
    if(it != -1){
      unhighlightItem(elearning.activeIndex);
      highlightItem(it);
    }
    return;
  }
  
  if(elearning.activeIndex != -1){
    unhighlightItem(elearning.activeIndex);
  }
  if(elearning.activeIndex != -1){
    let edit = elearning.edits[elearning.activeIndex];
    let last = rectCreateNormal(edit.startX, edit.startY, edit.dimX, edit.dimY, elearning.activeIndex);
    elearning.layoutImages.appendChild(last);
    rectRemoveActive();
  }

  let active = rectCreateActive(startX, startY, dimX, dimY, int_targetId);
  elearning.layoutImages.appendChild(active);
  elearning.activeIndex = elearning.editIndexUnique;

  elearning.edits[elearning.editIndexUnique] = new edititem(startX, startY, dimX, dimY);
  elearning.editIndexUnique++;
  
  //EDIT FIELD
  let newdiv = document.createElement('div');
  newdiv.id = 'edit_' + elearning.canvasIndex;
  newdiv.style.background = elearning.COLOR_RECT_HIGHLIGHT;
  newdiv.style.minHeight = '20px';
  newdiv.style.minWidth = '50px';
  newdiv.onclick = listenerOnClickEdit;
  let info = document.createElement('p');
  let lineedit = document.createElement('input');
  lineedit.type = 'text';
  let deletebutton = document.createElement('button');
  deletebutton.innerHTML = 'Delete';
  deletebutton.id = 'delete_' + elearning.canvasIndex;
  deletebutton.onclick = listenerOnClickDeleteEdit;
  info.innerHTML = 'canvasIndex:' + elearning.canvasIndex + '\nstartX:'+  startX + '\nstartY:' + startY + '\ndimX:' + dimX + '\ndimY:' + dimY;
  newdiv.appendChild(info);
  newdiv.appendChild(lineedit);
  newdiv.append(deletebutton);
  elearning.layoutEdits.insertBefore(newdiv, elearning.layoutEdits.firstChild);
  return;
}

function dbg(text){
  console.log(text);
}

function listenerOnMouseUpMaindiv(event){
  console.log("listenerOnMouseUpMaindiv")
  event.target.removeEventListener("mousemove", listenerOnMouseMoveMaindiv);
}

function listenerOnMouseUpDocument(event){
  console.log("listenerOnMouseUpDocument");
  for (var i=1;i<=elearning.pdfPageCount;++i){
    var elem=document.getElementById("img-canvas_"+i);
    //elem.removeEventListener("mousemove", listenerOnMouseMoveCanvas);
  }
}

function loadImages(){
  console.log('loadImages');
  //start with first image
  loadNextImage(1);
}

function loadNextImage(id){
  console.log('loadNextImage', id);
  if(typeof(id) !== 'number'){
    var img = document.getElementById(id.target.id);
    id = this.id.split('_')[1];
    id = Number(id) + 1;
    elearning.pages[id - 1].startY = img.offsetTop;
  }
  if(id > elearning.pdfPageCount){
    return;
  }
  elearning.pdfObject.getPage(id).then(function(page){
    var __CANVAS = document.getElementById('img-canvas_' + id);
    var __IMAGE = document.getElementById('img-img_' + id);
    var __CANVAS_CTX = __CANVAS.getContext('2d');
    var width = page.getViewport(1).width;
    var scale_required = __CANVAS.width / page.getViewport(1).width;
    //no vertical scroll after *1.1
    elearning.layoutImages.style.width = width * 1.1 + 'px';
    var viewport = page.getViewport(1);
    __CANVAS.style.display = 'none';
    __CANVAS.width = width;
    __CANVAS.style.width = width + 'px';
    __CANVAS.height = viewport.height;
    __CANVAS.style.height = viewport.height + 'px';

    var renderContext = {
      canvasContext: __CANVAS_CTX,
      viewport: viewport
    };
    
    page.render(renderContext).then(function(canvas = __CANVAS){
      var id = Number(canvas.id.split('_')[1]);
      //get previous element
      var prev = document.getElementById('img-canvas_' + (id - 1))
      var top = 0;
      if(prev !== null){
        top = prev.offsetTop + prev.height;
      }
      var img = document.getElementById('img-img_' + id);
      
      //postion canvas
      canvas.style.position = 'absolute';
      canvas.style.top = top + 'px';
      //position img under canvas;
      img.style.position = 'absolute';
      img.style.top = canvas.style.top;
      //set canvas z-index
      canvas.style.zIndex = 100;
      //prepare canvas clear
      var ctx = canvas.getContext('2d');
      //make canvas visible again
      canvas.style.display = 'inline';
      
      img.addEventListener('load', loadNextImage);
      
      img.src = canvas.toDataURL();
      //clear canvas
      ctx.clearRect(0,0,canvas.width, canvas.height);
    });
  
  });
}

function moveDiv(){

}

function moveDivStart(){

}

function moveDivStop(){

}

function processPdf(){
  console.log('processPdf');
  pdfjsLib.getDocument(elearning.pdfData)
  .then(function(pdf) {
    elearning.pdfObject = pdf;
    elearning.pdfPageCount = elearning.pdfObject.numPages;
    for(let idx = 1; idx <= elearning.pdfPageCount; ++idx){
      elearning.pages[idx] = new Data();
    }
    elearning.pdfCurrentPage = 1;
    return pdf;
  })
  .then(function(pdf){
    layoutBuild();
  });
}

function rectCreateActive(startX, startY, dimX, dimY, int_canvasId){
  console.log('rectCreateActive', startX, startY, dimX, dimY, int_canvasId);
  let retdiv = document.createElement('div');
  retdiv.id = 'active-rect';
  startY = elearning.pages[int_canvasId].startY + startY;
  //main
  let div                   = document.createElement('div');
  div.style.top             = startY    + 'px';
  div.style.left            = startX    + 'px';
  div.style.width           = dimX      + 'px';
  div.style.height          = dimY      + 'px';
  div.style.backgroundColor = elearning.COLOR_RECT_ACTIVE;
  div.style.zIndex          = elearning.ZINDEX_ACTIVE_RECT;
  div.style.position        = 'absolute';
  div.addEventListener('mousedown', rectMouseDown);
  div.id  = 'active-rect-main';
  
  //top
  let topdiv                    = document.createElement('div');
  topdiv.style.top              = startY - elearning.SIZE_BORDER_RECT   + 'px';
  topdiv.style.left             = startX                                + 'px';
  topdiv.style.width            = dimX                                  + 'px';
  topdiv.style.height           = elearning.SIZE_BORDER_RECT            + 'px';
  topdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  topdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  topdiv.style.position         = 'absolute';
  topdiv.addEventListener('mousedown', listenerOnMouseDownTopdiv);
  topdiv.id = 'active-rect-top';
  
  //bottom
  let bottomdiv                    = document.createElement('div');
  bottomdiv.style.top              = startY + dimY                         + 'px';
  bottomdiv.style.left             = startX                                + 'px';
  bottomdiv.style.width            = dimX                                  + 'px';
  bottomdiv.style.height           = elearning.SIZE_BORDER_RECT            + 'px';
  bottomdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  bottomdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  bottomdiv.style.position         = 'absolute';
  bottomdiv.addEventListener('mousedown', listenerOnMouseDownBottomdiv);
  bottomdiv.id = 'active-rect-bottom';
  
//right
  let rightdiv                    = document.createElement('div');
  rightdiv.style.top              = startY                          + 'px';
  rightdiv.style.left             = startX + dimX                   + 'px';
  rightdiv.style.width            = elearning.SIZE_BORDER_RECT      + 'px';
  rightdiv.style.height           = dimY                            + 'px';
  rightdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  rightdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  rightdiv.style.position         = 'absolute';
  rightdiv.addEventListener('mousedown', listenerOnMouseDownRightdiv);
  rightdiv.id = 'active-rect-right';
  
//left
  let leftdiv                    = document.createElement('div');
  leftdiv.style.top              = startY                               + 'px';
  leftdiv.style.left             = startX - elearning.SIZE_BORDER_RECT  + 'px';
  leftdiv.style.width            = elearning.SIZE_BORDER_RECT           + 'px';
  leftdiv.style.height           = dimY                                 + 'px';
  leftdiv.style.backgroundColor  = elearning.COLOR_RECT_TOP;
  leftdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  leftdiv.style.position         = 'absolute';
  leftdiv.addEventListener('mousedown', listenerOnMouseDownLeftdiv);
  leftdiv.id = 'active-rect-left';
  
  //topright
  let toprightdiv                    = document.createElement('div');
  toprightdiv.style.top              = startY - elearning.SIZE_BORDER_RECT   + 'px';
  toprightdiv.style.left             = startX + dimX                         + 'px';
  toprightdiv.style.width            = elearning.SIZE_BORDER_RECT            + 'px';
  toprightdiv.style.height           = elearning.SIZE_BORDER_RECT            + 'px';
  toprightdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  toprightdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  toprightdiv.style.position         = 'absolute';
  toprightdiv.addEventListener('mousedown', listenerOnMouseDownToprightdiv);
  toprightdiv.id = 'active-rect-topright';
  
  //topleft
  let topleftdiv                    = document.createElement('div');
  topleftdiv.style.top              = startY - elearning.SIZE_BORDER_RECT   + 'px';
  topleftdiv.style.left             = startX - elearning.SIZE_BORDER_RECT   + 'px';
  topleftdiv.style.width            = elearning.SIZE_BORDER_RECT            + 'px';
  topleftdiv.style.height           = elearning.SIZE_BORDER_RECT            + 'px';
  topleftdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  topleftdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  topleftdiv.style.position         = 'absolute';
  topleftdiv.addEventListener('mousedown', listenerOnMouseDownTopleftdiv);
  topleftdiv.id = 'active-rect-topleft';
  
  //bottomleft
  let bottomleftdiv                    = document.createElement('div');
  bottomleftdiv.style.top              = startY + dimY                        + 'px';
  bottomleftdiv.style.left             = startX - elearning.SIZE_BORDER_RECT  + 'px';
  bottomleftdiv.style.width            = elearning.SIZE_BORDER_RECT           + 'px';
  bottomleftdiv.style.height           = elearning.SIZE_BORDER_RECT           + 'px';
  bottomleftdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  bottomleftdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  bottomleftdiv.style.position         = 'absolute';
  bottomleftdiv.addEventListener('mousedown', listenerOnMouseDownBottomleftdiv);
  bottomleftdiv.id = 'active-rect-bottomleft';
  
  //bottomright
  let bottomrightdiv                    = document.createElement('div');
  bottomrightdiv.style.top              = startY + dimY                 + 'px';
  bottomrightdiv.style.left             = startX + dimX                 + 'px';
  bottomrightdiv.style.width            = elearning.SIZE_BORDER_RECT    + 'px';
  bottomrightdiv.style.height           = elearning.SIZE_BORDER_RECT    + 'px';
  bottomrightdiv.style.backgroundColor  = elearning.COLOR_RECT_CORNER;
  bottomrightdiv.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  bottomrightdiv.style.position         = 'absolute';
  bottomrightdiv.addEventListener('mousedown', listenerOnMouseDownBottomrightdiv);
  bottomrightdiv.id = 'active-rect-bottomright';

  retdiv.appendChild(div);
  retdiv.appendChild(leftdiv);
  retdiv.appendChild(rightdiv);
  retdiv.appendChild(topdiv);
  retdiv.appendChild(bottomdiv);
  retdiv.appendChild(topleftdiv);
  retdiv.appendChild(toprightdiv);
  retdiv.appendChild(bottomleftdiv);
  retdiv.appendChild(bottomrightdiv);
  return retdiv;
}

function rectCreateNormal(startX, startY, dimX, dimY, rectid){
  console.log('rectCreateNormal', startX, startY, dimX, dimY, rectid);
  let rect                    = document.createElement('div');
  rect.style.top              = startY                        + 'px';
  rect.style.left             = startX                        + 'px';
  rect.style.width            = dimX                          + 'px';
  rect.style.height           = dimY                          + 'px';
  rect.style.backgroundColor  = elearning.COLOR_RECT_DEFAULT;
  rect.style.zIndex           = elearning.ZINDEX_ACTIVE_RECT;
  rect.style.position         = 'absolute';
  rect.addEventListener('click', rectSelect);
  rect.id = 'rect_' + rectid;
  return rect;
}

function rectCreatePreview(startX, startY, dimX, dimY, divid){
  console.log('rectCreatePreview');
  let div = document.createElement('div');
  let id = divid.split('_');
  id = Number.parseInt(id[id.length - 1], 10);
  startY = elearning.pages[id].startY + startY;

  div.style.top     = startY  + 'px';
  div.style.left    = startX  + 'px';
  div.style.width   = dimX    + 'px';
  div.style.height  = dimY    + 'px';

  div.style.backgroundColor = elearning.COLOR_RECT_PREVIEW;
  div.style.zIndex = 50;
  div.style.position = 'absolute';
  elearning.layoutImages.appendChild(div);
  return div;
}

function rectSelect(event){
  console.log('rectSelect', event);
  let target = event.target;
  let int_id = target.id.split('_');
  int_id = Number.parseInt(int_id[int_id.length - 1], 10);
  if(isNaN(int_id)){
    return;
  }
  elearning.layoutImages.removeChild(target)
  //take care of previous active div, if any
  if(elearning.activeIndex != -1){
    rectRemoveActive();
    let edit = elearning.edits[elearning.activeIndex];
    let last = rectCreateNormal(edit.startX, edit.startY, edit.dimX, edit.dimY, elearning.activeIndex);
    last.addEventListener('click', rectSelect);
    elearning.layoutImages.appendChild(last)
  }
  elearning.activeIndex = int_id;
  let edit = elearning.edits[int_id];
  let parent = canvasGetIdInt(edit.startX, edit.startY);
  let active = rectCreateActive(edit.startX, edit.startY, edit.dimX, edit.dimY, parent);
  elearning.layoutImages.appendChild(active);
  return;
}

function rectRemoveActive(){
  console.log('rectRemoveActive');
  //delete old position
  while(document.querySelector('[id^="active-rect"]') !== null){
    document.querySelector('[id^="active-rect"]').remove();
  }
  return;
}

function rectMouseDown(event){
  console.log('rectMouseDown', event);
  let target = event.target;
  let id = target.id.split('_');
  id = id[id.length - 1];
  elearning.canvasX = event['clientX'];
  elearning.canvasY = event['clientY'];
  //move rect
  if(target.id.indexOf('active-rect-main') != -1){
    document.addEventListener('mousemove', rectMove);
    document.addEventListener('mouseup', rectMoveFinish);
  }

}

function rectMove(event){
  console.log('rectMove', event);
  let newX = event['clientX'];
  let newY = event['clientY'];
  let startX = newX - elearning.startX;
  let startY = newY - elearning.startY;
  let dimX = event.target.style.width;
  let dimY = event.target.style.height;

  //delete old position
  //while(document.querySelector('[id^="active-rect-"]') !== null){
  //  document.querySelector('[id^="active-rect-"]').remove();
  //}
  let canvasid = canvasGetIdInt(newX, newY);
  //TODO parse ints
  console.log(newX, newY, startX, startY, dimX, dimY, canvasid);
  let test = document.getElementById('active-rect-main_1');
  console.log(test);
  //rectCreateActive(newX,newY,dimX,dimY,canvasid);
  return;
}

function rectMoveFinish(event){
  console.log('rectMoveFinish', event);
  document.removeEventListener('mousemove', rectMove);
}

function reinit(){
  console.log('reinit');
  //observer that determines when to build the layout
  elearning.observer              ;
  //original position where the mousedown event was captured
  elearning.canvasX               = 0;
  elearning.canvasY               = 0;

  elearning.canvasIndex           = 1;
  elearning.activeIndex           = -1;
  elearning.pdfCurrentPage        = new Number();
  elearning.pdfData               = new String();
  elearning.pdfFile               = new String();
  elearning.pdfObject             ;//= new Uint8Array();

  //total number of pages
  elearning.pdfPageCount          = new Number();
  //number of pages that have loaded already
  elearning.pdfPagesLoaded        = new Number();
  //infos about pages except edits go here
  elearning.pages                 = new Map();

  elearning.pdfVersion            = new String();
  elearning.pdfImagesByPage       = new Map();
  elearning.layoutImages          = document.getElementById('img-container');
  elearning.layoutEdits           = document.getElementById('img-edit');

  //edit data for each edit goes here
  elearning.edits                 = new Map();

  //unique index for edits
  elearning.editIndexUnique       = 0;

  elearning.MINIMUM_SIZE_BOX      = 10;

  //colors
  elearning.COLOR_RECT_DEFAULT    = '#1aff5733';
  elearning.COLOR_RECT_ACTIVE     = '#1a33ff39';
  elearning.COLOR_RECT_PREVIEW    = '#1a11aa13';
  elearning.COLOR_RECT_TOP        = '#1a11dd13';
  elearning.COLOR_RECT_CORNER     = '#1a1122ff';

  elearning.SIZE_BORDER_RECT      = 20;
  elearning.ZINDEX_ACTIVE_RECT    = 200;
  
  elearning.startX = 0;
  elearning.startY = 0;
  
  elearning.layoutImages.style.height = '600px';
  
  elearning.layoutEdits.style.height = '600px';
  elearning.layoutEdits.style.minWidth = '400px';

  //clear old dom
  elearning.observer.disconnect();
  var canvi = document.getElementsByTagName('canvas');
  for(let idx = canvi.length - 1; idx >= 0; --idx){
    elearning.layoutImages.removeChild(canvi[idx]);
  }
  var imgs=document.getElementsByTagName('img');
  for(let idx = imgs.length - 1; idx >= 0; --idx){
    elearning.layoutImages.removeChild(imgs[idx]);
  }
  elearning.observer.observe(elearning.layoutImages, {/*attributes:true,*/ childList: true/*, characterData: true*/});
}

function unhighlightItem(id){
  return;
  console.log('unhighlightItem', id);
  let cav = getCanvas(id);
  let cai = editmap.get(id);
  let currentActiveEdit = getEditDiv(id);
  currentActiveEdit.style.background = COLOR_RECT_DEFAULT;
  container.removeChild(cav);
  container.appendChild(createCanvas(id, cai.startX, cai.startY, cai.dimX, cai.dimY, COLOR_RECT_DEFAULT));
}

