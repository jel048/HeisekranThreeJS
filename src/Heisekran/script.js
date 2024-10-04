import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import GUI from "lil-gui";
import { createPlane, createSupportArmPair, createCraneBody, createTirePair, createStyrHus } from "./helpers";

const ri = {
	currentlyPressedKeys:[]
};

export function main() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// Renderer:
	ri.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
	ri.renderer.setSize(window.innerWidth, window.innerHeight);
	ri.renderer.setClearColor(0xBFD104, 0xff);  //farge, alphaverdi.
	ri.renderer.shadowMap.enabled = true; //NB!
	ri.renderer.shadowMapSoft = true;
	ri.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	// Scene
	ri.scene = new THREE.Scene();
	ri.scene.background = new THREE.Color( 0xdddddd );

	// lil-gui kontroller:
	ri.lilGui = new GUI();

	// Lys
	addLights();

	// Kamera:
	ri.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	ri.camera.position.x = -1;
	ri.camera.position.y =10;
	ri.camera.position.z = 20;

	// TrackballControls:
	ri.controls = new TrackballControls(ri.camera, ri.renderer.domElement);
	ri.controls.addEventListener( 'change', renderScene);

	// Klokke for animasjon
	ri.clock = new THREE.Clock();

	//Håndterer endring av vindusstørrelse:
	window.addEventListener('resize', onWindowResize, false);
	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// Sceneobjekter
	addSceneObjects();
}

function handleKeyUp(event) {
	ri.currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	ri.currentlyPressedKeys[event.code] = true;
}

function addSceneObjects() {
    const loadingManager = new THREE.LoadingManager();
	const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
	ri.cubeTexture = cubeTextureLoader
	.setPath('../../../assets/skyboxes/valley/')
	.load(
		[
		'../../../assets/skyboxes/valley/valley_rt.jpg',
		'../../../assets/skyboxes/valley/valley_lf.jpg',
		'../../../assets/skyboxes/valley/valley_up.jpg',
		'../../../assets/skyboxes/valley/valley_dn.jpg',
		'../../../assets/skyboxes/valley/valley_bk.jpg',
		'../../../assets/skyboxes/valley/valley_ft.jpg',
		]
	)
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const textureObjects = [];
    textureObjects[0] = textureLoader.load('../../../assets/textures/metal_tread_plate1_512x512_color.jpg');
    loadingManager.onLoad = () => {
      // Fortsetter...
	  ri.scene.background = ri.cubeTexture;
      addSceneObjectsContinued(textureObjects);
    }
  }
  


function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
	ambientLight1.visible = true;
	ri.scene.add(ambientLight1);
	const ambientFolder = ri.lilGui.addFolder( 'Ambient Light' );
	ambientFolder.add(ambientLight1, 'visible').name("On/Off");
	ambientFolder.add(ambientLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, 'color').name("Color");

	// Pointlight:
	let pointLight = new THREE.PointLight(0xffffff, 1000);
	pointLight.visible = true;
	pointLight.position.set(10, 20, 6);
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;
	pointLight.castShadow = true;
	ri.scene.add(pointLight);
	// Viser lyskilden:
	const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
	pointLightHelper.visible = true;
	ri.scene.add( pointLightHelper );
	//lil-gui:
	const pointLigthFolder = ri.lilGui.addFolder( 'Pointlight' );
	pointLigthFolder.add(pointLight, 'visible').name("On/Off").onChange(value => {
		pointLightHelper.visible = value;
	});
	pointLigthFolder.add(pointLight, 'intensity').min(0).max(1000).step(10).name("Intensity");
	pointLigthFolder.addColor(pointLight, 'color').name("Color");
	pointLigthFolder.add(pointLight.position, 'y').min(0).max(10).step(0.001).name("Height");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = false;
	directionalLight.position.set(0, 6, 0);
	directionalLight.castShadow = true;
	ri.scene.add(directionalLight);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = false;
	ri.scene.add(directionalLightHelper);

	//lil-gui:
	const directionalFolder = ri.lilGui.addFolder( 'Directional Light' );
	directionalFolder.add(directionalLight, 'visible').name("On/Off");
	directionalFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	directionalFolder.addColor(directionalLight, 'color').name("Color");
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = ri.clock.getDelta();
	let elapsed = ri.clock.getElapsedTime();



	//Oppdater trackball-kontrollen:
	ri.controls.update();

	//Sjekker input:
	handleKeys(delta);

	//Tegner scenen med gitt kamera:
	renderScene();
}

function renderScene()
{
	ri.renderer.render(ri.scene, ri.camera);
}


function onWindowResize() {
	ri.camera.aspect = window.innerWidth / window.innerHeight;
	ri.camera.updateProjectionMatrix();
	ri.renderer.setSize(window.innerWidth, window.innerHeight);
	ri.controls.handleResize();
	renderScene();
}

//Sjekker tastaturet:
function handleKeys(delta) {
}

function addSceneObjectsContinued(textureObjects) {
	let crane = createCrane(textureObjects)
	ri.scene.add(crane)

	createPlane(ri, textureObjects)
    animate(0);
  }









function createCrane(textureObjects){
	let Crane = new THREE.Group();

	let craneBody = craneBodyWithWheels(ri);
	Crane.add(craneBody);
    
	let styrHus = createStyrHus(ri);
	styrHus.position.set(-25.5, 2.5, -6);
	Crane.add(styrHus);

	let supportArms1 = createSupportArmPair()
	supportArms1.position.set(-2, 4.7, 6.5)
	Crane.add(supportArms1)

	let supportArms2 = createSupportArmPair()
	supportArms2.position.set(18, 4.7, 6.5)
	Crane.add(supportArms2)

	return Crane
}






  function craneBodyWithWheels(){
	let grp = new THREE.Group();

	let craneBody = createCraneBody(ri)
	grp.add(craneBody)

	let tirePair1 = createTirePair(ri)
	tirePair1.position.set(-16, 2.5, 0)

	let tirepair2 = createTirePair(ri)
	tirepair2.position.set(-11, 2.5, 0)

	let tirepair3 = createTirePair(ri)
	tirepair3.position.set(5, 2.5, 0)

	let tirepair4 = createTirePair(ri)
	tirepair4.position.set(10, 2.5, 0)

	let tirepair5 = createTirePair(ri)
	tirepair5.position.set(15, 2.5, 0)


	grp.add(tirePair1)
	grp.add(tirepair2)
	grp.add(tirepair3)
	grp.add(tirepair4)
	grp.add(tirepair5)

	return grp

  }