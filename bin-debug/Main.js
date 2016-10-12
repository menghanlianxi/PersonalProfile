//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var AnimModes = (function () {
    function AnimModes() {
    }
    var d = __define,c=AnimModes,p=c.prototype;
    AnimModes.Anim_0 = 0;
    AnimModes.Anim_1 = 1;
    return AnimModes;
}());
egret.registerClass(AnimModes,'AnimModes');
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        //翻页
        this.Count = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.TurnBitmap = function (Array, Num, Text, Icon, Mask) {
        var _this = this;
        var distance = 0;
        var before = 0;
        var after = 0;
        var i = 0;
        for (i = 0; i < Array.length; i++) {
            Array[i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
                before = e.stageY;
            }, this);
            Array[i].addEventListener(egret.TouchEvent.TOUCH_END, function (e) {
                after = e.stageY;
                distance = before - after;
                if (distance > 0) {
                    _this.TurnDetermine(Num, distance, Array[_this.Count], Array[_this.Count + 1], Text[_this.Count], Text[_this.Count + 1], Icon[_this.Count], Icon[_this.Count + 1], Mask[_this.Count], Mask[_this.Count + 1]);
                }
                else {
                    _this.TurnDetermine(Num, distance, Array[_this.Count], Array[_this.Count - 1], Text[_this.Count], Text[_this.Count - 1], Icon[_this.Count], Icon[_this.Count - 1], Mask[_this.Count], Mask[_this.Count - 1]);
                }
            }, this);
        }
    };
    //显示文字
    p.showText = function (Text, A, X, Y) {
        var ST = egret.Tween.get(Text);
        ST.to({ "alpha": A, x: X, y: Y }, 500);
    };
    //显示黑框
    p.shouMask = function (Mask, A, X, Y) {
        var SM = egret.Tween.get(Mask);
        SM.to({ "alpha": A, x: X, y: Y }, 500);
    };
    //显示图片
    p.shouIcon = function (Icon, A, X, Y) {
        var SI = egret.Tween.get(Icon);
        SI.to({ "alpha": A, x: X, y: Y }, 500);
    };
    //判断翻页
    p.TurnDetermine = function (Num, Move, PB, PA, TB, TA, IB, IA, MB, MA) {
        if (Move < -300 && this.Count != 0) {
            this.shouIcon(IB, 0, IB.x, IB.y + 10);
            this.shouMask(MB, 0, MB.x, MB.y + 10);
            this.showText(TB, 0, TB.x, TB.y + 10);
            this.Turn(PB, PA);
            this.showText(TA, 1, TA.x, TA.y - 10);
            this.shouMask(MA, 1, MA.x, MA.y - 10);
            this.shouIcon(IA, 1, IA.x, IA.y - 10);
            if (PA.y == 1136 || PA.y == 0 || PA.y == -1136) {
                this.Count--;
            }
        }
        else if (Move > 300 && this.Count != Num) {
            this.shouIcon(IB, 0, IB.x, IB.y + 10);
            this.shouMask(MB, 0, MB.x, MB.y + 10);
            this.showText(TB, 0, TB.x, TB.y + 10);
            this.Turn(PB, PA);
            this.showText(TA, 1, TA.x, TA.y - 10);
            this.shouMask(MA, 1, MA.x, MA.y - 10);
            this.shouIcon(IA, 1, IA.x, IA.y - 10);
            if (PA.y == 1136 || PA.y == 0 || PA.y == -1136) {
                this.Count++;
            }
        }
    };
    //实现翻页
    p.Turn = function (BeforeMove, AfterMove) {
        var After = egret.Tween.get(AfterMove);
        var Before = egret.Tween.get(BeforeMove);
        var GOTO = 0;
        if (AfterMove.y == (BeforeMove.y + 1136)) {
            GOTO = BeforeMove.y - 1136;
            Before.to({ y: GOTO }, 500);
        }
        else if (AfterMove.y == (BeforeMove.y - 1136)) {
            GOTO = BeforeMove.y + 1136;
            Before.to({ y: GOTO }, 500);
        }
        After.to({ y: 0 }, 500);
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var sky = this.createBitmapByName("P1_jpeg");
        this.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;
        sky.touchEnabled = true;
        var Mask = new egret.Shape();
        this.addChild(Mask);
        Mask.graphics.beginFill(0x000000, 0.5);
        Mask.graphics.drawRect(0, 0, stageW, 275);
        Mask.graphics.endFill();
        Mask.y = 33;
        var icon = this.createBitmapByName("icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;
        var line = new egret.Shape();
        this.addChild(line);
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        var Start = new egret.TextField();
        this.addChild(Start);
        Start.textColor = 0xffffff;
        Start.width = stageW - 172;
        Start.textAlign = "center";
        Start.text = "Hello Worldﾞ";
        Start.size = 24;
        Start.x = 172;
        Start.y = 100;
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 150;
        this.textfield = textfield;
        //第二页
        var sky2 = this.createBitmapByName("P2_jpeg");
        this.addChild(sky2);
        sky2.width = stageW;
        sky2.height = stageH;
        sky2.x = 0;
        sky2.y = 1136;
        sky2.touchEnabled = true;
        var Mask2 = new egret.Shape();
        this.addChild(Mask2);
        Mask2.alpha = 0;
        Mask2.graphics.beginFill(0x000000, 0.5);
        Mask2.graphics.drawRect(0, 0, stageW, 1000);
        Mask2.graphics.endFill();
        Mask2.y = 68;
        var icon2 = this.createBitmapByName("icon1_jpg");
        this.addChild(icon2);
        icon2.alpha = 0;
        icon2.x = 225;
        icon2.y = 200;
        icon2.touchEnabled = true;
        icon2.addEventListener(egret.TouchEvent.TOUCH_TAP, IN, this);
        var introduc = new egret.TextField();
        this.addChild(introduc);
        introduc.alpha = 0;
        introduc.textColor = 0xE0E0E0;
        introduc.textAlign = "left";
        introduc.text = "         个人简介\n\n"
            + "+ 学号：14081121\n\n"
            + "+ 姓名：孟晗\n\n"
            + "+ 学院：软件学院\n\n"
            + "+ 专业：数字媒体技术\n\n"
            + "+ 爱好：看电影\n\n";
        introduc.size = 30;
        introduc.x = 185;
        introduc.y = 500;
        //点击滑入文字
        function IN(e) {
            egret.Tween.get(introduc).to({ x: 180, y: 270 }, 300, egret.Ease.sineIn);
        }
        //第三页
        var sky3 = this.createBitmapByName("P3_jpeg");
        this.addChild(sky3);
        sky3.width = stageW;
        sky3.height = stageH;
        sky3.x = 0;
        sky3.y = 1136;
        sky3.touchEnabled = true;
        var Mask3 = new egret.Shape();
        this.addChild(Mask3);
        Mask3.alpha = 0;
        Mask3.graphics.beginFill(0x000000, 0.5);
        Mask3.graphics.drawRect(0, 0, stageW, 1000);
        Mask3.graphics.endFill();
        Mask3.y = 68;
        var icon3 = this.createBitmapByName("icon2_png");
        this.addChild(icon3);
        icon3.alpha = 0;
        icon3.x = 320;
        icon3.y = 450;
        icon3.anchorOffsetX = icon3.width / 2;
        icon3.anchorOffsetY = icon3.height / 2;
        icon3.touchEnabled = true;
        icon3.addEventListener(egret.TouchEvent.ENTER_FRAME, ROTATE, this);
        var End = new egret.TextField();
        this.addChild(End);
        End.alpha = 0;
        End.textColor = 0xffffff;
        End.text = "  Thank you for watch ！";
        End.size = 40;
        End.x = 90;
        End.y = 850;
        //旋转
        var Anim_point = AnimModes.Anim_0;
        function ROTATE(e) {
            switch (Anim_point) {
                case AnimModes.Anim_0:
                    icon3.rotation += Main.STEP_ROT;
                    break;
                case AnimModes.Anim_1:
                    ;
                    break;
            }
        }
        var Num = 2;
        var Array = [sky, sky2, sky3];
        var Text = [Start, introduc, End];
        var Icon = [icon, icon2, icon3];
        var MASK = [Mask, Mask2, Mask3];
        this.TurnBitmap(Array, Num, Text, Icon, MASK);
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    Main.STEP_ROT = 1;
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map