import * as THREE from "three";
import { clearcoat, cubeTexture, metalness } from "three/webgpu";


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

    let ladder = createRedLadder(ri)
    ladder.position.set(-4.7,-1.95, 6)
    whiteBase.add(ladder)

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
    let chimney = addChimney(ri)
    chimney.position.set(-2, 2, 0)
    rightDetail.add(chimney)


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

    //vinduer
    let windowMaterial = new THREE.MeshPhysicalMaterial({color: 0x555555, roughness: 0, metalness :1, clearcoat: 1})
    windowMaterial.envMap = ri.cubeTexture;

    //front
    let frontWindowGeometry = new THREE.BoxGeometry(0.2,5,4)
    let frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial)
    frontWindow.rotateZ(-Math.PI/8)
    frontWindow.position.set(1.05, 5, 2.5)
    styrhusDel.add(frontWindow)

    //sidevinduer
    let sidevindu1Geometry = new THREE.BoxGeometry(3.5, 3, 0.2)
    let sidevindu2Geometry = new THREE.BoxGeometry(1, 3, 0.2)
    let sidevindu3RightShape = new THREE.Shape()
    sidevindu3RightShape.moveTo(0,0)
    sidevindu3RightShape.lineTo(1,0)
    sidevindu3RightShape.lineTo(1,3)
    sidevindu3RightShape.lineTo(0,0)
    let sidevindu3RightGeometry = new THREE.ExtrudeGeometry(sidevindu3RightShape, {depth: 0.1, bevelEnabled : false})
    let sidevindu3Right = new THREE.Mesh(sidevindu3RightGeometry, windowMaterial)
    sidevindu3Right.position.set(-3, -1.5, 0)
    


    let rightSideVindu1 =   new THREE.Mesh(sidevindu1Geometry, windowMaterial)
    let rightSideVindu2 = new THREE.Mesh(sidevindu2Geometry, windowMaterial)
    rightSideVindu2.position.x = 3
    let rightSideVinduer = new THREE.Group()
    rightSideVinduer.add(rightSideVindu1)
    rightSideVinduer.add(rightSideVindu2)
    rightSideVinduer.add(sidevindu3Right)
    rightSideVinduer.position.set(4, 5.5, 5)

    let leftSideVindu1 =   new THREE.Mesh(sidevindu1Geometry, windowMaterial)
    let leftSideVindu2 = new THREE.Mesh(sidevindu2Geometry, windowMaterial)
    leftSideVindu2.position.x =2.5 

    let sidevindu3Left = new THREE.Mesh(sidevindu3RightGeometry, windowMaterial)
    sidevindu3Left.position.set(-2.9,-1.5,0)


    let leftSideVinduer = new THREE.Group()
    leftSideVinduer.add(leftSideVindu1)
    leftSideVinduer.add(leftSideVindu2)
    leftSideVinduer.add(sidevindu3Left)
    leftSideVinduer.position.set(3.8, 5.5, -0.1)

    styrhusDel.add(rightSideVinduer)
    styrhusDel.add(leftSideVinduer)


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



function createSupportArm(ri, name){
let supportArm = new THREE.Group();

    let bar1Geometry = new THREE.BoxGeometry(1.2, 2.5, 7);
    let blackBaseMaterial = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6});
    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.6});
    let bar1 = new THREE.Mesh(bar1Geometry, blackBaseMaterial)
    bar1.castShadow = true;
    supportArm.add(bar1)
    let bar2Geometry = new THREE.BoxGeometry(1, 2.1, 6)
    let bar2 = new THREE.Mesh(bar2Geometry, blackBaseMaterial)
    bar2.name = 'supportArm' + name
    bar2.castShadow = true;
    bar2.position.z = ri.animation.supportArmExtent
    bar1.add(bar2)

    let cylinder1Geometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    let cylinder1 = new THREE.Mesh(cylinder1Geometry, whiteBaseMaterial)
    cylinder1.castShadow = true;
    cylinder1.position.set(0, -1.5, 2.5)
    bar2.add(cylinder1)

    let cylinder2Geometry = new THREE.CylinderGeometry(0.4, 0.4, 3);
    let cylinder2 = new THREE.Mesh(cylinder2Geometry, whiteBaseMaterial)
    cylinder2.name = 'supportFoot' + name
    cylinder2.castShadow = true;
    cylinder2.position.y = ri.animation.supportFootExtent
    cylinder1.add(cylinder2)

    let coneGeometry = new THREE.CylinderGeometry(0.01, 1, 1.2);
    let cone = new THREE.Mesh(coneGeometry, whiteBaseMaterial)
    cone.castShadow = true;
    cone.position.y = -1.1;
    cylinder2.add(cone)


    return supportArm

}


