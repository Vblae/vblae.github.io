'use strict';

// fah89[]a
// wx3b08vP
// 0W6)$]KK
// &@vtpoQ=

// 134258190321

let events = {
  CLICK: "click",
  MOUSE_DOWN: "mousedown",
  MOUSE_UP: "mouseup",
  MOUSE_MOVE: "mousemove",
  MOUSE_ENTER: "mouseenter",
  MOUSE_EXIT: "mouseout",
  KEY_DOWN: "keydown",
  KEY_UP: "keyup"
};

let colors = (function() {
  let __colors = {};

  __colors.rgba = function(r, g, b, a) {
    return {r: r, g: g, b: b, a: a};
  };

  __colors.string = function(r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  __colors.rand = function() {
    let c = Math.random() * 4294967295,
        r = (c >> 0x18) & 0xFF,
        g = (c >> 0x10) & 0xFF,
        b = (c >> 0x08) & 0xFF;

    return __colors.string(r, g, b, 1);
  };

  return __colors;
})();

let utils = (function() {
  let __utils = {};

  __utils.pointDiff = function(u, v) {
    return {
      x: u.x - v.x,
      y: u.y - v.y
    };
  };

  __utils.containsPoint = function(x, y, bounds) {
    return __utils.inRange(x, bounds.x, bounds.x + bounds.w) && 
           __utils.inRange(y, bounds.y, bounds.y + bounds.h);
  };

  __utils.inRange = function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  };

  __utils.rangeOverlap = function(a0, a1, b0, b1) {
    return __utils.inRange(a0, b0, b1) ||
           __utils.inRange(a1, b0, b1) ||
           __utils.inRange(b0, a0, a1) ||
           __utils.inRange(b1, a0, a1);
  };

  __utils.boundingBoxOverlap = function (a, b) {
    return __utils.rangeOverlap(a.x, a.x + a.w, b.x, b.x + b.w) &&
           __utils.rangeOverlap(a.y, a.y + a.h, b.y, b.y + b.h);
  };

  function Node(data) {
    this.next = null;
    this.prev = null;
    this.data = data;
  }

  Node.prototype = Object.create(null);
  Node.prototype.constructor = Node;

  function List() {
    this.head = null;
    this.tail = null;
  }

  List.prototype = Object.create(null);
  List.prototype.constructor = List;

  List.prototype.allocateNode = function(n) {
    return new Node(n);
  };

  List.prototype.evaluateNode = function(n) {
    return n.data;
  };

  List.prototype.push = function(n) {
    return this.appendTail(n);
  }

  List.prototype.appendHead = function(n) {
    if(this.head === null){
      this.head = this.allocateNode(n);
      this.tail = this.head;
    }else{
      let head = this.allocateNode(n);
      head.next = this.head;

      this.head.prev = head;
      this.head = head;
    }
  };

  List.prototype.appendTail = function(n) {
    if(this.tail === null){
      this.tail = this.allocateNode(n);
      this.head = this.tail;
    }else{
      let tail = this.allocateNode(n);
      tail.prev = this.tail;

      this.tail.next = tail;
      this.tail = tail;
    }
  };

  List.prototype.remove = function(n) {
    n = this.find(n);
    if(n == null)
      return;

    if(n.prev == null && n.next == null){
      this.head = null;
      this.tail = null;
    }else if(n.prev == null){
      this.head = n.next;
      this.head.prev = null;
    }else if(n.next == null){
      this.tail = n.prev;
      this.tail.next = null;
    }else{
      n.prev.next = n.next;
      n.next.prev = n.prev;
    }

    n.prev = null;
    n.next = null;
  };

  List.prototype.each = function(f) {
    let curr = this.head;
    while(curr != null){
      f(this.evaluateNode(curr));
      curr = curr.next;
    }
  };

  List.prototype.while = function(f) {
    let curr = this.head;
    while(curr != null && f(this.evaluateNode(curr)))
      curr = curr.next;
  };

  List.prototype.find = function(n) {
    let curr = this.head;
    while(curr != null){
      if(this.evaluateNode(curr) === n)
        return curr;

      curr = curr.next;
    }

    return null;
  }

  List.prototype.reach = function(f) {
      let curr = this.tail;
      while(curr != null){
        f(this.evaluateNode(curr));
        curr = curr.prev;
    }
  };

  List.prototype.rwhile = function(f) {
    let curr = this.tail;
    while(curr != null && f(this.evaluateNode(curr)))
      curr = curr.prev;
  };

  function TransparentList() {
    List.call(this);
  }

  TransparentList.prototype = Object.create(List.prototype);
  TransparentList.prototype.constructor = TransparentList;

  TransparentList.prototype.allocateNode = function(n) {
    return n;
  };

  TransparentList.prototype.evaluateNode = function(n) {
    return n;
  };

  TransparentList.prototype.find = function(n) {
    return n;
  };

  function Queue() {
    List.call(this);
  }

  Queue.prototype = Object.create(List.prototype);
  Queue.prototype.constructor = Queue;

  Queue.prototype.isEmpty = function() {
    return this.head === null;
  }

  Queue.prototype.get = function() {
    if(this.head === null)
      return null;

    let head = this.head,
        next = this.head.next;

    if(next)
      next.prev = null;
    else
      this.tail = null;

    this.head = next;
    return this.evaluateNode(head);
  };

  Queue.prototype.add = function(n) {
    this.appendTail(n);
    return this;
  };

  Queue.prototype.addAll = function(l) {
    for(let i = 0; i < l; i++) {
      this.appendTail(l[i]);
    }

    return this;
  };

  function BoundingBox(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  BoundingBox.prototype = Object.create(null);
  BoundingBox.prototype.constructor = BoundingBox;

  BoundingBox.prototype.updatePosition = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  BoundingBox.prototype.updateDimension = function(w, h) {
    this.w = w;
    this.h = h;
    return this;
  };

  BoundingBox.prototype.contains = function(x, y) {
    return utils.inRange(x, this.x, this.x + this.w) && 
           utils.inRange(y, this.y, this.y + this.h);
  };

  function BoundingCircle(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  BoundingCircle.prototype = Object.create(null);
  BoundingCircle.prototype.constructor = BoundingCircle;

  BoundingCircle.prototype.updatePosition = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  BoundingCircle.prototype.updateRadius = function(r) {
    this.r = r;
    return this;
  };

  BoundingCircle.prototype.contains = function(x, y) {
    return Math.sqrt(x*x + y*y) - Math.sqrt(this.x*this.x + this.y*this.y) < this.r;
  }

  let __new = {};

  __new.List = function() {
    return new List();
  };

  __new.TransparentList = function() {
    return new TransparentList();
  };

  __new.Queue = function() {
    return new Queue();
  };

  __new.BoundingBox = function(x, y, w, h) {
    return new BoundingBox(x, y, w, h);
  };

  __new.BoundingCircle = function(x, y, r) {
    return new BoundingCircle(x, y, r);
  };

  let __copy = {};

  __copy.BoundingBox = function(b) {
    return new BoundingBox(b.x, b.y, b.w, b.h);
  }
  __utils.new = __new;
  __utils.copy = __copy;
  return __utils;
})();

let display = (function() {
  let __pr = null;

  let __display = {};

  let __region = null;

  let __eventListenerCache = new Map();

  __display.adjustCanvas = function(cnvs, w, h) {
    cnvs.setAttribute("width", w * __pr);
    cnvs.setAttribute("height", h * __pr);
    cnvs.style.width = w + "px";
    cnvs.style.height = h + "px";
    cnvs.getContext("2d").setTransform(__pr, 0, 0, __pr, 0, 0);
  };

  __display.init = function(id) {
    __region = new DrawingRegion(window.innerWidth, window.innerHeight);
    let cnvs = __region.cnvs,
        ctx = __region.ctx;

    __pr = (function() {
      let dpr = window.devicePixelRatio || 1,
          bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
      return dpr / bsr;
    })();

    __display.adjustCanvas(cnvs, __region.w, __region.h);
    ctx.translate(__region.tx, __region.ty);
    __region.clear();

    cnvs.setAttribute("id", id || "display");
    document.body.appendChild(cnvs);
    __display.region = __region;
  };

  __display.drawImage = function(image, dx, dy) {
    __region.ctx.drawImage(image, dx, dy, image.width / __pr, image.height / __pr);
  };

  __display.clear = function(c) {
    console.log("display clear");
    return __region.clear(c);
  };

  __display.clearRect = function(x, y, w, h, c) {
    return __region.clearRect(x, y, w, h, c);
  }

  __display.width = function() {
    return __region.w;
  };

  __display.height = function() {
    return __region.h;
  };

  __display.tx = function() {
    return __region.tx;
  };

  __display.ty = function() {
    return __region.ty;
  };

  __display.randx = function() {
    return -__region.tx + Math.random() * 2.0 * __region.tx;
  };

  __display.randy = function() {
    return -__region.ty + Math.random() * 2.0 * __region.ty;
  };

  __display.randpos = function() {
    return {x: __display.randx(), y: __display.randy()};
  };

  __display.onClick = function(f) {
    __addEventListener(events.CLICK, f);
  };

  __display.onMouseDown = function(f) {
    __addEventListener(events.MOUSE_DOWN, f);
  };

  __display.onMouseUp = function(f) {
    __addEventListener(events.MOUSE_UP, f);
  };

  __display.onMouseMove = function(f) {
    __addEventListener(events.MOUSE_MOVE, f);
  };

  __display.onMouseEnter = function(f) {
    __addEventListener(events.MOUSE_ENTER, f);
  };

  __display.onMouseExit = function(f) {
    __addEventListener(events.MOUSE_EXIT, f);
  };

  function __addEventListener(name, funct) {
    let wrapper = (e) => {
      funct({
        x: e.clientX - __region.tx,
        y: e.clientY - __region.ty,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey
      });
    };

    __region.cnvs.removeEventListener(name, __eventListenerCache.get(name));
    __region.cnvs.addEventListener(name, wrapper);
    __eventListenerCache.set(name, wrapper);
  }

  function DrawingRegion(w, h) {
    this.w = w;
    this.h = h;
    this.tx = w / 2.0;
    this.ty = h / 2.0;

    this.cnvs = document.createElement("canvas");
    this.ctx = this.cnvs.getContext("2d");
    this.parent = __region;
    this.observers = [];
  }

  DrawingRegion.prototype = Object.create(null);
  DrawingRegion.prototype.constructor = DrawingRegion;

  DrawingRegion.prototype.setParentRegion = function(p) {
    this.parent = p;
    return this;
  };

  DrawingRegion.prototype.addObserver = function(o) {
    this.observers.push(o);
  };

  DrawingRegion.prototype.notifyObservers = function() {
    for(let o of this.observers){
      if(o.onChange)
        o.onChange();
      else
        console.warn("Observer", o, "no onChange() defined");
    }
  }

  DrawingRegion.prototype.draw = function() {
    // __region.strokeRect(this.x - 1, this.y - 1, this.w + 2, this.h + 2, colors.string(155, 155, 155, 1));
    // __display.drawImage(this.cnvs, this.x, this.y);
    this.parent.drawImage(this.cnvs, this.x, this.y);
    return this;
  };

  DrawingRegion.prototype.drawImage = function(image, dx, dy) {
    this.ctx.drawImage(image, dx, dy, image.width / __pr, image.height / __pr);
    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.fillText = function(t, x, y, c) {
    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c)
      ctx.fillStyle = c;

    ctx.font = "16px Jura";
    ctx.fillText(t, x, y);

    if(c) 
      ctx.fillStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.fillRect = function(x, y, w, h, c) {
    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c)
      ctx.fillStyle = c;

    ctx.fillRect(x, y, w, h);

    if(c) 
      ctx.fillStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.strokeRect = function(x, y, w, h, c) {
    let ctx = this.ctx,
        oc = ctx.fillstyle;

    if(c)
      ctx.strokeStyle = c;

    ctx.strokeRect(x, y, w, h);

    if(c)
      ctx.strokeStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.fillArc = function(x, y, r, c) {
    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c) 
      ctx.fillStyle = c;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();

    if(c) 
      ctx.fillStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.strokeArc = function(x, y, r, c) {
    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c)
      ctx.strokeStyle = c;

    ctx.beginPath();
    ctx.arc(x, y, r, 0 , 2 * Math.PI, false);
    ctx.stroke();

    if(c)
      ctx.strokeStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.drawLine = function(sx, sy, ex, ey, c) {
    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c) 
      ctx.strokeStyle = c;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    if(c) 
      ctx.strokeStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.fillPath = function(l, c) {
    if(l.length <= 0)
      return this;

    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c)
      ctx.fillStyle = c;

    ctx.beginPath();
    ctx.moveTo(l[0].x, l[0].y);
    for(let i = 0; i < l.length; i++)
      ctx.lineTo(l[i].x, l[i].y);

    ctx.lineTo(x, y);
    ctx.fill();

    if(c)
      ctx.fillStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.strokePath = function(l, c) {
    if(l.length <= 0)
      return this;

    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(c)
      ctx.strokeStyle = c;

    ctx.beginPath();
    ctx.moveTo(l[0].x, l[0].y);
    for(let i = 1; i < l.length; i++)
      ctx.lineTo(l[i].x, l[i].y);

    ctx.stroke();

    if(c)
      ctx.strokeStyle = oc;

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.clear = function(c) {
    let ctx = this.ctx,
        oc = ctx.fillStyle;

    if(oc)
      ctx.fillStyle = c;

    ctx.fillRect(-this.tx, -this.ty, this.w, this.h);

    if(c)
      ctx.fillStyle = oc

    this.notifyObservers();
    return this;
  };

  DrawingRegion.prototype.clearRect = function(x, y, w, h, c) {
    this.fillRect(x, y, w, h, c);
    return this;
  }

  DrawingRegion.prototype.clearOnParent = function(c) {
    if(!this.parent)
      return this;

    this.parent.clearRect(this.x, this.y, this.w, this.h, c);
    return this;
  } 

  DrawingRegion.prototype.resize = function(w, h) {
    this.ctx.translate(-this.tx, -this.ty);
    __display.adjustCanvas(this.cnvs, w, h);

    this.w = w;
    this.h = h;
    this.tx = w / 2.0;
    this.ty = h / 2.0;

    this.ctx.translate(this.tx, this.ty);
    return this;
  }

  DrawingRegion.prototype.grow = function(dw, dh) {
    this.resize(this.w + dw, this.h + dh);
    return this;
  }

  DrawingRegion.prototype.contains = function(x, y) {
    return utils.containsPoint(x, y, this);
  };

  function DisplaceableDrawingRegion(x, y, w, h) {
    DrawingRegion.call(this, w, h);
    this.x = x;
    this.y = y;
  }

  DisplaceableDrawingRegion.prototype = Object.create(DrawingRegion.prototype);
  DisplaceableDrawingRegion.prototype.constructor = DisplaceableDrawingRegion;

  DisplaceableDrawingRegion.prototype.moveTo = function(x, y) {
    this.x = x;
    this.y = y;
  }

  let __new = {};

  __new.DrawingRegion = function(x, y, w, h) {
    let ddr = new DisplaceableDrawingRegion(x, y, w, h);
    __display.adjustCanvas(ddr.cnvs, ddr.w, ddr.h);
    ddr.ctx.translate(ddr.tx, ddr.ty);
    return ddr;
  }

  __display.new = __new;
  return __display;
})();

let mouse = (function() {
  let __mouse = {};

  let __isMouseDown = false;

  __mouse.onClick = function(f) {
    display.onClick(f);
  };

  __mouse.onMouseDown = function(f) {
    display.onMouseDown(f);
  };

  __mouse.onMouseUp = function(f) {
    display.onMouseUp(f);
  };

  __mouse.onMouseMove = function(f) {
    display.onMouseMove(f);
  };

  __mouse.onMouseEnter = function(f) {
    display.onMouseEnter(f);
  };

  __mouse.onMouseExit = function(f) {
    display.onMouseExit(f);
  };

  return __mouse;
})();

let keyboard = (function() {
  let __keyboard = {};

  let __eventListenerCache = new Map();

  __keyboard.onKeyDown = function(f) {
    __addEventListener(events.KEY_DOWN, f)
  };

  __keyboard.onKeyUp = function(f) {
    __addEventListener(events.KEY_UP, f);
  };

  function __addEventListener(name, funct) {
    let wrapper = (e) => {
      // e.preventDefault();
      funct(e);
    };

    document.removeEventListener(name, __eventListenerCache.get(name));
    document.addEventListener(name, wrapper);
    __eventListenerCache.set(name, wrapper);
  }

  return __keyboard;
})();

let windows = (function() {
  let __windows = {};

  let __availableWindowID = 0;
  let __availableWindowGroupID = 0;

   function WindowGroup(id) {
    this.id = id;
    this.overlapMap = {};
    this.onWindowCloseAction = null;
    this.foregroundWindow = null;
    this.windows = utils.new.TransparentList();
    this.windowMap = {};
  }

  WindowGroup.prototype = Object.create(null);
  WindowGroup.prototype.constructor = WindowGroup;

  WindowGroup.prototype.close = function(w, e) {
    this.calculateOverlapMap(w);
    for(let overlapId in this.overlapMap[w.id])
      this.windowMap[overlapId].forceDraw();

    delete this.windowMap[w.id];

    this.windows.remove(w);
    this.handleWindowClose(w, e);
  };

  WindowGroup.prototype.onWindowClose = function(f) {
    this.onWindowCloseAction = f;
  };

  WindowGroup.prototype.handleWindowClose = function(w, e) {

    if(this.onWindowCloseAction)
      this.onWindowCloseAction(w, e);

  };

  WindowGroup.prototype.clear = function() {
    this.windows.each((w) => {
      w.clear();
    });
  }

  WindowGroup.prototype.draw = function() {
    let requireRedraw = new Map();    
    this.windows.each((w) => {
      if(w.redrawHeader || w.redrawBody)
        requireRedraw.set(w.id, w);
    });

    let redrawSet = new Set();
    requireRedraw.forEach((value, id) => {
      if(redrawSet.has(id))
        return;

      redrawSet.add(id);
      function __addOverlappingWindows(w) {
        let visited = new Set(),
            visitQueue = utils.new.Queue();

        visitQueue.add(w.id);
        while(!visitQueue.isEmpty()) {
          let current = visitQueue.get();
          if(visited.has(current))
            continue;

          visited.add(current);
          redrawSet.add(current);
          let overlapping = this.overlapMap[current];
          for(let i = 0; i < overlapping.length; i++){
            if(visited.has(overlapping[i]))
              continue;

            visitQueue.add(overlapping[i]);
          }
        }
      }
      __addOverlappingWindows.call(this, value);
    });

    this.windows.each((w) => {
      if(redrawSet.has(w.id)){
        w.forceDraw();
        w.draw();
      }
    });
  };

  WindowGroup.prototype.addWindow = function(w) {
    w.group = this;
    this.foregroundWindow = w;
    this.windows.appendTail(w);
    this.windowMap[w.id] = w;
    this.calculateOverlapMap(w);
  };

  WindowGroup.prototype.calculateOverlapMap = function (w) {
    this.overlapMap[w.id] = this.getOverlapList(w);
  }

  WindowGroup.prototype.getOverlapList = function(w) {
    let overlapping = [];
    this.windows.each((other) => {
      if(w.id === other.id)
        return;

      if(utils.boundingBoxOverlap(w.lastBounds, other.bounds)){
        overlapping.push(other.id);
      }
    });
  
    return overlapping;
  };

  WindowGroup.prototype.bringWindowToFront = function(w) {
    this.windows.remove(w);
    this.windows.appendTail(w);
  };

  WindowGroup.prototype.onMouseDown = function(e) {
    this.windows.rwhile((curr) => {
      if(curr.contains(e.x, e.y)){
        if(this.foregroundWindow !=  curr){
          this.foregroundWindow = curr;
          this.foregroundWindow.forceDraw()
          this.bringWindowToFront(this.foregroundWindow);
        }

        this.foregroundWindow.handleMouseDown(e);
        return false;
      }

      this.foregroundWindow = null;
      return true;
    });
  };

  WindowGroup.prototype.onMouseUp = function(e) {
    if(this.foregroundWindow)
      this.foregroundWindow.handleMouseUp(e);
  };

  WindowGroup.prototype.onMouseMove = function(e) {
    if(this.foregroundWindow)
      this.foregroundWindow.handleMouseMove(e);
  };

  WindowGroup.prototype.onMouseEnter = function(e) {
    // nothing to do :|
  };

  WindowGroup.prototype.onMouseExit = function(e) {
    this.foregroundWindow = null;
  };

  WindowGroup.prototype.onKeyDown = function(e) {
    if(this.foregroundWindow)
      this.foregroundWindow.handleKeyDown(e);
  };

  WindowGroup.prototype.onKeyUp = function(e) {
    if(this.foregroundWindow)
      this.foregroundWindow.handleKeyUp(e);
  };

  function Window(x, y, w, h) {
    this.next = null;
    this.prev = null;

    this.id = null;
    this.group = null;
    this.minimized = false;
    this.redrawHeader = true;
    this.redrawBody = true;
    this.headerHeight = 25;
    this.header = display.new.DrawingRegion(x, y, w, this.headerHeight);
    this.body = display.new.DrawingRegion(x, y + this.headerHeight, w, h);
    this.body.addObserver(this);

    this.bounds = utils.new.BoundingBox(x, y, w, h + this.headerHeight);
    this.lastBounds = this.bounds;

    this.minimize = utils.new.BoundingBox(x + this.header.w - 55, y + this.headerHeight / 2 - 10, 20, 20);
    this.close = utils.new.BoundingBox(x + this.header.w - 25, y + this.headerHeight / 2 - 10, 15, 20);
    this.northWestResize = utils.new.BoundingBox(x, y, 10, 10);
    this.northEastResize = utils.new.BoundingBox(x + w - 10, y, 10, 10);
    this.southWestResize = utils.new.BoundingBox(x, y + h + this.headerHeight - 10, 10, 10);
    this.southEastResize = utils.new.BoundingBox(x + w - 10, y + h + this.headerHeight - 10, 10, 10);

    this.selectionDistance = 0.0;
    this.selectedElementIndex = -1;

    this.prevMouseOverElementIndex = -1;
    this.nextMouseOverElementIndex = -1;

    this.minimizeIconColor = Window.defaults.headerTextColor;
    this.closeIconColor = Window.defaults.headerTextColor;

    this.windowElements = [
      this.northWestResize,
      this.northEastResize,
      this.minimize,
      this.close,
      this.header,
      this.southWestResize,
      this.southEastResize,
    ];

    this.windowElementsOnMouseDown = [
      __calcSelectionDistance,
      __calcSelectionDistance,
      __minimizeWindow,
      __closeWindow,
      __calcSelectionDistance,
      __calcSelectionDistance,
      __calcSelectionDistance,
      __calcSelectionDistance,
    ];

    this.windowElementsOnMouseUp = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    this.windowElementsOnMouseDrag = [
        __northWestResize,
        __northEastResize,
        null,
        null,
        this.moveTo,
        __southWestResize,
        __southEastResize,
    ];

    this.windowElementsOnMouseEnter = [
      __onMouseEnterNorthWestResize,
      __onMouseEnterNorthEastResize,
      __onMouseEnterMinimize,
      __onMouseEnterClose,
      null,
      __onMouseEnterSouthWestResize,
      __onMouseEnterSouthEastResize,
    ];

    this.windowElementsOnMouseExit = [
      __onMouseExitNorthWestResize,
      __onMouseExitNorthEastResize,
      __onMouseExitMinimize,
      __onMouseExitClose,
      null,
      __onMouseExitSouthWestResize,
      __onMouseExitSouthEastResize,
    ];

    this.eventListenerCache = new Map();
    this.app = null;
  }

  Window.constraints = {
    minWidth: 200,
    minHeight: 50
  };

  Window.defaults = {
    bodyColor: colors.string(30, 30, 30, 1),
    headerColor: colors.string(0, 190, 112, 1),
    headerTextColor: colors.string(255, 255, 255, 1),
    mouseOverColor: colors.string(0, 0, 0, 1)
  };

  Window.prototype = Object.create(null);
  Window.prototype.constructor = Window;

  Window.prototype.attachApp = function(app) {
    this.app = app;
  };

  Window.prototype.drawingRegion = function() {
    return this.body;
  }

  Window.prototype.contains = function(x, y) {
    return this.bounds.contains(x, y);
  };

  Window.prototype.setParentRegion = function(p) {
    this.header.setParentRegion(p);
    this.body.setParentRegion(p);
  };

  Window.prototype.onChange = function() {
    this.forceDraw();
    return this;
  }

  Window.prototype.onMouseDown = function(f, o) {
    this.eventListenerCache[events.MOUSE_DOWN] = f.bind(o);
    return this;
  };

  Window.prototype.onMouseUp = function(f, o) {
    this.eventListenerCache[events.MOUSE_UP] = f.bind(o);
    return this;
  };

  Window.prototype.onMouseMove = function(f, o) {
    this.eventListenerCache[events.MOUSE_MOVE] = f.bind(o);
    return this;
  };

  Window.prototype.onKeyDown = function(f, o) {
    this.eventListenerCache[events.KEY_DOWN] = f.bind(o);
    return this;
  };

  Window.prototype.onKeyUp = function(f, o) {
    this.eventListenerCache[events.KEY_UP] = f.bind(o);
    return this;
  };

  Window.prototype.handleMouseDown = function(e) {
    if(this.selectElement(e))
      this.handleMouseDownInElement(e);
    else
      this.dispatchEvent(events.MOUSE_DOWN, e);
  };

  Window.prototype.handleMouseUp = function(e) {
      this.selectedElementIndex = -1;
      this.dispatchEvent(events.MOUSE_UP, e);
  };

  Window.prototype.handleMouseMove = function(e) {
    this.handleMouseOver(e);

    if(this.selectedElementIndex > -1)
      this.handleMouseDragInElement(e);
    else if(!this.minimized)
      this.dispatchEvent(events.MOUSE_MOVE, e);
  };

  Window.prototype.handleMouseOver = function(e) {
    this.mouseOverElement(e);
    if(this.prevMouseOverElementIndex == this.nextMouseOverElementIndex)
      return;

    if(this.prevMouseOverElementIndex > -1 && this.windowElementsOnMouseExit[this.prevMouseOverElementIndex])
      this.windowElementsOnMouseExit[this.prevMouseOverElementIndex].call(this, e);

    if(this.nextMouseOverElementIndex > -1 && this.windowElementsOnMouseEnter[this.nextMouseOverElementIndex])
      this.windowElementsOnMouseEnter[this.nextMouseOverElementIndex].call(this,e);

    this.prevMouseOverElementIndex = this.nextMouseOverElementIndex;
    this.nextMouseOverElementIndex = -1;
  };

  Window.prototype.handleMouseEnter = function(e) {

  };

  Window.prototype.handleMouseExit = function(e) {

  };

  Window.prototype.handleKeyDown = function(e) {
    this.dispatchEvent(events.KEY_DOWN, e);
  };

  Window.prototype.handleKeyUp = function(e) {
    this.dispatchEvent(events.KEY_UP, e);
  };

  Window.prototype.handleMouseDownInElement = function(e) {
    if(this.windowElementsOnMouseDown[this.selectedElementIndex])
      this.windowElementsOnMouseDown[this.selectedElementIndex].call(this, e);
  };

  Window.prototype.handleMouseDrag = function(e) {
    this.moveTo(e);
  }

  Window.prototype.handleMouseDragInElement = function(e) {
    if(this.windowElementsOnMouseDrag[this.selectedElementIndex])
      this.windowElementsOnMouseDrag[this.selectedElementIndex].call(this, e);
  }

  Window.prototype.dispatchEvent = function(name, e) {
    if(name && this.eventListenerCache[name] != null)
      this.eventListenerCache[name](this.toInnerCoordinates(e));
  }

  Window.prototype.selectElement = function(e) {
    for(let i = 0; i < this.windowElements.length; i++){
      if(this.windowElements[i].contains(e.x, e.y)){
        this.selectedElementIndex = i;
        return true;
      }
    }

    return false;
  };

  Window.prototype.mouseOverElement = function(e) {
    for(let i = 0; i < this.windowElements.length; i++){
      if(this.windowElements[i].contains(e.x, e.y)){
        this.nextMouseOverElementIndex = i;
        return true;
      }
    }

    this.nextMouseOverElementIndex = -1;
    return false;
  };

  Window.prototype.repositionWindowElements = function(x, y) {
    this.minimize.updatePosition(this.header.x + this.header.w - 55, this.header.y + this.header.h / 2 - 10);
    this.close.updatePosition(this.header.x + this.header.w - 25, this.header.y + this.header.h / 2 - 10);
    this.northWestResize.updatePosition(x, y);
    this.northEastResize.updatePosition(x + this.body.w - 10, y);
    this.southWestResize.updatePosition(x, y + this.body.h + this.header.h - 10);
    this.southEastResize.updatePosition(x + this.body.w - 10, y + this.body.h + this.header.h - 10);
  };

  Window.prototype.moveTo = function(e) {
    this.clear();
    this.redrawHeader = true;
    if(!this.minimized)
      this.redrawBody = true;

    let newx = e.x + this.selectionDistance.x,
        newy = e.y + this.selectionDistance.y;

    if(newx < -display.tx() - this.header.w + 10)
      newx = -display.tx() - this.header.w + 10;
    else if(newx > display.tx() - 10)
      newx = display.tx() - 10;

    if(newy < -display.ty())
      newy = -display.ty();
    else if(newy > display.ty() - this.header.h)
      newy = display.ty() - this.header.h;

    this.header.moveTo(newx, newy);
    this.body.moveTo(newx, newy + this.headerHeight);

    this.lastBounds = utils.copy.BoundingBox(this.bounds);
    this.bounds.updatePosition(newx, newy);
    this.repositionWindowElements(newx, newy);
    if(this.group)
      this.group.calculateOverlapMap(this);
  };

  Window.prototype.toInnerCoordinates = function(e) {
    e.x = e.x - this.body.x - this.body.tx;
    e.y = e.y - this.body.y - this.body.ty;
    return e;
  };

  Window.prototype.clear = function() {
    if(!this.minimized)
      this.body.clearOnParent();

    this.header.clearOnParent();
  };

  Window.prototype.clearBody = function() {
    this.body.clearOnParent();
  };

  Window.prototype.draw = function() {
    if(this.redrawHeader){
      this.header.clear(Window.defaults.headerColor);
      if(this.app && this.app.name)
        this.header.fillText(this.app.name, -this.header.tx + 10, -this.header.ty + 15,
          Window.defaults.headerTextColor);

      if(this.minimized)
        this.drawExpandIcon();
      else
        this.drawMinimizeIcon();

      this.drawCloseIcon();
      this.header.draw();
      this.redrawHeader = false;
    }

    if(!this.minimized && this.redrawBody)
      this.body.draw();

    this.redrawBody = false;
  };

  Window.prototype.forceDraw = function() {
    this.redrawHeader = true;
    this.redrawBody = true;
  }

  Window.prototype.forceBodyDraw = function() {
    this.redrawBody = true;
  }

  Window.prototype.drawExpandIcon = function() {
    this.header.strokeRect(this.header.tx - 55, -8, 20, 16, this.minimizeIconColor);
    this.header.drawLine(this.header.tx - 55, -5, this.header.tx - 35, -5, this.minimizeIconColor);
  };

  Window.prototype.drawMinimizeIcon = function() {
    this.header.drawLine(this.header.tx - 55, 0, this.header.tx - 35, 0, this.minimizeIconColor);
  };

  Window.prototype.drawCloseIcon = function() {
    this.header.drawLine(this.header.tx - 25, -8, this.header.tx - 10, 8, this.closeIconColor);
    this.header.drawLine(this.header.tx - 25, 8, this.header.tx - 10, -8, this.closeIconColor);
  };

  function __calcSelectionDistance(e) {
    this.selectionDistance = utils.pointDiff(this.windowElements[this.selectedElementIndex], e);
  }

  function __minimizeWindow(e) {
    this.clearBody();

    this.minimized = !this.minimized;
    
    this.redrawHeader = true;
    if(!this.minimized)
      this.redrawBody = true;

    if(this.minimized)
      this.bounds.updateDimension(this.header.w, this.header.h);
    else
      this.bounds.updateDimension(this.header.w, this.header.h + this.body.h);

    if(this.group)
      this.group.calculateOverlapMap(this);
  }

  function __closeWindow(e) {
    this.clear();
    this.group.close(this, e);
  }

  function __onMouseEnterNorthWestResize(e) {
    document.body.style.cursor = "nw-resize";
  }

  function __onMouseExitNorthWestResize(e) {
    document.body.style.cursor = "default";
  }

  function __onMouseEnterNorthEastResize(e) {
    document.body.style.cursor = "ne-resize";
  }

  function __onMouseExitNorthEastResize(e) {
    document.body.style.cursor = "default";
  }

  function __onMouseEnterSouthWestResize(e) {
    document.body.style.cursor = "sw-resize";
  }

  function __onMouseExitSouthWestResize(e) {
    document.body.style.cursor = "default";
  }

  function __onMouseEnterSouthEastResize(e) {
    document.body.style.cursor = "se-resize";
  }

  function __onMouseExitSouthEastResize(e) {
    document.body.style.cursor = "default";
  }

  function __onMouseEnterMinimize(e) {
    this.minimizeIconColor = Window.defaults.mouseOverColor;
    this.redrawHeader = true;
  }

  function __onMouseExitMinimize(e) {
    this.minimizeIconColor = Window.defaults.headerTextColor;
    this.redrawHeader = true;
  }
  
  function __onMouseEnterClose(e) {
    this.closeIconColor = Window.defaults.mouseOverColor;
    this.redrawHeader = true;
  }

  function __onMouseExitClose(e) {
    this.closeIconColor = Window.defaults.headerTextColor;
    this.redrawHeader = true;
  }

  function __northWestResize(e) {
    this.clear();
    this.redrawHeader = true;
    if(!this.minimized)
      this.redrawBody = true;

    let newx = e.x + this.selectionDistance.x,
        newy = this.minimized ? this.northWestResize.y : e.y + this.selectionDistance.y,
        newWidth = this.body.w + (this.northWestResize.x - newx),
        newHeight = this.body.h + (this.northWestResize.y - newy);

    if(newWidth < Window.constraints.minWidth){
      newWidth = Window.constraints.minWidth;
      newx = this.northWestResize.x + (this.body.w - newWidth);
    }

    if(newHeight < Window.constraints.minHeight){
      newHeight = Window.constraints.minHeight;
      newy = this.northWestResize.y + (this.body.h - newHeight);
    }

    this.header.moveTo(newx, newy);
    this.body.moveTo(newx, newy + this.headerHeight);
    this.header.resize(newWidth, this.header.h);
    this.body.resize(newWidth, newHeight);

    this.lastBounds = utils.copy.BoundingBox(this.bounds);
    this.bounds.updatePosition(newx, newy);
    this.bounds.updateDimension(newWidth, newHeight + this.headerHeight);
    if(this.group)
      this.group.calculateOverlapMap(this);

    this.minimize.updatePosition(this.header.x + this.header.w - 55, this.header.y + this.header.h / 2 - 10);
    this.close.updatePosition(this.header.x + this.header.w - 25, this.header.y + this.header.h / 2 - 10);
    this.northWestResize.updatePosition(newx, newy);
    this.northEastResize.updatePosition(this.northEastResize.x, newy);
    this.southWestResize.updatePosition(newx, this.southWestResize.y);
  }

  function __northEastResize(e) {
    this.clear();
    this.redrawHeader = true;
    if(!this.minimized)
      this.redrawBody = true;

    let newx = e.x + this.selectionDistance.x,
        newy = this.minimized ? this.northEastResize.y : e.y + this.selectionDistance.y,
        newWidth = this.body.w + (newx - this.northEastResize.x),
        newHeight = this.body.h + (this.northEastResize.y - newy);

    if(newWidth < Window.constraints.minWidth){
      newWidth = Window.constraints.minWidth;
      newx = this.northEastResize.x + (newWidth - this.body.w);
    }

    if(newHeight < Window.constraints.minHeight){
      newHeight = Window.constraints.minHeight;
      newy = this.northEastResize.y + (this.body.h - newHeight);
    }

    this.header.moveTo(this.header.x, newy);
    this.body.moveTo(this.body.x, newy + this.headerHeight);
    this.header.resize(newWidth, this.header.h);
    this.body.resize(newWidth, newHeight);

    this.lastBounds = utils.copy.BoundingBox(this.bounds);
    this.bounds.updatePosition(this.bounds.x, newy);
    this.bounds.updateDimension(newWidth, newHeight + this.headerHeight);
    if(this.group)
      this.group.calculateOverlapMap(this);

    this.minimize.updatePosition(this.header.x + this.header.w - 55, this.header.y + this.header.h / 2 - 10);
    this.close.updatePosition(this.header.x + this.header.w - 25, this.header.y + this.header.h / 2 - 10);
    this.northWestResize.updatePosition(this.northWestResize.x, newy);
    this.northEastResize.updatePosition(newx, newy);
    this.southEastResize.updatePosition(newx, this.southEastResize.y);
  }

  function __southWestResize(e) {
    this.clear();
    this.forceDraw();

    let newx = e.x + this.selectionDistance.x,
        newy = e.y + this.selectionDistance.y,
        newWidth = this.body.w + (this.southWestResize.x - newx),
        newHeight = this.body.h + (newy - this.southWestResize.y);

    if(newWidth < Window.constraints.minWidth){
     newWidth = Window.constraints.minWidth;
     newx = this.southWestResize.x + (this.body.w - newWidth);
    }

    if(newHeight < Window.constraints.minHeight){
      newHeight = Window.constraints.minHeight;
      newy = this.southWestResize.y + (newHeight - this.body.h);
    }

    this.header.moveTo(newx, this.header.y);
    this.body.moveTo(newx, this.body.y);
    this.header.resize(newWidth, this.header.h);
    this.body.resize(newWidth, newHeight);

    this.lastBounds = utils.copy.BoundingBox(this.bounds);
    this.bounds.updatePosition(newx, this.bounds.y);
    this.bounds.updateDimension(newWidth, newHeight + this.headerHeight);
    if(this.group)
      this.group.calculateOverlapMap(this);

    this.northWestResize.updatePosition(newx, this.northWestResize.y);
    this.southWestResize.updatePosition(newx, newy);
    this.southEastResize.updatePosition(this.southEastResize.x, newy);
  }

  function __southEastResize(e) {
    this.clear();
    this.forceDraw();

    let newx = e.x + this.selectionDistance.x,
        newy = e.y + this.selectionDistance.y,
        newWidth = this.body.w + (newx - this.southEastResize.x),
        newHeight = this.body.h + (newy - this.southEastResize.y);

    if(newWidth < Window.constraints.minWidth){
     newWidth = Window.constraints.minWidth;
     newx = this.southEastResize.x + (newWidth - this.body.w);
    }

    if(newHeight < Window.constraints.minHeight){
      newHeight = Window.constraints.minHeight;
      newy = this.southEastResize.y + (newHeight - this.body.h);
    }

    this.header.resize(newWidth, this.header.h);
    this.body.resize(newWidth, newHeight);

    this.lastBounds = utils.copy.BoundingBox(this.bounds);
    this.bounds.updateDimension(newWidth, newHeight + this.headerHeight);
    this.minimize.updatePosition(this.header.x + this.header.w - 55, this.header.y + this.header.h / 2 - 10);
    if(this.group)
      this.group.calculateOverlapMap(this);

    this.close.updatePosition(this.header.x + this.header.w - 25, this.header.y + this.header.h / 2 - 10);
    this.northEastResize.updatePosition(newx, this.northEastResize.y);
    this.southWestResize.updatePosition(this.southWestResize.x, newy);
    this.southEastResize.updatePosition(newx, newy);
  }

  let __new = {};

  __new.Window = function (x, y, w, h) {
    let newWindow = new Window(x, y, w, h);
    newWindow.id = __availableWindowID++;
    return newWindow;
  };

  __new.WindowGroup = function() {
    return new WindowGroup(__availableWindowGroupID++);
  }

  __windows.new = __new;
  return __windows;
})();

let os = (() => {
  let __os = {};

  let __apps = utils.new.List();

  let __uninitializedApps = [];

  let __foregroundApp = null;

  let __windows = windows.new.WindowGroup();

  __windows.onWindowClose((w, e) => {

  });

  __os.init = () => {
    display.init();
    mouse.onMouseDown((e) => {
      __os.onMouseDown(e);
    });

    mouse.onMouseUp((e) => {
      __os.onMouseUp(e);
    });

    mouse.onMouseMove((e) => {
      __os.onMouseMove(e);
    });

    keyboard.onKeyDown((e) => {
      __os.onKeyDown(e);
    });

    keyboard.onKeyUp((e) => {
      __os.onKeyUp(e);
    });
  };

  __os.run = () => {
    for(let i = __uninitializedApps.length - 1; i >= 0; i--){
      let app = __uninitializedApps[i];
      if(!app.initialized && app.init)
        app.init();

      if(!app.started && app.start)
        app.start();

      if(app && app.update)
        app.update();

      __uninitializedApps.splice(i, 1);
    }

    if(__foregroundApp && __foregroundApp.update)
        __foregroundApp.update();

    __windows.draw();
    requestAnimationFrame(__os.run);
  };

  __os.onMouseDown = (e) => {
    __windows.onMouseDown(e);
    if(__windows.foregroundWindow)
      __foregroundApp = __windows.foregroundWindow.app;
    else
      __foregroundApp = null;
  };

  __os.onMouseUp = (e) => {
    __windows.onMouseUp(e);
  };

  __os.onMouseMove = (e) => {
    __windows.onMouseMove(e);
  };

  __os.onKeyDown = (e) => {
    __windows.onKeyDown(e);
  };

  __os.onKeyUp = (e) => {
    __windows.onKeyUp(e);
  };

  __os.onClose = (w, e) => {
    let app = w.app;
  };

  function Application(name, x, y, w, h) {
    this.name = name;
    this.initialized = false;
    this.started = false;

    this.init = null;
    this.start = null;
    this.update = null;

    this.context = {};
    this.window = windows.new.Window(x, y, w, h);
    this.window.attachApp(this);
    __windows.addWindow(this.window);
  }

  Application.prototype = Object.create(null); 
  Application.prototype.constructor = Application;

  Application.prototype.onInit = function(f) {
    this.init = function() {
      this.initialized = true;
      f.call(this);
    }

    this.init.bind(this);
    return this;
  };

  Application.prototype.onStart = function(f) {
    this.start = function() {
      this.started = true;
      f.call(this);
    };

    this.start.bind(this);
    return this;
  };

  Application.prototype.onUpdate = function(f) {
    this.update = f;
    this.update.bind(this);
    return this;
  };

  Application.prototype.onMouseDown = function(f) {
    if(this.window)
      this.window.onMouseDown(f, this);

    return this;
  };

  Application.prototype.onMouseUp = function(f) {
    if(this.window)
      this.window.onMouseUp(f, this);

    return this;
  };

  Application.prototype.onMouseMove = function(f) {
    if(this.window)
      this.window.onMouseMove(f, this);

    return this;
  };

  Application.prototype.onKeyDown = function(f) {
    if(this.window)
      this.window.onKeyDown(f, this);

    return this;
  };

  Application.prototype.onKeyUp = function(f) {
    if(this.window)
      this.window.onKeyUp(f, this);

    return this;
  };

  function __addApp(a) {
    __apps.push(a);
  }

  function __addUninitializedApp(a) {
    __uninitializedApps.push(a);
  }

  let __new = {};

  __new.Application = function(name, x, y, w, h) {
    let newApp = new Application(name ? name : "no-name", x, y, w, h);
    __foregroundApp = newApp;
    __addApp(newApp);
    __addUninitializedApp(newApp);
    return newApp;
  };

  __os.new = __new;
  return __os;
})();

os.init();

let app = os.new.Application("test-app", -display.tx() + 10, -display.ty() + 10, 1176, 600);

app.onInit(function() {
  this.context.clicks = [];
  this.context.clearColor = colors.string(30, 30, 30, 1);
  this.context.dx = 2;
  this.context.defaultClickColor = colors.string(255, 255, 255, 1);
  this.context.shiftClickColor = colors.string(120, 80, 0, 1);
});

app.onUpdate(function() {
  let clicks = this.context.clicks,
      drawingRegion = this.window.drawingRegion();

  drawingRegion.clear(this.context.clearColor);
  for(let c of clicks){
    drawingRegion.strokeArc(c.x, c.y, 10, c.c);
    if(c.c === this.context.defaultClickColor){
      c.x += this.context.dx;

      if (c.x > drawingRegion.tx + 10)
        c.x = -drawingRegion.tx - 10;
    } else {
      c.x -= this.context.dx;

      if (c.x < -drawingRegion.tx - 10)
        c.x = drawingRegion.tx + 10;
    }
  }
});

app.onMouseDown(function(e) {
  let color = e.shift ? this.context.shiftClickColor: this.context.defaultClickColor;
  this.context.clicks.push({x: e.x, y: e.y, c: color});
  this.context.redraw = true;
});

app.onKeyDown(function(e) {
  if(e.key == "c"){
    this.context.clicks = [];
    this.context.redraw = true;
  }
});

let otherApp = os.new.Application("other-app", 400, -100, 300, 100);

otherApp.onInit(function() {
  this.context.clicks = []
  this.context.clearColor = colors.string(200, 200, 200, 1);
});

otherApp.onUpdate(function() {
  let clicks = this.context.clicks,
      drawingRegion = this.window.drawingRegion();

  drawingRegion.clear(this.context.clearColor);  
  for(let c of clicks) {
    let x = c.x - 5 + (-2 + Math.random() * 5),
        y = c.y - 5 + (-2 + Math.random() * 4);
    drawingRegion.strokeRect(x, y, 10, 10, colors.string(0, 0, 0, 1));
  }
});

otherApp.onMouseMove(function(e) {
  if(this.context.shiftDown)
    this.context.clicks.push(e);
});

otherApp.onMouseDown(function(e) {
  this.context.shiftDown = true;
});

otherApp.onMouseUp(function(e) {
  this.context.shiftDown = false;
});

otherApp.onKeyDown(function(e) {
  if(e.key == "c"){
    this.context.clicks = [];
    this.context.redraw = true;
  }
});

os.run();
