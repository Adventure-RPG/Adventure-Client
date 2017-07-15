import * as THREE from 'three';

export class CubicGrid {
    constructor() {}

    private _figure: THREE.Mesh;

    public get figure():THREE.Mesh{
        return this._figure;
    }

    public set figure(figure:THREE.Mesh){
        this._figure = figure;
    }

    public addGeometry(settings) {

        let geometry,
            material,
            mapSize = 30;

        for (let i = 0, lenX = mapSize; i < lenX; i++) {
            for (let j = 0, lenY = mapSize; j < lenY; j++) {
                geometry = new THREE.BoxBufferGeometry(10, 0, 10);
                material = new THREE.MeshLambertMaterial({});
                this.figure = new THREE.Mesh(geometry, material);
                this.figure.position.x = i*10-mapSize/2*10;
                this.figure.position.y = -10;
                this.figure.position.z = j*10-mapSize/2*10;
            }
        }
        console.log(this.figure);

	}
}

