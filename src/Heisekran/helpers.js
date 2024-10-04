import * as THREE from "three";


export function createPlane(ri, textureObjects){
    let colorMap = textureObjects[0];

    let gPlane = new THREE.PlaneGeometry(1000, 1000, 10, 10);
			let mPlane = new THREE.MeshStandardMaterial({ map : colorMap, side: THREE.DoubleSide, wireframe:false });
			let meshPlane = new THREE.Mesh(gPlane, mPlane);
			meshPlane.rotation.x = Math.PI / 2;
			meshPlane.receiveShadow = true;	//NB!
			ri.scene.add(meshPlane);
}



export function createTire(ri){
let tireGrp = new THREE.Group()
let tireGeometry = new THREE.CylinderGeometry(5, 5, 3, 32); 
let tireMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
let tire = new THREE.Mesh(tireGeometry, tireMaterial);
tire.castShadow = true;
tire.rotation.z = Math.PI / 2; // Roter til stående
tireGrp.add(tire);

let rimGeometry = new THREE.CylinderGeometry(2, 2, 3.2, 32);  
let rimMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness : 0.5, roughness: 0.1 });
let rim = new THREE.Mesh(rimGeometry, rimMaterial);
rim.castShadow = true;
rim.rotation.z = Math.PI / 2;
tireGrp.add(rim);

let torusGeometry = new THREE.TorusGeometry(3.1, 1.9, 12, 48)
let tireTorus = new THREE.Mesh(torusGeometry, tireMaterial)
tireTorus.castShadow = true;
tireTorus.position.x = 0.4
tireTorus.rotation.y = Math.PI / 2;
tireGrp.add(tireTorus)



let hubGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
let hubcap = new THREE.Mesh(hubGeometry, rimMaterial);
hubcap.castShadow = true;
hubcap.position.x = 1.8
hubcap.rotation.z = Math.PI / 2;
tireGrp.add(hubcap);

let treadGrp = new THREE.Group()
for (let i = 0; i < 16; i++) {
    let treadGeometry = new THREE.BoxGeometry(0.2, 0.5, 3);  
    let treadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.6 });
    let tread = new THREE.Mesh(treadGeometry, treadMaterial);
    tread.castShadow = true;

    let angle = (i / 16) * Math.PI * 2;
    tread.position.x = Math.cos(angle) * 5.0;  
    tread.position.y = Math.sin(angle) * 5.0;
    tread.position.z = 0  

    tread.rotation.z = angle;
    
    treadGrp.add(tread);
}
treadGrp.rotation.y = Math.PI/2;
tireGrp.add(treadGrp)


tireGrp.rotation.y = -Math.PI/2;
tireGrp.scale.set(0.5, 0.5, 0.5);

return tireGrp

}

export function createTirePair(ri){

    let tirePair = new THREE.Group();
    let tire1 = createTire();
    tire1.rotation.y = Math.PI /2;
    tire1.position.set(0,0, -5)
    let tire2 = createTire();
    tire2.position.set(0,0,5)

    let axleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10)
    let material  = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6})
    let axle = new THREE.Mesh(axleGeometry, material)
    axle.castShadow = true;
    axle.rotation.x = Math.PI /2 ;
    tirePair.add(axle)

    tirePair.add(tire1)
    tirePair.add(tire2)

    return tirePair

}


