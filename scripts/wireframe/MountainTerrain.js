class MountainTerrain extends WireframeBase {
    createTerrain() {
        this.points = [];
        this.edges = [];
        
        for (let i = 0; i < 5; i++) {
            const x = (i - 2) * 50;
            const height = 80 + Math.random() * 40;
            this.createPeak(x, height);
        }
    }

    createPeak(x, height) {
        const baseIndex = this.points.length;
        const baseWidth = 40;
        const segments = 8;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const px = x + Math.cos(angle) * baseWidth;
            const pz = Math.sin(angle) * baseWidth;
            this.points.push({x: px, y: 0, z: pz});
        }
        
        this.points.push({x: x, y: -height, z: 0});
        
        for (let i = 0; i < segments; i++) {
            this.edges.push(
                [baseIndex + i, baseIndex + i + 1],
                [baseIndex + i, baseIndex + segments + 1]
            );
        }
    }
}
