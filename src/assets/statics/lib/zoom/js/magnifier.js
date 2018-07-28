// 导入模块
import jQuery from 'jquery';
(function ($) {
    var fnName = 'magnifier';
    var magnifier = {
        magnifier: ".magnifier",
        container: ".magnifier-container",
        containerImg: '.images-cover',
        view: ".magnifier-view",
        width: 400,
        height: 400,
        moveView: ".move-view",
        moveWidth: null,
        zoom: 4,
        thumbnail: ".magnifier-line > ul",
        assembly: ".magnifier-btn",
        index: 0
    };
    window[fnName] = function (magnifierAttr) {
        if (typeof (magnifierAttr) == "object") {
            for (var n in magnifierAttr) {
                magnifier[n] = magnifierAttr[n];
            }
        }
        var _this = this;
        _this.magnifier = $(magnifier.magnifier);
        _this.container = _this.magnifier.find(magnifier.container);
        _this.view = _this.magnifier.find(magnifier.view);
        _this.moveView = _this.magnifier.find(magnifier.moveView);
        _this.thumbnail = _this.magnifier.find(magnifier.thumbnail);
        _this.assembly = _this.magnifier.find(magnifier.assembly);
        _this.containerImg = _this.magnifier.find(magnifier.containerImg);
        var imgBox = _this.containerImg;
        _this.magnifier.css({
            "width": magnifier.width
        });
        _this.container.css({
            "width": magnifier.width,
            "height": magnifier.height
        });
        _this.view.css({
            "width": magnifier.width,
            "height": magnifier.height
        });
        var boxMoveViewWidth, boxMoveViewHeight;
        if (magnifier.moveWidth) {
            boxMoveViewWidth = magnifier.moveWidth;
        } else {
            boxMoveViewWidth = magnifier.width / magnifier.zoom;
        }
        boxMoveViewHeight = boxMoveViewWidth;
        _this.moveView.css({
            "width": boxMoveViewWidth,
            "height": boxMoveViewHeight
        });
        var deviationXl, deviationXr, deviationYt, deviationYb, imgWidth, imgHieght, multiple;
        _this.eqImg = function () {
            var img = new Image(),
                src = _this.thumbnail.find("img").eq(magnifier.index).attr('src');
            img.src = src;
            containerWidth = magnifier.width;
            containerHeight = magnifier.height;
            _this.thumbnail.find('>*').removeClass('active').eq(magnifier.index).addClass('active');

            function imgLoadEnd() {
                if (img.width == 0) {
                    img.onload = imgLoadEnd;
                }
                var styleCss;
                if (img.width > img.height) {
                    imgWidth = magnifier.width;
                    imgHieght = img.height / (img.width / magnifier.width);
                    styleCss = "top:50%;margin-top:" + (-imgHieght / 2) + "px";
                } else {
                    imgWidth = img.width / (img.height / magnifier.width);
                    imgHieght = magnifier.width;
                    styleCss = "left:50%;margin-left:" + (-imgWidth / 2) + "px";
                }
                imgBox.empty().append('<img src="' + src + '" width="' + imgWidth + '" height="' + imgHieght + '" style="' + styleCss + '" />');
                multiple = magnifier.width / boxMoveViewWidth;
                _this.view.empty().append('<img src="' + src + '" width="' + imgWidth * multiple + '" height="' + imgHieght * multiple + '" />');
                deviationXl = (magnifier.width - imgWidth) / 2;
                deviationXr = magnifier.width - deviationXl - boxMoveViewWidth + 1;
                deviationYt = (magnifier.height - imgHieght) / 2;
                deviationYb = magnifier.height - deviationYt - boxMoveViewHeight + 1;
            }
            imgLoadEnd();
        }
        _this.eqImg();
        _this.moveFn = function (e) {
            var X = (e.clientX - _this.magnifier.offset().left) - boxMoveViewWidth / 2,
                Y = (e.clientY - _this.magnifier.offset().top + $(document).scrollTop()) - boxMoveViewHeight / 2;
            endX = (X > deviationXl) ? (X < deviationXr) ? X : deviationXr : deviationXl;
            endY = (Y > deviationYt) ? (Y < deviationYb) ? Y : deviationYb : deviationYt;
            endY = (endY > 0) ? (endY > (magnifier.width - boxMoveViewHeight)) ? (magnifier.height - boxMoveViewHeight) : endY : 0;
            _this.moveView.css({
                'left': endX,
                'top': endY,
                'display': "block"
            });
            positionX = (endX - (magnifier.width - imgWidth) / 2) * multiple;
            positionY = (endY - (magnifier.height - imgHieght) / 2) * multiple;
            _this.view.css({
                'display': "block"
            }).find('img').css({
                'margin-left': -positionX,
                'margin-top': -positionY
            });
        }
        _this.container.on('mousemove', function (e) {
            _this.moveFn(e);
        }).on('mouseleave', function () {
            _this.moveView.hide();
            _this.view.hide();
        });
        var thumbnailImg = _this.thumbnail.find('>*'),
            lineLenght = thumbnailImg.length;
        _this.imgMove = function (_boole) {
            (_boole) ? magnifier.index++: magnifier.index--;
            var _deviation = Math.ceil(magnifier.width / thumbnailImg.width() / 2);
            if (lineLenght < _deviation) {
                return false;
            }
            (magnifier.index < 0) ? magnifier.index = 0: (magnifier.index > lineLenght - _deviation) ? magnifier.index = lineLenght - _deviation : magnifier.index;
            var endLeft = (thumbnailImg.width() * magnifier.index) - thumbnailImg.width();
            _this.thumbnail.css({
                "left": ((endLeft > 0) ? -endLeft : 0) + "px"
            });
        }
        _this.assembly.find(">*").on('click', function () {
            _this.imgMove($(this).index());
        });
        thumbnailImg.on('click', function () {
            magnifier.index = $(this).index();
            _this.eqImg();
            _this.imgMove(magnifier.index);
        });
        _this.setIndex = function (n) {
            magnifier.index = (n) ? n : 0;
        }
        return _this;
    }
})(jQuery);