export function createCraneBody(ri){

    let craneBody = new THREE.Group()
    let blackBaseGeometry = new THREE.BoxGeometry(35,  1, 12);
    let blackBaseMaterial = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6});
    let blackBase =  new THREE.Mesh(blackBaseGeometry, blackBaseMaterial);
    blackBase.castShadow = true;
    blackBase.position.y = 0.5;
    craneBody.add(blackBase);

    let whiteBaseGeometry = new THREE.BoxGeometry(25,  1, 12);
    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.9});
    whiteBaseMaterial.envMap = ri.cubeTexture;
    let whiteBase =  new THREE.Mesh(whiteBaseGeometry, whiteBaseMaterial);
    whiteBase.castShadow = true;
    whiteBase.position.x = 5;
    whiteBase.position.y = 1.5;
    craneBody.add(whiteBase);

    let wheelBaseGeometry = new THREE.BoxGeometry(35, 3, 6)
    let wheelBase = new THREE.Mesh(wheelBaseGeometry, blackBaseMaterial)
    wheelBase.castShadow = true;
    wheelBase.position.y = -1.5
    craneBody.add(wheelBase)

    
    

    ////frontbokser

    let extrudeSettings = {  //For ExtrudeGeometry 
        depth: 4,                     
        bevelEnabled: false             
    };

    let leftBoxShape = new THREE.Shape();
    leftBoxShape.moveTo(0,0);
    leftBoxShape.lineTo(1, 4);  
    leftBoxShape.lineTo(11, 4);
    leftBoxShape.lineTo(11, 0);
    leftBoxShape.lineTo(0, 0);
    let leftBoxGeometry = new THREE.ExtrudeGeometry(leftBoxShape, extrudeSettings);
    let leftBox = new THREE.Mesh(leftBoxGeometry, whiteBaseMaterial)
    leftBox.castShadow = true;
    leftBox.position.set(-18.5 ,1, -6)
    craneBody.add(leftBox)

    let middleBoxShape = new THREE.Shape();
    middleBoxShape.moveTo(0, 0);       
    middleBoxShape.lineTo(1, 3.9);         
    middleBoxShape.lineTo(11, 1.5); 
    middleBoxShape.lineTo(11, 0); 
    middleBoxShape.lineTo(0, 0);    

    
    let middleBoxGeometry = new THREE.ExtrudeGeometry(middleBoxShape, extrudeSettings);
    let middleBox = new THREE.Mesh(middleBoxGeometry, whiteBaseMaterial)
    middleBox.castShadow = true;

    middleBox.position.set(-18.5 ,1, -2)
    craneBody.add(middleBox)

    let baseFrontBoxGeometry = new THREE.BoxGeometry(10, 4, 4)
    let rightBox = new THREE.Mesh(baseFrontBoxGeometry, whiteBaseMaterial)
    rightBox.castShadow = true;
    rightBox.position.set(-12.5 ,3, 4)
    craneBody.add(rightBox)

    let blackTopBoxDetail = new THREE.BoxGeometry(7, 0.2, 3.6)
    let rightDetail = new THREE.Mesh(blackTopBoxDetail, blackBaseMaterial)
    rightDetail.castShadow = true;
    rightDetail.position.set(-13.5, 5, 4)
    craneBody.add(rightDetail)
    let leftDetail = new THREE.Mesh(blackTopBoxDetail, blackBaseMaterial);
    leftDetail.castShadow = true;
    leftDetail.position.set(-13.5, 5, -4)
    craneBody.add(leftDetail)


    

    craneBody.position.set(0,5,0)
    
    return craneBody
}

export function createStyrHus(ri) {

    let styrHus = new THREE.Group();
    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.9});
    whiteBaseMaterial.envMap = ri.cubeTexture;
    let redBaseMaterial = new THREE.MeshStandardMaterial({color: 0xee2222, roughness: 0.1, metalness : 0.9});
    redBaseMaterial.envMap = ri.cubeTexture;
    //rød frontdel
    let redPartShape = new THREE.Shape();
    redPartShape.moveTo(0,0);
    redPartShape.lineTo(0, 2.5);
    redPartShape.lineTo(8, 3.6);
    redPartShape.lineTo(8, 2.6);
    redPartShape.lineTo(6, 0);
    redPartShape.lineTo(0, 0);

    let redPartGeometry = new THREE.ExtrudeGeometry(redPartShape, {depth: 7, bevelEnabled: false });
    let redPart  = new THREE.Mesh(redPartGeometry, redBaseMaterial);
    redPart.castShadow = true;
    styrHus.add(redPart)

    //styrhusdel
    let styrhusShape = new THREE.Shape();
    styrhusShape.moveTo(0,0);
    styrhusShape.lineTo(0, 2.5);
    styrhusShape.lineTo(2, 7.5);
    styrhusShape.lineTo(8, 7.5);
    styrhusShape.lineTo(8, 2.5);
    styrhusShape.lineTo(6,0);
    styrhusShape.lineTo(0,0);
    let styrHusGeometry = new THREE.ExtrudeGeometry(styrhusShape, {depth: 5, bevelEnabled: false});
    let styrhusDel = new THREE.Mesh(styrHusGeometry, whiteBaseMaterial)
    styrhusDel.castShadow = true;
    styrhusDel.position.z = 7
    styrHus.add(styrhusDel)

    let styrHusLightbar = CreatestyrhusLightBar(redBaseMaterial, ri)
    styrHusLightbar.position.set(-0.1, 1.25, 6);
    styrHus.add(styrHusLightbar)





    return styrHus

}