export function createSupportArmPair(ri, name){
    let arms = new THREE.Group();
    let name1 = name +'1'
    let arm1 = createSupportArm(ri, name1)
    arms.add(arm1)
    let name2 = name + '2'
    let arm2 = createSupportArm(ri, name2)
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




export function createCraneBoomBase(ri){
    let craneBoomBase = new THREE.Group();

    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.9});
    whiteBaseMaterial.envMap = ri.cubeTexture;
    let blackBaseMaterial = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6});
    //Hvit box
    let baseWhiteBoxGeometry = new THREE.BoxGeometry(11, 5, 12);
    let baseWhiteBox = new THREE.Mesh(baseWhiteBoxGeometry, whiteBaseMaterial)
    baseWhiteBox.castShadow = true;
    craneBoomBase.add(baseWhiteBox)

    let ladder = createRedLadder(ri)
    ladder.position.set(-7, -1.95, 6)
    //hvit box tak
    let whiteBoxRoofGeometry = new THREE.BoxGeometry(15, 1, 12)
    let whiteBoxRoof = new THREE.Mesh(whiteBoxRoofGeometry, whiteBaseMaterial)
    whiteBoxRoof.castShadow = true;
    whiteBoxRoof.position.set(2, 3, 0)
    baseWhiteBox.add(whiteBoxRoof)
    whiteBoxRoof.add(ladder)

    let fence1 = createFence(ri, whiteBaseMaterial)
    fence1.position.set(-4, 1.5, 5.5)
    whiteBoxRoof.add(fence1)

    let fence2 = createFence(ri, whiteBaseMaterial)
    fence2.position.set(-4, 1.5, -5.5)
    whiteBoxRoof.add(fence2)

    let rightBoomSupport = createBoomSupport(whiteBaseMaterial)
    rightBoomSupport.position.set(-7.5, 0.5, 2.5)
    whiteBoxRoof.add(rightBoomSupport)

    let leftBoomSupport = createBoomSupport(whiteBaseMaterial)
    leftBoomSupport.position.set(-7.5, 0.5, -4.5)
    whiteBoxRoof.add(leftBoomSupport)

    let roofCylinderGeometry = new THREE.CylinderGeometry(2,2,4)
    let roofCylinder = new THREE.Mesh(roofCylinderGeometry, whiteBaseMaterial)
    roofCylinder.castShadow = true;
    roofCylinder.rotateX(Math.PI/2)
    roofCylinder.position.set(6, 1.8, -1.5)
    whiteBoxRoof.add(roofCylinder)

    let roofCylinder2Geometry = new THREE.CylinderGeometry(0.5,0.5,4.2)
    let roofCylinder2 = new THREE.Mesh(roofCylinder2Geometry, blackBaseMaterial)
    roofCylinder2.castShadow = true;
    roofCylinder2.rotateX(Math.PI/2)
    roofCylinder2.position.set(6, 1.8, -1.5)
    whiteBoxRoof.add(roofCylinder2)



    //svart boks bak
    let blackBoxBackGeometry = new THREE.BoxGeometry(4, 5, 16);
    let blackBoxBack = new THREE.Mesh(blackBoxBackGeometry, blackBaseMaterial)
    blackBoxBack.castShadow = true;
    blackBoxBack.position.set(7.5, 0, 0)
    craneBoomBase.add(blackBoxBack)

    let styrhus = createCraneStyrhus(ri, whiteBaseMaterial)
    styrhus.position.set(-9.5, -2.5, -2.5)
    craneBoomBase.add(styrhus)

    //rotasjonsbase
    let rotationCylinderGeometry = new THREE.CylinderGeometry(3, 3, 1)
    let rotationCylinder = new THREE.Mesh(rotationCylinderGeometry, blackBaseMaterial)
    rotationCylinder.position.set(0, 0, 0)

    craneBoomBase.position.y = 3
    rotationCylinder.add(craneBoomBase)
    












    return rotationCylinder;
}





