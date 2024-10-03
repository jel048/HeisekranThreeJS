import * as THREE from "three";


export function createPlane(ri, textureObjects){
    const colorMap = textureObjects[0];

    let gPlane = new THREE.PlaneGeometry(100, 100, 10, 10);
			let mPlane = new THREE.MeshStandardMaterial({ map: colorMap, side: THREE.DoubleSide, wireframe:false });
			let meshPlane = new THREE.Mesh(gPlane, mPlane);
			meshPlane.rotation.x = Math.PI / 2;
			meshPlane.receiveShadow = true;	//NB!
			ri.scene.add(meshPlane);
}



export function createTire(){
let tireGrp = new THREE.Group()
const tireGeometry = new THREE.CylinderGeometry(5, 5, 2, 32); 
const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const tire = new THREE.Mesh(tireGeometry, tireMaterial);
tire.rotation.z = Math.PI / 2; // Roter til stående
tireGrp.add(tire);

const rimGeometry = new THREE.CylinderGeometry(2, 2, 2.2, 32);  
const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x999999, metalness : 0.6, roughness: 0.1 });
const rim = new THREE.Mesh(rimGeometry, rimMaterial);
rim.rotation.z = Math.PI / 2;
tireGrp.add(rim);



const hubGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
const hubcap = new THREE.Mesh(hubGeometry, rimMaterial);
hubcap.position.x = 1.2
hubcap.rotation.z = Math.PI / 2;
tireGrp.add(hubcap);

let treadGrp = new THREE.Group()
for (let i = 0; i < 16; i++) {
    const treadGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);  // Simple box treads
    const treadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.6 });
    const tread = new THREE.Mesh(treadGeometry, treadMaterial);

    // Calculate position along tire circumference
    const angle = (i / 16) * Math.PI * 2;
    tread.position.x = Math.cos(angle) * 5.1;  // Outer edge of tire
    tread.position.y = Math.sin(angle) * 5.1;
    tread.position.z = 0  // Randomize tread position along Z-axis

    // Rotate to follow tire surface
    tread.rotation.z = angle;
    
    treadGrp.add(tread);
}
treadGrp.rotation.y = Math.PI/2;
tireGrp.add(treadGrp)

return tireGrp

}