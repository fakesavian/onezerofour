class WireframeMesh {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.edges = [];
        this.rotation = { x: 0, y: 0, z: 0 };
        this.rotationSpeed = 0;
        
        this.setupCanvas();
        this.animate();
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('wheel', (e) => {
            this.rotationSpeed += e.deltaY * 0.0005;
            // Add friction
            setTimeout(() => {
                this.rotationSpeed *= 0.95;
            }, 50);
        });
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    createCityscape() {
        this.points = [];
        this.edges = [];
        
        // Create multiple buildings
        for (let i = 0; i < 5; i++) {
            const x = (i - 2) * 40;
            const height = 50 + Math.random() * 100;
            const width = 20;
            
            // Base points
            const baseIndex = this.points.length;
            this.points.push(
                {x: x - width, y: 0, z: -width},
                {x: x + width, y: 0, z: -width},
                {x: x + width, y: 0, z: width},
                {x: x - width, y: 0, z: width},
                {x: x - width, y: -height, z: -width},
                {x: x + width, y: -height, z: -width},
                {x: x + width, y: -height, z: width},
                {x: x - width, y: -height, z: width}
            );
            
            // Connect base
            this.addEdges(baseIndex, [0,1, 1,2, 2,3, 3,0]);
            // Connect top
            this.addEdges(baseIndex, [4,5, 5,6, 6,7, 7,4]);
            // Connect verticals
            this.addEdges(baseIndex, [0,4, 1,5, 2,6, 3,7]);
        }
    }

    createMountains() {
        this.points = [];
        this.edges = [];
        
        for (let i = 0; i < 3; i++) {
            const x = (i - 1) * 60;
            const height = 80 + Math.random() * 40;
            const baseWidth = 40;
            
            const baseIndex = this.points.length;
            this.points.push(
                {x: x - baseWidth, y: 0, z: -baseWidth},
                {x: x + baseWidth, y: 0, z: -baseWidth},
                {x: x + baseWidth, y: 0, z: baseWidth},
                {x: x - baseWidth, y: 0, z: baseWidth},
                {x: x, y: -height, z: 0}
            );
            
            // Connect base
            this.addEdges(baseIndex, [0,1, 1,2, 2,3, 3,0]);
            // Connect to peak
            this.addEdges(baseIndex, [0,4, 1,4, 2,4, 3,4]);
        }
    }

    createForest() {
        this.points = [];
        this.edges = [];
        
        for (let i = 0; i < 8; i++) {
            const x = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            const height = 30 + Math.random() * 20;
            const width = 15;
            
            const baseIndex = this.points.length;
            // Tree trunk
            this.points.push(
                {x: x - width/3, y: 0, z: z - width/3},
                {x: x + width/3, y: 0, z: z - width/3},
                {x: x + width/3, y: 0, z: z + width/3},
                {x: x - width/3, y: 0, z: z + width/3},
                {x: x - width/3, y: -height/2, z: z - width/3},
                {x: x + width/3, y: -height/2, z: z - width/3},
                {x: x + width/3, y: -height/2, z: z + width/3},
                {x: x - width/3, y: -height/2, z: z + width/3},
                // Tree top
                {x: x - width, y: -height/2, z: z - width},
                {x: x + width, y: -height/2, z: z - width},
                {x: x + width, y: -height/2, z: z + width},
                {x: x - width, y: -height/2, z: z + width},
                {x: x, y: -height, z: z}
            );
            
            // Connect trunk
            this.addEdges(baseIndex, [0,1, 1,2, 2,3, 3,0]);
            this.addEdges(baseIndex, [4,5, 5,6, 6,7, 7,4]);
            this.addEdges(baseIndex, [0,4, 1,5, 2,6, 3,7]);
            
            // Connect top
            this.addEdges(baseIndex, [8,9, 9,10, 10,11, 11,8]);
            this.addEdges(baseIndex, [8,12, 9,12, 10,12, 11,12]);
        }
    }

    createOcean() {
        this.points = [];
        this.edges = [];
        
        const segments = 12;
        const size = 200;
        const waveHeight = 15;
        
        for (let i = 0; i <= segments; i++) {
            for (let j = 0; j <= segments; j++) {
                const x = (i / segments - 0.5) * size;
                const z = (j / segments - 0.5) * size;
                const y = -Math.sin(i * 0.5) * Math.cos(j * 0.5) * waveHeight;
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

    addEdges(baseIndex, connections) {
        for (let i = 0; i < connections.length; i += 2) {
            this.edges.push([
                baseIndex + connections[i],
                baseIndex + connections[i + 1]
            ]);
        }
    }

    setTerrain(type) {
        switch (type) {
            case 'mountain':
                this.createMountains();
                break;
            case 'cityscape':
                this.createCityscape();
                break;
            case 'forest':
                this.createForest();
                break;
            case 'ocean':
                this.createOcean();
                break;
        }
    }

    project(point) {
        const scale = 1.5;
        const perspective = 800;
        
        // Apply rotation
        let x = point.x;
        let y = point.y;
        let z = point.z;
        
        // Rotate around Y
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);
        const tempX = x;
        x = x * cosY - z * sinY;
        z = tempX * sinY + z * cosY;
        
        // Rotate around X
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        const tempY = y;
        y = y * cosX - z * sinX;
        z = tempY * sinX + z * cosX;
        
        // Apply perspective
        const s = perspective / (perspective + z);
        return {
            x: this.canvas.width/2 + x * s * scale,
            y: this.canvas.height/2 + y * s * scale
        };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 1;
        
        // Draw edges
        this.ctx.beginPath();
        for (const edge of this.edges) {
            const p1 = this.project(this.points[edge[0]]);
            const p2 = this.project(this.points[edge[1]]);
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
        }
        this.ctx.stroke();
    }

    animate() {
        this.rotation.y += this.rotationSpeed;
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