function createCraneStyrhus(ri, material){
    let craneStyrhus = new THREE.Group();
    let styrhusShape = new THREE.Shape();
    styrhusShape.moveTo(0,0);
    styrhusShape.lineTo(4,0);
    styrhusShape.lineTo(4,8);
    styrhusShape.lineTo(1,8);
    styrhusShape.lineTo(-1, 2);
    styrhusShape.lineTo(0,0)
    let styrHusGeometry = new THREE.ExtrudeGeometry(styrhusShape, {depth: 5, bevelEnabled: false});
    let styrhusDel = new THREE.Mesh(styrHusGeometry, material)
    styrhusDel.castShadow = true;
    styrhusDel.position.set(0,0, 3.5)
    craneStyrhus.add(styrhusDel)
    //vinduer
    let windowMaterial = new THREE.MeshPhysicalMaterial({color: 0x555555, roughness: 0, metalness :1, clearcoat: 1})
    windowMaterial.envMap = ri.cubeTexture;

    let sideVinduShape = new THREE.Shape()
    sideVinduShape.moveTo(0,0)
    sideVinduShape.lineTo(1, 0)
    sideVinduShape.lineTo(3.4, 1)
    sideVinduShape.lineTo(3.4, 4)
    sideVinduShape.lineTo(1, 4)
    sideVinduShape.lineTo(0, 0)
    let sidevinduGeometry = new THREE.ExtrudeGeometry(sideVinduShape, {depth: 0.2, bevelEnabled: false})

    let rightSideVindu = new THREE.Mesh(sidevinduGeometry, windowMaterial)
    rightSideVindu.position.set(0.2, 3.8, 8.5)
    let leftSideVindu = new THREE.Mesh(sidevinduGeometry, windowMaterial)
    leftSideVindu.position.set(0.2, 3.8,3.3)

    let frontVinduGeometry = new THREE.BoxGeometry(0.2, 5, 4)
    let frontVindu = new THREE.Mesh(frontVinduGeometry, windowMaterial)
    frontVindu.rotateZ(-Math.PI/9.5)
    frontVindu.position.set(0.2, 5.5, 6)


    craneStyrhus.add(rightSideVindu)
    craneStyrhus.add(leftSideVindu)
    craneStyrhus.add(frontVindu)

    
    
    return craneStyrhus

}

function createBoomSupport(material){
    let supportShape = new THREE.Shape();
    supportShape.moveTo(0,0)
    supportShape.lineTo(12, 0)
    supportShape.lineTo(12, 2)
    supportShape.lineTo(7, 2)
    supportShape.lineTo(0,1)
    supportShape.lineTo(0,0)
    let supportGeometry = new THREE.ExtrudeGeometry(supportShape, {depth: 2, bevelEnabled: false})
    let support = new THREE.Mesh(supportGeometry, material)
    support.castShadow = true;
    return support
}

