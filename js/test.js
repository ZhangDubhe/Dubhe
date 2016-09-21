     //创建和初始化地图函数：
    function initMap(){
      createMap();//创建地图
      setMapEvent();//设置地图事件
      addMapControl();//向地图添加控件
      addMapOverlay();//向地图添加覆盖物
    }
    function createMap(){ 
      map = new BMap.Map("map"); 
      map.centerAndZoom(new BMap.Point(121.460608,31.036616),16);
    }
    function setMapEvent(){
      map.enableScrollWheelZoom();
      map.enableKeyboard();
      map.enableDragging();
      map.enableDoubleClickZoom()
    }
    function addClickHandler(target,window){
      target.addEventListener("click",function(){
        target.openInfoWindow(window);
      });
    }
    function addMapOverlay(){
      var plOpts = [
        {strokeColor:"#f00",strokeWeight:"4",strokeOpacity:"0.6"}
      ];
      var plPath = [
        [
          new BMap.Point(121.452703,31.041273),
          new BMap.Point(121.462332,31.044305),
          new BMap.Point(121.466572,31.032856),
          new BMap.Point(121.457517,31.030071),
          new BMap.Point(121.452703,31.041211),
          new BMap.Point(121.452703,31.041211),
          new BMap.Point(121.452703,31.041211)
        ],
      ];
      for(var index = 0; index < plOpts.length; index++){
        var polyline = new BMap.Polyline(plPath[index],plOpts[index]);
        map.addOverlay(polyline);
      }
    }
    //向地图添加控件
    function addMapControl(){
      var scaleControl = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT});
      scaleControl.setUnit(BMAP_UNIT_IMPERIAL);
      map.addControl(scaleControl);
      var navControl = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_RIGHT,type:0});
      map.addControl(navControl);
      var overviewControl = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:false});
      map.addControl(overviewControl);
    }

    var map;
      initMap();	
    
    var a=0;


