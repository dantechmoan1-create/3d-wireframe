interface Vector3D { x: number; y: number; z: number; }
interface Point2D { x: number; y: number; }
interface Edge { start: number; end: number; }

class Mesh3D {
    name: string;
    vertices: Vector3D[];
    edges: Edge[];
    constructor(name: string) {
        this.name = name;
        this.vertices = [];
        this.edges = [];
    }
}

// % color="#4A90E2" icon="\uf1b2" block="3D Wireframe"
namespace wireframe3d {
    const FOV = 60;
    let objects: Mesh3D[] = [];

    function project(v: Vector3D, camZ: number): Point2D {
        let dist = v.z + camZ;
        if (dist <= 0.1) dist = 0.1;
        return {
            x: Math.round((v.x * FOV) / dist) + 80,
            y: Math.round((v.y * FOV) / dist) + 60
        };
    }

    function rotateY(v: Vector3D, angle: number): Vector3D {
        const rad = angle * (Math.PI / 180);
        return {
            x: v.x * Math.cos(rad) - v.z * Math.sin(rad),
            y: v.y,
            z: v.x * Math.sin(rad) + v.z * Math.cos(rad)
        };
    }

    function findObj(name: string): Mesh3D {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].name === name) return objects[i];
        }
        return null;
    }

    /**
     * Creates a new empty 3D object registry
     */
    // % block="create OBJ name %name"
    export function createMesh(name: string): void {
        if (!findObj(name)) {
            objects.push(new Mesh3D(name));
        }
    }

    /**
     * Adds two points and instantly connects them with an edge line
     */
    // % block="add line to obj %name from x %x1 y %y1 z %z1 to x %x2 y %y2 z %z2"
    export function addLineToObj(name: string, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void {
        let obj = findObj(name);
        if (!obj) return;

        obj.vertices.push({ x: x1, y: y1, z: z1 });
        let idx1 = obj.vertices.length - 1;

        obj.vertices.push({ x: x2, y: y2, z: z2 });
        let idx2 = obj.vertices.length - 1;

        obj.edges.push({ start: idx1, end: idx2 });
    }

    /**
     * Renders a specific registered 3D object by its name string
     */
    // % block="render OBJ %name angle Y %angleY camera distance %camZ color %color"
    // % color.shadow="colorindexpicker"
    export function renderMesh(name: string, angleY: number, camZ: number, color: number): void {
        let obj = findObj(name);
        if (!obj) return;

        const projected: Point2D[] = [];
        for (let i = 0; i < obj.vertices.length; i++) {
            projected.push(project(rotateY(obj.vertices[i], angleY), camZ));
        }
        const img = scene.backgroundImage();
        for (let i = 0; i < obj.edges.length; i++) {
            const p1 = projected[obj.edges[i].start];
            const p2 = projected[obj.edges[i].end];
            img.drawLine(p1.x, p1.y, p2.x, p2.y, color);
        }
    }
}
