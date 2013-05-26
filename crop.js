var canvasCrop = {

    fileId:"file",

    canvasId: "canvas",

    getCanvas: function(){
        return document.getElementById(this.canvasId)
    },
    
    getOriginImage: function(){
        return this.originImage    
    },
    
    getCurrentImage: function(){
        return this.currentImage    
    },

    selecting: false,

    selectRectangle: {
        x: 0,
        y: 0,
        x1: 0,
        y1: 0
    },

    initialize: function(options){
        var self = this;
        this.canvasId = options.canvasId;
        this.fileId = options.fileId;
        var file = document.getElementById(this.fileId);
        file.addEventListener("change", function(event){
            var fileReader = new FileReader();
            fileReader.onload = function(event){
                self.originImage = new Image();
                self.originImage.onload = function () {
                    self.fillCanvas();
                }
                self.originImage.src = event.target.result;
                
            };
            fileReader.readAsDataURL(event.target.files[0]);
        }, false);
    },

    fillCanvas: function(){
        var canvas = this.getCanvas();
        var img = this.getOriginImage();
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var imageWidth = img.width;
        var imageHeight = img.height;

        var scaleWidth = imageWidth < imageHeight;
        var scale = 1;
        if (scaleWidth) {
            scale = canvasWidth / imageWidth;
        } else {
            scale = canvasHeight / imageHeight;
        }
        var newImageWidth = imageWidth * scale;
        var newImageHeight = imageHeight * scale;
        var x = (canvasWidth - newImageWidth) / 2;
        var y = (canvasHeight - newImageHeight) / 2;

        var ctx = this.getCanvas().getContext('2d');
        ctx.drawImage(this.getOriginImage(), 0, 0, imageWidth, imageHeight, x, y, newImageWidth, newImageHeight);
        this.currentImage = new Image();
        this.currentImage.src = canvas.toDataURL();
    },

    enableCrop: function(){
        var self = this;
        var canvas = this.getCanvas();
        var ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'rgba( 0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.addEventListener("mousedown", function(event){
            self.mouseDownHandle(event, self);
        }, false);
        canvas.addEventListener("mouseup", function(event){
            self.mouseUpHandle(event, self);
        }, false);
        canvas.addEventListener("mousemove", function(event){
            self.mouseMoveHandle(event, self);
        }, false);
    },

    disableCrop: function(){
        var canvas = this.getCanvas();
        this.fillCanvas();
        canvas.removeEventListener("mousedown", function(){}, false);
        canvas.removeEventListener("mouseup", function(){}, false);
        canvas.removeEventListener("mousemove", function(){}, false);
    },

    mouseDownHandle: function(event, reference){
        reference.selecting = true;
        reference.selectRectangle.x = event.offsetX - reference.getCurrentImage().offsetLeft;
        reference.selectRectangle.y = event.offsetY - reference.getCurrentImage().offsetTop;
        console.log("Begin select rectangle is:",reference.selectRectangle);
    },

    mouseUpHandle: function(event, reference){
        reference.selecting = false;
        console.log("End select rectangle is:",reference.selectRectangle);
    },

    mouseMoveHandle: function(event, reference){
        if(reference.selecting){
            var canvas = reference.getCanvas();
            var img = reference.getCurrentImage();
            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;
            var imageWidth = img.width;
            var imageHeight = img.height;

            var scaleWidth = imageWidth < imageHeight;
            var scale = 1;
            if (scaleWidth) {
                scale = canvasWidth / imageWidth;
            } else {
                scale = canvasHeight / imageHeight;
            }
            var newImageWidth = imageWidth * scale;
            var newImageHeight = imageHeight * scale;

            var ctx = reference.getCanvas().getContext('2d');
            reference.fillCanvas();
            ctx.fillStyle = 'rgba( 0,0,0,0.8)';
            reference.selectRectangle.x1 = event.offsetX - reference.getCurrentImage().offsetLeft - reference.selectRectangle.x;
            reference.selectRectangle.y1 = event.offsetY - reference.getCurrentImage().offsetTop - reference.selectRectangle.y;

            ctx.fillRect( 0, 0, reference.selectRectangle.x, newImageHeight );
            ctx.fillRect( reference.selectRectangle.x + reference.selectRectangle.x1, 0, newImageWidth - reference.selectRectangle.x1, newImageHeight );
            ctx.fillRect( reference.selectRectangle.x, 0, reference.selectRectangle.x1, reference.selectRectangle.y );
            ctx.fillRect( reference.selectRectangle.x, reference.selectRectangle.y+reference.selectRectangle.y1, reference.selectRectangle.x1, newImageHeight - reference.selectRectangle.y1 );
        }
    },

    crop: function(){
        var canvas = this.getCanvas();
        var img = this.getCurrentImage();
        
        canvas.width = this.selectRectangle.x1;
        canvas.height = this.selectRectangle.y1;
        
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this.getCurrentImage(), 
        this.selectRectangle.x, this.selectRectangle.y,
        this.selectRectangle.x1, this.selectRectangle.y1,
        0, 0,
        this.selectRectangle.x1, this.selectRectangle.y1)
    }



}