export function createCraneBoom(ri){
    let craneBoom = new THREE.Group()
    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.9});
    whiteBaseMaterial.envMap = ri.cubeTexture;
    let blackBaseMaterial = new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.3, metalness : 0.6});
    //1st
    let firstBoomShape = new THREE.Shape()
    firstBoomShape.moveTo(0,0)
    firstBoomShape.lineTo(1, 0)
    firstBoomShape.lineTo(1.5, 0.5)
    firstBoomShape.lineTo(1.5, 4.5)
    firstBoomShape.lineTo(1, 5.5)
    firstBoomShape.lineTo(0, 5.5)
    firstBoomShape.lineTo(-0.5, 4.5)
    firstBoomShape.lineTo(-0.5, 0.5)
    firstBoomShape.lineTo(0,0)

    let firstBoomGeometry = new THREE.ExtrudeGeometry(firstBoomShape, {depth: 40, bevelEnabled: false})
    let firstBoom = new THREE.Mesh(firstBoomGeometry, whiteBaseMaterial)
    firstBoom.name = 'firstBoom'
    firstBoom.castShadow= true;
    firstBoom.rotateY(-Math.PI/2)
    firstBoom.rotateX(ri.animation.boomAngle)
    craneBoom.add(firstBoom)
    let blackDisk = createBlackDisk(ri)
    blackDisk.position.set(1.5,4,30)
    firstBoom.add(blackDisk)

    let wirePointGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1)
    let wirePoint = new THREE.Mesh(wirePointGeometry, blackBaseMaterial)
    wirePoint.name = 'wirePoint1'
    wirePoint.rotateX(Math.PI/2)
    wirePoint.position.set(0.6, 4.7, 40.1)

    firstBoom.add(wirePoint)




    let secondBoomShape = new THREE.Shape()
    secondBoomShape.moveTo(0,0)
    secondBoomShape.lineTo(0.8, 0)
    secondBoomShape.lineTo(1.1, 0.3)
    secondBoomShape.lineTo(1.1, 3.4)
    secondBoomShape.lineTo(0.8, 3.7)
    secondBoomShape.lineTo(0, 3.7)
    secondBoomShape.lineTo(-0.3, 3.4)
    secondBoomShape.lineTo(-0.3, 0.3)
    secondBoomShape.lineTo(0,0)

    let secondBoomGeometry = new THREE.ExtrudeGeometry(secondBoomShape, {depth: 35, bevelEnabled: false})
    let secondBoom = new THREE.Mesh(secondBoomGeometry, blackBaseMaterial)
    secondBoom.name = 'secondBoom'
    secondBoom.castShadow = true;
    secondBoom.position.set(0.1, 0.5, ri.animation.secondBoomExtent)
    firstBoom.add(secondBoom)

    let boomEndShape = new THREE.Shape();
    boomEndShape.moveTo(0,0)
    boomEndShape.lineTo(4.5,0)
    boomEndShape.lineTo(5.5, 1,5)
    boomEndShape.lineTo(-1, 1.5)
    boomEndShape.lineTo(-1, 1)
    boomEndShape.lineTo(0,0)
    let boomEndGeometry = new THREE.ExtrudeGeometry(boomEndShape,{depth: 2, bevelEnabled: false} ) 
    let boomEnd = new THREE.Mesh(boomEndGeometry, blackBaseMaterial)
    boomEnd.castShadow = true;
    boomEnd.rotateZ(Math.PI/2)
    boomEnd.rotateX(Math.PI/2)
    boomEnd.position.set(-0.5, -0.5 ,35)
    secondBoom.add(boomEnd)

    let wirePoint2Geometry = new THREE.CylinderGeometry(0.3, 0.3, 1)
    let wirePoint2 = new THREE.Mesh(wirePoint2Geometry, blackBaseMaterial)
    wirePoint2.name = 'wirePoint2'
    wirePoint2.position.set(4.7, 0, 1)
    boomEnd.add(wirePoint2)

    

    
    
    return craneBoom


}



