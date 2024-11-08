class ForestTerrain extends WireframeBase {
    createTerrain() {
        this.points = [];
        this.edges = [];
        
        for (let i = 0; i < 15; i++) {
            const x = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            const height = 20 + Math.random() * 15;
            this.createTree(x, z, height);
        }
    }

    createTree(x, z, height) {
        const baseIndex = this.points.length;
        const width = 15;
        
        // Trunk
        this.points.push(
            {x: x - 2, y: 0, z: z - 2},
            {x: x + 2, y: 0, z: z - 2},
            {x: x + 2, y: 0, z: z + 2},
            {x: x - 2, y: 0, z: z + 2},
            {x: x - 2, y: -height/3, z: z - 2},
            {x: x + 2, y: -height/3, z: z - 2},
            {x: x + 2, y: -height/3, z: z + 2},
            {x: x - 2, y: -height/3, z: z + 2}
        );
        
        this.addEdges(baseIndex, [0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7]);
        
        // Top
        const topBase = this.points.length;
        this.points.push(
            {x: x - width, y: -height/2, z: z - width},
            {x: x + width, y: -height/2, z: z - width},
            {x: x + width, y: -height/2, z: z + width},
            {x: x - width, y: -height/2, z: z + width},
            {x: x, y: -height, z: z}
        );
        
        this.addEdges(topBase, [0,1, 1,2, 2,3, 3,0, 0,4, 1,4, 2,4, 3,4]);
    }
}
