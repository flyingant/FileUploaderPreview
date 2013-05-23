var canvasCrop = {

    fileId:"file",

    canvasId: "canvas",

    initialize: function(options){
        var self = this;
        this.canvasId = options.canvasId;
        this.fileId = options.fileId;
        var file = document.getElementById(this.fileId);
        file.addEventListener("change", function(event){
            self.chooseFile(self, event.target.files[0]);
        }, this)
    },

    chooseFile: function(self, file){
        var fileReader = new FileReader();
        fileReader.onload = function(event){
            self.loadImage(self, event.target.result);
        };
        fileReader.readAsDataURL(file);
    },

    loadImage: function(self, imageURL){
        var img = new Image();
        img.onload = function () {
            var canvas = document.getElementById(self.canvasId);
            var ctx = canvas.getContext('2d');
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

            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, x, y, newImageWidth, newImageHeight);
        }
        img.src = imageURL;
    }



}