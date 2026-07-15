interface Vector3D { x: number; y: number; z: number; }
interface Point2D { x: number; y: number; }
interface Edge { start: number; end: number; }
namespace wireframe3d {
    const FOV = 60; 

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

    /**
     * Creates a new 3D coordinate point
     */
    // % block="create 3D point x $x y $y z $z"
    // % blockSetVariable=point
    export function createPoint(x: number, y: number, z: number): Vector3D {
        return { x: x, y: y, z: z };
    }

    /**
     * Connects two numbered vertex points with an edge line
     */
    // % block="connect point index $start to index $end"
    // % blockSetVariable=edge
    export function createEdge(start: number, end: number): Edge {
        return { start: start, end: end };
    }

    /**
     * Draws the full 3D wireframe mesh on screen
     */
    // % block="render wireframe $vertices edges $edges angle Y $angleY camera distance $camZ color $color"
    // % color.shadow="colorindexpicker"
    export function render(vertices: Vector3D[], edges: Edge[], angleY: number, camZ: number, color: number) {
        const projected: Point2D[] = [];
        for (let i = 0; i < vertices.length; i++) {
            projected.push(project(rotateY(vertices[i], angleY), camZ));
        }
        const img = scene.backgroundImage();
        for (let j = 0; j < edges.length; j++) {
            const p1 = projected[edges[j].start];
            const p2 = projected[edges[j].end];
            img.drawLine(p1.x, p1.y, p2.x, p2.y, color);
        }
    }
}