function createRedLadder(ri){
    let redBaseMaterial = new THREE.MeshStandardMaterial({color: 0xee2222, roughness: 0.1, metalness : 0.9});
    redBaseMaterial.envMap = ri.cubeTexture;
    let ladderGrp = new THREE.Group()

    let verticalBarGeometry = new THREE.BoxGeometry(0.3, 5, 0.3)
    let horizontalBarGeometry = new THREE.BoxGeometry(2, 0.3, 0.3)
    let leftBar = new THREE.Mesh(verticalBarGeometry, redBaseMaterial)
    let rightBar = new THREE.Mesh(verticalBarGeometry, redBaseMaterial)
    rightBar.position.x = 2
    

    let bar1 = new THREE.Mesh(horizontalBarGeometry, redBaseMaterial)
    bar1.position.set(1, 2, 0)
    let bar2 = new THREE.Mesh(horizontalBarGeometry, redBaseMaterial)
    bar2.position.set(1, 1, 0)
    let bar3 = new THREE.Mesh(horizontalBarGeometry, redBaseMaterial)
    bar3.position.set(1, 0, 0)
    let bar4 = new THREE.Mesh(horizontalBarGeometry, redBaseMaterial)
    bar4.position.set(1, -1, 0)
    let bar5 = new THREE.Mesh(horizontalBarGeometry, redBaseMaterial)
    bar5.position.set(1, -2, 0)

    ladderGrp.add(leftBar)
    ladderGrp.add(rightBar)
    ladderGrp.add(bar1)
    ladderGrp.add(bar2)
    ladderGrp.add(bar3)
    ladderGrp.add(bar4)
    ladderGrp.add(bar5)


    return ladderGrp
}



function createFence(ri, material){
    let fenceGrp = new THREE.Group()
    
    let verticalPoleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2)
    let horizontalBarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10)

    let pole1 = new THREE.Mesh(verticalPoleGeometry, material)
    let pole2 = new THREE.Mesh(verticalPoleGeometry, material)
    pole2.position.x = 5
    let pole3 = new THREE.Mesh(verticalPoleGeometry, material)
    pole3.position.x = 10

    let bar1 = new THREE.Mesh(horizontalBarGeometry, material)
    bar1.rotateZ(Math.PI/2)
    bar1.position.y = 0.7
    let bar2 = new THREE.Mesh(horizontalBarGeometry, material)
    bar2.rotateZ(Math.PI/2)
    bar2.position.y = -0.5

    pole2.add(bar1)
    pole2.add(bar2)


    fenceGrp.add(pole1)
    fenceGrp.add(pole2)
    fenceGrp.add(pole3)



    return fenceGrp
}


function createBlackDisk(ri){

    let diskGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32); 
    let diskMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    let whiteBaseMaterial = new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3, metalness : 0.9});
    whiteBaseMaterial.envMap = ri.cubeTexture;
    let disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.castShadow = true;
    disk.rotation.z = Math.PI / 2; // Roter til stående

    let smallerDiskGeometry = new THREE.CylinderGeometry(1.5, 1.5,0.4)
    let smallerDisk = new THREE.Mesh(smallerDiskGeometry, whiteBaseMaterial)
    smallerDisk.position.y = -0.2
    disk.add(smallerDisk)
    
    let spokeGrp = new THREE.Group()

    for (let i = 0; i < 4; i++) {
        let spokeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);  
        let spoke = new THREE.Mesh(spokeGeometry, whiteBaseMaterial);
        let angle = i * Math.PI/4;
        spoke.rotation.z = angle 
        spokeGrp.add(spoke);}

    
    spokeGrp.rotateX(Math.PI/2)    
    spokeGrp.position.set(0, -0.2, 0)
    disk.add(spokeGrp)




    return disk



}


function addChimney(ri){
    let chimneyMaterial = new THREE.MeshStandardMaterial()
    chimneyMaterial.metalness = 1;
    chimneyMaterial.roughness =0.01;
    chimneyMaterial.side = 
    chimneyMaterial.envMap = ri.cubeTexture;
    let chimneyBaseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4)
    let chimneyBase = new THREE.Mesh(chimneyBaseGeometry, chimneyMaterial) 
    let chimneyBendGeometry = new THREE.TorusGeometry(1, 0.3, 10, 10, 2.5)
    let chimneyBend = new THREE.Mesh(chimneyBendGeometry, chimneyMaterial)
    chimneyBend.rotateY(Math.PI)
    chimneyBend.position.set(1,2,0)
    chimneyBase.add(chimneyBend)


    return chimneyBase
}