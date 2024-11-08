class OceanTerrain extends WireframeBase {
    createTerrain() {
        this.points = [];
        this.edges = [];
        
        const segments = 20;
        const size = 200;
        const waveHeight = 15;
        
        for (let i = 0; i <= segments; i++) {
            for (let j = 0; j <= segments; j++) {
                const x = (i / segments - 0.5) * size;
                const z = (j / segments - 0.5) * size;
                const y = -Math.sin(i * 0.5 + this.rotation.y) * 
                         Math.cos(j * 0.5 + this.rotation.y) * waveHeight;
                this.points.push({x, y, z});
                
                if (i < segments && j < segments) {
                    const index = i * (segments + 1) + j;
                    this.edges.push(
                        [index, index + 1],
                        [index, index + segments + 1]
                    );
                }
            }
        }
    }
}
