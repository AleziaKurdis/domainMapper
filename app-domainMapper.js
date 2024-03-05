//
//  app-domainMapper.js
//
//  Created by Alezia Kurdis, March 4th 2024.
//  Copyright 2024, Overte e.V.
//
//  Overte Application to generate a map of the occupied area in a domain by generating a 3d representation.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
(function() {
    var jsMainFileName = "app-domainMapper.js";
    var ROOT = Script.resolvePath('').split(jsMainFileName)[0];
    
    var APP_ICON_INACTIVE = ROOT + "icon_inactive_white.png";
    var ICON_CAPTION_COLOR = "#FFFFFF";
    if (ROOT.substr(0, 4) !== "http") {
        APP_ICON_INACTIVE = ROOT + "icon_inactive_green.png";
        ICON_CAPTION_COLOR = "#00FF00";
    }
    var APP_ICON_ACTIVE = ROOT + "icon_active.png";
    var APP_NAME = "DOMAP";
    var appStatus = false;

    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

    var domainMapID = Uuid.NULL;
    var FULL_DOMAIN_SCAN_RADIUS = 27713;
    var DOMAIN_SIZE = 32768;
    var DOMAIN_MAP_SIZE = 4; //in meters

    var button = tablet.addButton({
        text: APP_NAME,
        icon: APP_ICON_INACTIVE,
        activeIcon: APP_ICON_ACTIVE,
        captionColor: ICON_CAPTION_COLOR
    });

    function clicked(){
        var colorCaption;
        if (appStatus === true) {
            clearDomainMap();
            colorCaption = ICON_CAPTION_COLOR;
            appStatus = false;
        }else{
            drawDomainMap();
            colorCaption = "#000000";
            appStatus = true;
        }

        button.editProperties({
            isActive: appStatus,
            captionColor: colorCaption
        });
    }

    function drawDomainMap() {
        var i, id, properties;
        var domainName = location.hostname;
        if (domainName === "") {
            domainName = "SERVERLESS";
        }
        clearDomainMap();
        var zones = Entities.findEntitiesByType("Zone", {"x": 0, "y": 0, "z": 0}, FULL_DOMAIN_SCAN_RADIUS);
        print("ZONES: " + JSON.stringify(zones));
        domainMapID = Entities.addEntity({
            "name": "DOMAIN MAP - " + domainName,
            "type": "Shape",
            "shape": "Cube",
            "grab": {"grabbable": false },
            "dimensions": {"x": DOMAIN_MAP_SIZE, "y": DOMAIN_MAP_SIZE, "z": DOMAIN_MAP_SIZE},
            "position": Vec3.sum(MyAvatar.feetPosition, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: DOMAIN_MAP_SIZE/2, z: - DOMAIN_MAP_SIZE })),
            "color": {"red": 255, "green": 255, "blue": 255},
            "alpha": 0.25,
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "DOMAINE NAME",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 4, "y": 0.5, "z": 0.01},
            "localPosition": {"x": 0, "y": (DOMAIN_MAP_SIZE/2) + 0.7, "z": 0},
            "text": domainName,
            "lineHeight": 0.25,
            "textColor": {"red": 255, "green": 255, "blue": 255},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");
        
        id = Entities.addEntity({
            "name": "X AXIS",
            "type": "Shape",
            "shape": "Cylinder",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.02, "y": DOMAIN_MAP_SIZE, "z": 0.02},
            "localPosition": {"x": 0, "y": 0, "z": 0},
            "localRotation": Quat.fromVec3Degrees({"x": 0, "y": 0, "z": 90}),
            "color": {"red": 255, "green": 0, "blue": 0},
            "alpha": 0.8,
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "Y AXIS",
            "type": "Shape",
            "shape": "Cylinder",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.02, "y": DOMAIN_MAP_SIZE, "z": 0.02},
            "localPosition": {"x": 0, "y": 0, "z": 0},
            "localRotation": Quat.fromVec3Degrees({"x": 0, "y": 0, "z": 0}),
            "color": {"red": 0, "green": 255, "blue": 0},
            "alpha": 0.8,
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "Z AXIS",
            "type": "Shape",
            "shape": "Cylinder",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.02, "y": DOMAIN_MAP_SIZE, "z": 0.02},
            "localPosition": {"x": 0, "y": 0, "z": 0},
            "localRotation": Quat.fromVec3Degrees({"x": 90, "y": 0, "z": 0}),
            "color": {"red": 0, "green": 0, "blue": 255},
            "alpha": 0.8,
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "+X",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.3, "y": 0.2, "z": 0.01},
            "localPosition": {"x": (DOMAIN_MAP_SIZE/2) + 0.3, "y": 0, "z": 0},
            "text": "+X",
            "lineHeight": 0.15,
            "textColor": {"red": 255, "green": 0, "blue": 0},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "-X",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.3, "y": 0.2, "z": 0.01},
            "localPosition": {"x": (-DOMAIN_MAP_SIZE/2) - 0.3, "y": 0, "z": 0},
            "text": "-X",
            "lineHeight": 0.15,
            "textColor": {"red": 255, "green": 0, "blue": 0},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "+Y",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.3, "y": 0.2, "z": 0.01},
            "localPosition": {"x": 0, "y": (DOMAIN_MAP_SIZE/2) + 0.3, "z": 0},
            "text": "+Y",
            "lineHeight": 0.15,
            "textColor": {"red": 0, "green": 255, "blue": 0},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "-Y",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.3, "y": 0.2, "z": 0.01},
            "localPosition": {"x": 0, "y": (-DOMAIN_MAP_SIZE/2) - 0.3, "z": 0},
            "text": "-Y",
            "lineHeight": 0.15,
            "textColor": {"red": 0, "green": 255, "blue": 0},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "+Z",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.3, "y": 0.2, "z": 0.01},
            "localPosition": {"x": 0, "y": 0, "z": (DOMAIN_MAP_SIZE/2) + 0.3},
            "text": "+Z",
            "lineHeight": 0.15,
            "textColor": {"red": 0, "green": 0, "blue": 255},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        id = Entities.addEntity({
            "name": "-Z",
            "type": "Text",
            "parentID": domainMapID,
            "grab": {"grabbable": false },
            "dimensions": {"x": 0.3, "y": 0.2, "z": 0.01},
            "localPosition": {"x": 0, "y": 0, "z": (-DOMAIN_MAP_SIZE/2) - 0.3},
            "text": "-Z",
            "lineHeight": 0.15,
            "textColor": {"red": 0, "green": 0, "blue": 255},
            "textAlpha": 0.8,
            "backgroundAlpha": 0,
            "unlit": true,
            "alignment": "center",
            "billboardMode": "full",
            "canCastShadow": false,
            "collisionless": true
        }, "local");

        if (zones.length > 0) {
            for (i = 0; i < zones.length; i++) {
                properties = Entities.getEntityProperties(zones[i], ["position", "dimensions", "name", "rotation"]);
                id = Entities.addEntity({
                    "name": "Zone - " + properties.name,
                    "type": "Shape",
                    "shape": "Cube",
                    "parentID": domainMapID,
                    "grab": {"grabbable": false },
                    "dimensions": {"x": DOMAIN_MAP_SIZE * (properties.dimensions.x/DOMAIN_SIZE), "y": DOMAIN_MAP_SIZE * (properties.dimensions.y/DOMAIN_SIZE), "z": DOMAIN_MAP_SIZE * (properties.dimensions.z/DOMAIN_SIZE)},
                    "localPosition": {"x": (DOMAIN_MAP_SIZE/2) * (properties.position.x/(DOMAIN_SIZE/2)), "y": (DOMAIN_MAP_SIZE/2) * (properties.position.y/(DOMAIN_SIZE/2)), "z": (DOMAIN_MAP_SIZE/2) * (properties.position.z/(DOMAIN_SIZE/2)) },
                    "localRotation": properties.rotation,
                    "color": {"red": 255, "green": 255, "blue": 0},
                    "alpha": 0.25,
                    "canCastShadow": false,
                    "collisionless": true
                }, "local");
                
                var lineHight = DOMAIN_MAP_SIZE * (properties.dimensions.y/DOMAIN_SIZE) * 0.2;
                if (lineHight > 0.08) {
                    lineHight = 0.08;
                }
                if (lineHight < 0.01) {
                    lineHight = 0.01;
                }
                
                id = Entities.addEntity({
                    "name": "Zone Name - " + properties.name,
                    "type": "Text",
                    "parentID": domainMapID,
                    "grab": {"grabbable": false },
                    "dimensions": {"x": 4, "y": 0.1, "z": 0.01},
                    "localPosition": {"x": (DOMAIN_MAP_SIZE/2) * (properties.position.x/(DOMAIN_SIZE/2)), "y": (DOMAIN_MAP_SIZE/2) * (properties.position.y/(DOMAIN_SIZE/2)), "z": (DOMAIN_MAP_SIZE/2) * (properties.position.z/(DOMAIN_SIZE/2)) },
                    "text": properties.name,
                    "lineHeight": lineHight,
                    "textColor": {"red": 255, "green": 255, "blue": 0},
                    "textAlpha": 0.8,
                    "backgroundAlpha": 0,
                    "unlit": true,
                    "alignment": "center",
                    "billboardMode": "full",
                    "canCastShadow": false,
                    "collisionless": true
                }, "local");
            }
        }
        
    }

    function clearDomainMap() {
        if (domainMapID !== Uuid.NULL) {
            Entities.deleteEntity(domainMapID);
            domainMapID = Uuid.NULL;
        }
    }

    button.clicked.connect(clicked);

    function cleanup() {

        if (appStatus) {
            clearDomainMap();
        }

        tablet.removeButton(button);
    }

    Script.scriptEnding.connect(cleanup);
}());