function CreatestyrhusLightBar(material, ri){

    let lightBar = new THREE.Group()
    let barBaseGeometry = new THREE.BoxGeometry(0.2, 2.5, 12);
    let barBase = new THREE.Mesh(barBaseGeometry, material)
    barBase.castShadow = true;
    lightBar.add(barBase)



    

    // add lys til hver


    let LeftLight = createHeadlight(ri)
    let RightLight = createHeadlight(ri)



    LeftLight.position.z = -3.5
    LeftLight.position.x = -0.1
    lightBar.add(LeftLight)

    RightLight.position.z = 3.5
    RightLight.position.x = -0.1
    lightBar.add(RightLight)


    return lightBar

    
}



function createExtrudeTriangle() {
    let triangleShape = new THREE.Shape();

    // Definer 2D trekant
    triangleShape.moveTo(0, 0);       
    triangleShape.lineTo(0, 1);         
    triangleShape.lineTo(10, 0);        
    triangleShape.lineTo(0, 0);         

    // Extrude  (z)
    let extrudeSettings = {
        depth: 4,                      // Set the depth (z = 4)
        bevelEnabled: false             // Disable bevel to keep sharp edges
    };

    
    let triangleGeometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

    return triangleGeometry;
}



function createHeadlight(ri){
    let Light = new THREE.Group();

    let headlightGeometry = new THREE.BoxGeometry(0.1, 1, 1.8)
    let headlightMaterial = new THREE.MeshStandardMaterial({color: 0xFFFF99})
    let headlightFrameGeometry = new THREE.BoxGeometry(0.2, 1.5, 2.2);
    let headlightFrameMaterial = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6})

    let headLight = new THREE.Mesh(headlightGeometry, headlightMaterial)
    headLight.castShadow = true;
    headLight.position.x = -0.1
    Light.add(headLight)
    let frame  = new THREE.Mesh(headlightFrameGeometry, headlightFrameMaterial)
    frame.castShadow = true;
    Light.add(frame)

    let targetObject = new THREE.Object3D();
    targetObject.position.set(-1, 0, 0);
    Light.add(targetObject);

    let spotLight = new THREE.SpotLight(0xffffaa,500,0)
    spotLight.visible = true;
    spotLight.castShadow = true; 
    spotLight.position.x = -0.1;
    spotLight.target = targetObject;
    Light.add(spotLight);

    return Light


    
}



function createSupportArm(){
let supportArm = new THREE.Group();

    let bar1Geometry = new THREE.BoxGeometry(1.2, 2.5, 7);
    let blackBaseMaterial = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6});
    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.6});
    let bar1 = new THREE.Mesh(bar1Geometry, blackBaseMaterial)
    bar1.castShadow = true;
    supportArm.add(bar1)
    let bar2Geometry = new THREE.BoxGeometry(1, 2.1, 6)
    let bar2 = new THREE.Mesh(bar2Geometry, blackBaseMaterial)
    bar2.castShadow = true;
    bar2.position.z = 5
    bar1.add(bar2)

    let cylinder1Geometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    let cylinder1 = new THREE.Mesh(cylinder1Geometry, whiteBaseMaterial)
    cylinder1.castShadow = true;
    cylinder1.position.set(0, -1.5, 2.5)
    bar2.add(cylinder1)

    let cylinder2Geometry = new THREE.CylinderGeometry(0.4, 0.4, 3);
    let cylinder2 = new THREE.Mesh(cylinder2Geometry, whiteBaseMaterial)
    cylinder2.castShadow = true;
    cylinder2.position.y = -1.5
    cylinder1.add(cylinder2)

    let coneGeometry = new THREE.CylinderGeometry(0.01, 1, 1.2);
    let cone = new THREE.Mesh(coneGeometry, whiteBaseMaterial)
    cone.castShadow = true;
    cone.position.y = -1.1;
    cylinder2.add(cone)


    return supportArm

}


export function createSupportArmPair(){
    let arms = new THREE.Group();

    let arm1 = createSupportArm()
    arms.add(arm1)
    let arm2 = createSupportArm()
    arm2.rotation.y = Math.PI;
    arm2.position.z = -13
    arms.add(arm2)

    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.6});
    let midBoxGeometry = new THREE.BoxGeometry(1.4, 2.6, 6);
    let midBox = new THREE.Mesh(midBoxGeometry, whiteBaseMaterial)
    midBox.castShadow = true;
    midBox.position.z = -6.5
    arms.add(midBox)

    return arms
}